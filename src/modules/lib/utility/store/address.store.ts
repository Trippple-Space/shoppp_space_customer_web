import { create } from 'zustand';
import { Address } from '../types/address.interface';
import { addressService } from '../services/address.service';
import { User } from '../types/user.interface';
import { toast } from 'sonner';

interface AddressStore {
  isAddressModalOpen: boolean;
  addresses: Address[] | null;
  selectedAddressId: Address['id'] | null;
  addressToUpdateId: Address['id'] | null;
  setAddressToUpdateId: (id: Address['id'] | null) => void,
  openAddressModal: () => void;
  closeAddressModal: () => void;
  fetchAddresses: (userId: User['id']) => Promise<void>;
  selectAddress: (id: number) => void;
  updateAddress: (userId: User['id'], addressId: number, updatedData: Partial<Address>) => Promise<void>;
  createAddress: (userId: number, newAddress: Address) => Promise<void>;
  deleteAddress: (userId: number, addressId: Address['id']) => Promise<void>;
}

const useAddressStore = create<AddressStore>((set) => ({
  isAddressModalOpen: false,
  addresses: null,
  selectedAddressId: null,
  addressToUpdateId: null,
  setAddressToUpdateId: (id: number | null) => set({ addressToUpdateId: id }),

  openAddressModal: () => set({ isAddressModalOpen: true }),
  closeAddressModal: () => set({ isAddressModalOpen: false }),

  fetchAddresses: async (userId: number) => {
    try {
      const fetchedAddresses = await addressService.fetchAddresses(userId);
      set({ addresses: fetchedAddresses });
    } catch (error) {
      set({ addresses: []})
      console.error('Error fetching addresses:', error);
    }
  },

  selectAddress: (id: number) => {
    console.log({id})
    set({ selectedAddressId: id })
  },

  updateAddress: async (userId: number, addressId: number, updatedData: Partial<Address>) => {
    try {
      const updatedAddress = await addressService.updateAddress(userId, addressId, updatedData);
      set((state) => ({ addresses: state.addresses?.map(address => address.id === addressId ? updatedAddress : address), addressToUpdateId: null}))
    } catch (error) {
      console.error('Error updating address:', error);
    }
  },

  createAddress: async (userId: number, newAddress: Address) => {
    try {
      const address = await addressService.createAddress(userId, newAddress);
      set((state) => ({ addresses: [...(state.addresses || []), address] }));
    } catch (error: any) {
      toast.error(error.response.data.detail.message?.[0])
    }
  },

  deleteAddress: async (userId: number, addressId: number) => {
    try {
      await addressService.deleteAddress(userId, addressId);
      set((state) => ({ addresses: (state.addresses || [])?.filter(address => address.id !== addressId) }));
    } catch (error) {
      console.error('Error creating address:', error);
    }
  }
}));

export default useAddressStore;
