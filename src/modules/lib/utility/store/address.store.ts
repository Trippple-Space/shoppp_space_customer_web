import { create } from 'zustand';
import { Address } from '../types/address.interface';
import { addressService } from '../services/address.service';
import { User } from '../types/user.interface';

interface AddressStore {
  isAddressModalOpen: boolean;
  addresses: Address[] | null;
  selectedAddressId: Address['id'] | null;
  openAddressModal: () => void;
  closeAddressModal: () => void;
  fetchAddresses: (userId: User['id']) => Promise<void>;
  selectAddress: (id: number) => void;
  updateAddress: (id: number, updatedData: Partial<Address>) => Promise<void>;
  createAddress: (userId: number, newAddress: Address) => Promise<void>;
}

const useAddressStore = create<AddressStore>((set) => ({
  isAddressModalOpen: false,
  addresses: null,
  selectedAddressId: null,

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

  selectAddress: (id: number) => set({ selectedAddressId: id }),

  updateAddress: async (id: number, updatedData: Partial<Address>) => {
    try {
      const updatedAddresses = await addressService.updateAddress(id, updatedData);
      set({ addresses: updatedAddresses})
    } catch (error) {
      console.error('Error updating address:', error);
    }
  },

  createAddress: async (userId: number, newAddress: Address) => {
    try {
      const address = await addressService.createAddress(userId, newAddress);
      set((state) => ({ addresses: [...(state.addresses || []), address] }));
    } catch (error) {
      console.error('Error creating address:', error);
    }
  },
}));

export default useAddressStore;
