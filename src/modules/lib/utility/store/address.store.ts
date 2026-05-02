import { create } from "zustand";
import { Address } from "../types/address.interface";
import { addressService } from "../services/address.service";
import { User } from "../types/user.interface";
import { toast } from "sonner";
import useUserStore from "./user.store";
import { guestSession } from "../guest-session";

interface AddressStore {
  isAddressModalOpen: boolean;
  addresses: Address[] | null;
  selectedAddressId: Address["id"] | null;
  addressToUpdateId: Address["id"] | null;
  setAddressToUpdateId: (id: Address["id"] | null) => void;
  openAddressModal: () => void;
  closeAddressModal: () => void;
  fetchAddresses: (userId: User["id"]) => Promise<void>;
  selectAddress: (id: string) => void;
  updateAddress: (
    userId: User["id"],
    addressId: string,
    updatedData: Partial<Address>
  ) => Promise<void>;
  createAddress: (userId: string, newAddress: Address) => Promise<Address | null>;
  deleteAddress: (userId: string, addressId: Address["id"]) => Promise<void>;
}

const useAddressStore = create<AddressStore>((set) => ({
  isAddressModalOpen: false,
  addresses: null,
  selectedAddressId: null,
  addressToUpdateId: null,
  setAddressToUpdateId: (id: string | null) => set({ addressToUpdateId: id }),

  openAddressModal: () => set({ isAddressModalOpen: true }),
  closeAddressModal: () => set({ isAddressModalOpen: false }),

  fetchAddresses: async (userId: string) => {
    const { isAuthenticated } = useUserStore.getState();
    if (!isAuthenticated) {
      const addresses = guestSession.getAddresses();
      const defaultAddress =
        addresses.find((address) => address.isDefault) || addresses[0] || null;
      set({
        addresses,
        selectedAddressId: defaultAddress?.id || null,
      });
      return;
    }
    try {
      const fetchedAddresses = await addressService.fetchAddresses(userId);

      const defaultAddress =
        fetchedAddresses.find((address) => address.isDefault) || null;
      set({
        addresses: fetchedAddresses,
        selectedAddressId: defaultAddress?.id || null,
      });
    } catch (error) {
      set({ addresses: [], selectedAddressId: null });
    }
  },

  selectAddress: (id: string) => {
    const { isAuthenticated } = useUserStore.getState();
    if (!isAuthenticated) {
      const addresses = guestSession.getAddresses();
      guestSession.setAddresses(
        addresses.map((address) => ({ ...address, isDefault: address.id === id }))
      );
    }
    set({ selectedAddressId: id });
  },

  updateAddress: async (
    userId: string,
    addressId: string,
    updatedData: Partial<Address>
  ) => {
    const { isAuthenticated } = useUserStore.getState();
    if (!isAuthenticated) {
      const nextAddresses = guestSession.getAddresses().map((address) => {
        if (address.id !== addressId) {
          return updatedData.isDefault ? { ...address, isDefault: false } : address;
        }
        return { ...address, ...updatedData };
      });
      guestSession.setAddresses(nextAddresses);
      set({ addresses: nextAddresses, addressToUpdateId: null });
      return;
    }
    try {
      const updatedAddress = await addressService.updateAddress(
        userId,
        addressId,
        updatedData
      );

      if (updatedData.isDefault) {
        const addresses = await addressService.fetchAddresses(userId);

        const updatedPrevAddresses = addresses
          .filter((address) => address.id !== addressId && address.isDefault)
          .map((address) =>
            addressService.updateAddress(userId, address.id, {
              isDefault: false,
            })
          );

        await Promise.all(updatedPrevAddresses);
      }

      set((state) => ({
        addresses: state.addresses?.map((address) =>
          address.id === addressId
            ? updatedAddress
            : { ...address, isDefault: false }
        ),
        addressToUpdateId: null,
      }));
    } catch (error) {
    }
  },

  createAddress: async (userId: string, newAddress: Address) => {
    const { isAuthenticated } = useUserStore.getState();
    if (!isAuthenticated) {
      const existing = guestSession.getAddresses();
      const guestAddress = {
        ...newAddress,
        id: `guest-${Date.now()}`,
        userId: "guest",
      } as Address;
      const nextAddresses = [...existing, guestAddress].map((address) => ({
        ...address,
        isDefault: guestAddress.isDefault ? address.id === guestAddress.id : address.isDefault,
      }));
      guestSession.setAddresses(nextAddresses);
      set({ addresses: nextAddresses });
      return guestAddress;
    }
    try {
      const address = await addressService.createAddress(userId, newAddress);

      if (newAddress.isDefault) {
        const addresses = await addressService.fetchAddresses(userId);

        const updatedPrevAddresses = addresses
          .filter((addr) => addr.id !== address.id && addr.isDefault)
          .map((addr) =>
            addressService.updateAddress(userId, addr.id, { isDefault: false })
          );

        await Promise.all(updatedPrevAddresses);
      }

      set((state) => {
        let updatedAddresses = state.addresses || [];
        if (newAddress.isDefault) {
          updatedAddresses = updatedAddresses.map((addr) => ({
            ...addr,
            isDefault: false,
          }));
        }
        updatedAddresses = [...updatedAddresses, address];

        return { addresses: updatedAddresses };
      });
      return address;
    } catch (error: any) {
      toast.error(error.response.data.detail.message?.[0]);
      return null;
    }
  },

  deleteAddress: async (userId: string, addressId: string) => {
    const { isAuthenticated } = useUserStore.getState();
    if (!isAuthenticated) {
      const nextAddresses = guestSession
        .getAddresses()
        .filter((address) => address.id !== addressId);
      guestSession.setAddresses(nextAddresses);
      set({ addresses: nextAddresses });
      return;
    }
    try {
      await addressService.deleteAddress(userId, addressId);
      set((state) => ({
        addresses: (state.addresses || [])?.filter(
          (address) => address.id !== addressId
        ),
      }));
    } catch (error) {
    }
  },
}));

export default useAddressStore;
