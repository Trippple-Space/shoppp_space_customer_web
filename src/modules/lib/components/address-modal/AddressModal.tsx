"use client"

import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import Modal from '@/modules/lib/components/modal/modal';
import AddressCard from './address-card/AddressCard';
import AddressForm from './address-form/AddressForm';
import useAddress from '../../utility/hooks/use-address';
import DeliveryMessage from '../delivery-in-lagos/DeliveryMessage';

interface ModalProps { }

const AddressModal: React.FC<ModalProps> = () => {
  const { isAddressModalOpen, closeAddressModal, addresses, setAddressToUpdateId } = useAddress();
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [showEditAddressForm, setShowEditAddressForm] = useState(false)

  return (
    <div>
  
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => { }}
        extraClass={{
          overflowY: 'auto',
          position: 'relative',
          maxHeight: 'calc(100dvh - 24px)',
          WebkitOverflowScrolling: 'touch'
        }}
        extraModalClass={{
          backgroundColor: '#00000073',
          paddingTop: 'max(12px, env(safe-area-inset-top))',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))'
        }}
        className="h-fit md:w-fit sm:w-[90%] w-[98%] no-scrollbar"
      >
        
        <div className='lg:w-[720px] md:w-[650px] h-fit relative' style={{ maxHeight: 'calc(100dvh - 90px)' }}>
          <div className='relative w-full'>
            <div className='sticky z-[3px] top-0 left-0 right-0 bg-white flex justify-between items-center py-[12px] px-[24px] border-solid border-b border border-[#00000014]'>
              <h5 className='text-[16px] font-semibold leading-[24px]'>Delivery address</h5>
              <AiOutlineClose className='cursor-pointer w-[20px] h-[20px]' onClick={() => {
                setShowAddressForm(false)
                setShowEditAddressForm(false)
                closeAddressModal()
                setAddressToUpdateId(null)
              }} />
            </div>
            <DeliveryMessage />
            <div className={`flex flex-col gap-[24px] py-[24px] sm:px-[24px] px-[20px]`}>
              {
                showAddressForm ?
                  <div className='bg-white w-full h-fit'>
                    <AddressForm type={'new'} closeAddressForm={() => {
                      setShowAddressForm(false)
                    }} />
                  </div>
                  :
                  (
                    addresses?.length === 0 ? (
                      <div className='bg-white w-full h-fit'>
                        <AddressForm type={'new'} closeAddressForm={(button) => {
                          setShowAddressForm(false)
                          if (button === 'cancel') {
                            closeAddressModal()
                          }
                        }} />
                      </div>
                    ) : (
                      <>
                        {
                          addresses?.map((address, i) => (
                            <AddressCard address={address} key={i} showAddressForm={showEditAddressForm} setShowAddressForm={setShowEditAddressForm} />
                          ))
                        }
                        <div className='flex justify-center'>
                          <p onClick={() => setShowAddressForm(true)} className="text-[#1677FF] cursor-pointer text-[16px] font-normal leading-[24px] underline text-center w-fit">Add new address</p>
                        </div>
                      </>
                    )
                  )
              }
            </div>
          </div>
        </div >
      </Modal >
    </div >
  );
};

export default AddressModal;
