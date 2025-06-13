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
      <Modal isOpen={isAddressModalOpen} onClose={() => { }} extraClass={{ overflow: 'auto' }} extraModalClass={{ backgroundColor: '#00000073' }} className="h-fit md:w-fit sm:w-90p w-98p no-scrollbar">
        <div className='l:w-720 md:w-650 h-fit relative' style={{ maxHeight: 'calc(100dvh - 90px)' }}>
          <div className='relative w-full'>
            <div className='sticky z-3 t-0 l-0 r-0 bg-white flex space-between a-items-center py-12 px-24 border-solid border-b border-1 border-#00000014'>
              <h5 className='text-16 weight-600 line-height-24'>Delivery address</h5>
              <AiOutlineClose className='pointer w-20 h-20' onClick={() => {
                setShowAddressForm(false)
                setShowEditAddressForm(false)
                closeAddressModal()
                setAddressToUpdateId(null)
              }} />
            </div>
            <DeliveryMessage />
            <div className={`flex flex-col gap-24 py-24 sm:px-24 px-20`}>
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
                        <div className='flex j-content-center'>
                          <p onClick={() => setShowAddressForm(true)} className="color-#1677FF pointer text-16 weight-400 line-height-24 underline text-center w-fit">Add new address</p>
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
