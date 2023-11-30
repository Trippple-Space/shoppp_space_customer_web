import { useEffect } from 'react';
import useAddressStore from '../store/address.store';
import useUserStore from '../store/user.store';
import { Address } from '../types/address.interface';

const useAddress = () => {
  const {
    isAddressModalOpen,
    addresses,
    selectedAddressId,
    openAddressModal,
    closeAddressModal,
    fetchAddresses,
    selectAddress,
    updateAddress,
    createAddress,
  } = useAddressStore();
  const {isAuthenticated, user} = useUserStore()

  useEffect(() => {
    if (
        isAddressModalOpen && 
        !addresses && 
        isAuthenticated &&
        user
    ) {
        fetchAddresses(user.id);
    }
  }, []);

  const handleCreateAddress = (newAddress: Address) => {
    if (user?.id) {
        createAddress(user.id, newAddress)
    }
  }

  const handleUpdateAddress = (newAddress: Address) => {
    if (user?.id) {
        updateAddress(user.id, newAddress)
    }
  }

  return {
    isAddressModalOpen,
    addresses,
    selectedAddressId,
    openAddressModal,
    closeAddressModal,
    selectAddress,
    handleUpdateAddress,
    handleCreateAddress,
  };
};

export default useAddress;
