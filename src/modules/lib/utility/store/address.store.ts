import { create } from "zustand";
import { Address } from "../types/address.interface";
import { addressService } from "../services/address.service";
import { User } from "../types/user.interface";
import { toast } from "sonner";

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
    set({ selectedAddressId: id });
  },

  updateAddress: async (
    userId: string,
    addressId: string,
    updatedData: Partial<Address>
  ) => {
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
