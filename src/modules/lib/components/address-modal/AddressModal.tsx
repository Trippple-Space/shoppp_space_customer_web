import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import Modal from '@/modules/lib/components/modal/modal';
import AddressCard from './address-card/AddressCard';
import AddressForm from './address-form/AddressForm';
import useAddressStore from '@/modules/lib/utility/store/address.store';
import useAddress from '../../utility/hooks/use-address';
import { BiPlus } from 'react-icons/bi';
import { FaPlus } from 'react-icons/fa';

interface ModalProps { }

const AddressModal: React.FC<ModalProps> = () => {
  const { isAddressModalOpen, closeAddressModal, addresses } = useAddress();
  const [showAddressForm, setShowAddressForm] = useState(false)

  return (
    <div>
      <Modal isOpen={isAddressModalOpen} onClose={closeAddressModal} extraClass={{ overflow: 'auto' }} className="h-100vh l:h-fit w-100p l:w-fit">
        <div className='h-100vh l:w-800 l:h-600'>
          <div className=''>
            <div className=''>
              <div className='flex space-between items-center gap-52 px-48  border-solid border-b border-1 border-grey-300 text-16 l:text-18 weight-400 text-grey-700'>
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
            <div className='p-20 bg-faint-green l:grid grid-2-cols-1fr gap-20'>
              {
                addresses?.map(address => (
                  <AddressCard address={address} />
                ))
              }

              {
                showAddressForm ?
                  <div className='bg-white w-full h-fit p-15'>
                    <AddressForm closeAddressForm={() => setShowAddressForm(false)} />
                  </div>
                  :
                  <button onClick={() => setShowAddressForm(true)} className="btn bg-green hover:bg-green-500 w-full h-200 radius-5 text-white flex pointer">
                    <div className="flex flex-col h-fit w-fit a-self-center mx-auto">
                      <FaPlus className='text-50 ' />
                      <div className='mt-10'>Add new address</div>
                    </div>
                  </button>
              }
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddressModal;
