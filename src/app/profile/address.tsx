"use client"

import Image from '@/modules/lib/components/image/Image';
import Input from '@/modules/lib/components/input/Input';
import Modal from '@/modules/lib/components/modal/modal';
import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai'


interface ModalProps {
  modalOpen: boolean;
  handleCloseModal: () => void;
  data: any;
}

const AddressModal: React.FC<ModalProps> = ({modalOpen, handleCloseModal, data}) => {
  const [tabVal, setTabVal] = useState('view-address');

  const handleTabChange = (val: string) => {
    setTabVal(val);
  };


  return (
    <div>
      <Modal isOpen={modalOpen} onClose={handleCloseModal}>
       <div className='w-330 l:w-1000 py-5 l:py-20 scroll'>
        <div className='flex space-between py-10 relative'>
         <div className='w-5p l:w-3p py-5' style={{ borderBottom: '2px solid #DADADA'}}></div>
         <div className='flex weight-500 w-80p l:w-31p space-between text-16 l:text-18 text-black'>
            <p className={`px-15 l:px-10 py-5 pointer ${tabVal === 'view-address' ? 'text-green' : ''}`} style={{ borderBottom: tabVal === 'view-address' ? '3px solid green' : '2px solid #DADADA'}} onClick={() => setTabVal('view-address')}>Address book </p>
            <p className='px-11 l:px-32 py-5' style={{ borderBottom: '2px solid #DADADA'}}></p>
            <p className={`px-10 l:px-3 py-5 pointer ${tabVal === 'add-address' ? 'text-green' : ''}`} style={{ borderBottom: tabVal === 'add-address' ? '3px solid green' : '2px solid #DADADA'}} onClick={() => setTabVal('add-address')}>New address</p>
         </div>
         <div className='w-15p l:w-67p py-5' style={{ borderBottom: '2px solid #DADADA'}}></div>
         <div className='absolute t-15 l:t-0 r-10 l:r-15 pointer' onClick={handleCloseModal}>
            <AiOutlineClose className='w-15 h-15 l:w-25 l:h-25' />
         </div>
        </div>

        {tabVal === 'add-address' ? (
          <form className="form px-20 l:px-35">
            <div className='grid l:grid-2-cols-auto gap-20 py-20 w-100p'>
              <Input
                label='First name'
                id='firstName'
                name='firstName'
                type='text'
                placeholder='Enter your first name'
                className='l:my-10'
              />

              <Input
                label='Last name'
                id='lastName'
                name='lastName'
                type='text'
                placeholder='Enter your last name'
                className='l:my-10'
              />
              <Input
                label='Phone number'
                id='phoneNUmber'
                name='text'
                type='text'
                placeholder='080****'
                className='l:my-10'
              />

              <Input
                label='Address'
                id='address'
                name='address'
                type='text'
                placeholder='Enter your house address'
                className='l:my-10'
              />
              <Input
                label='State'
                id='state'
                name='state'
                type='text'
                placeholder='Select from dropdowns'
                className='l:my-10'
              />

              <Input
                label='Region'
                id='region'
                name='region'
                type='text'
                placeholder='Select from dropdowns'
                className='l:my-10'
              />
            </div>

         <div className='w-100p gap-30 pt-10 pb-80 flex j-content-end text-16'>
         <button disabled className="bg-none border-none text-dimgrey">Discard</button>
         <button disabled className="bg-green radius-5 text-white px-50 l:px-20 py-10">Save</button>
         </div>

        </form>
        ) : (
         <div className='px-10 l:px-40 pb-30'>
          {[0,0,0].map((item: any) => (
            <div className='l:flex space-between items-center py-20' style={{ borderBottom: '1px solid #D9D9D9'}}>
            <div className='flex gap-10 l:gap-20 items-center py-10'>
              <div className='w-110 l:w-145 h-110'>
              <Image
                className='w-100p h-100p radius-5 l:radius-20'
                src='delivery-man.png'
                alt='product'
                type='image'
              />
              </div>
              <div className='line-height-22 text-14 text-dimgrey opacity-70'>
                <h2 className='text-16 l:text-20 weight-400 text-black opacity-100'>Abdulhammed Ibraheem</h2>
                <p>7, Anthony village road, Anthony Lagos.</p>
                <p>Lagos Nigeria</p>
                <p>Anthony Lagos</p>
                <p>08080803332</p>
              </div>
            </div>

            <div className='flex flex-col a-items-end gap-15 l:gap-60'>
              <p className='text-green text-14'>Default address</p>
              <div className='flex gap-8 l:gap-30 w-100p space-between'>
                <button className='w-50p  border-danger border-1 l:border-none bg-none text-danger text-15 py-12 px-20 radius-5 weight-400'>Delete</button>
                <button className='w-50p l:w-100p border-none bg-green text-white text-15 py-12 px-20 radius-7 weight-400'>Edit address</button>
              </div>
            </div>
          </div>
          ))}
         </div>
        )}
       </div>
      </Modal>
    </div>
  );
};

export default AddressModal;
