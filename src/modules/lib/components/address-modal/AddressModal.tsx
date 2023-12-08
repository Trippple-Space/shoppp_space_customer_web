import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import Modal from '@/modules/lib/components/modal/modal';
import AddressCard from './address-card/AddressCard';
import AddressForm from './address-form/AddressForm';
import useAddressStore from '@/modules/lib/utility/store/address.store';
import useAddress from '../../utility/hooks/use-address';

interface ModalProps {}

const AddressModal: React.FC<ModalProps> = () => {
  const { isAddressModalOpen, closeAddressModal, addresses } = useAddress();
  const [showAddressForm, setShowAddressForm] = useState(false)

  return (
    <div>
      <Modal isOpen={isAddressModalOpen} onClose={closeAddressModal} extraClass={{ overflow: 'auto' }}>
        <div className='w-330 l:w-800 l:h-600'>
          <div className=''>
            <div className=''>
              <div className='flex space-between items-center gap-52 px-48  border-solid border-b border-1 border-grey-300 text-18 weight-400 text-grey-700'>
                <div
                  className='py-20 pointer text-green border-b border-2 border-green'
                >
                  Address book
                </div>
                <div className='text-grey-700 weight-600 pointer' onClick={closeAddressModal}>
                  <AiOutlineClose />
                </div>
              </div>
            </div>
            <div className='p-20 bg-faint-green grid grid-2-cols-1fr gap-20'>
              {/* <div className=''>{modalDisplayOptions[action]}</div> */}
              
              {
                addresses?.map(address => (
                  <AddressCard address={address} />
                ))
              }


            </div>              
            {!showAddressForm && <button onClick={() => setShowAddressForm(true)} className="btn btn-sm border-none text-black bg-yellow">Add new address</button>}
              {showAddressForm && <AddressForm />}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddressModal;
