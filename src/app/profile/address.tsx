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
       <div className='w-[330px] lg:w-[1000px] py-[5px] lg:py-[20px] scroll'>
        <div className='flex justify-between py-[10px] relative'>
         <div className='w-[5%] lg:w-[3%] py-[5px] border-[2px] border-b border-[#DADADA]'></div>
         <div className='flex font-medium w-[80%] lg:w-[31%] justify-between text-[16px] lg:text-[18px] text-black'>
            <p className={`px-[15px] lg:px-[10px] pt-[5px] pb-[20px] cursor-pointer ${tabVal === 'view-address' ? 'text-brand' : ''}`} style={{ borderBottom: tabVal === 'view-address' ? '3px solid green' : '2px solid #DADADA'}} onClick={() => setTabVal('view-address')}>Address book </p>
            <p className='px-[11px] lg:px-[32px] py-[5px] border-[2px] border-b border-[#DADADA]'></p>
            <p className={`px-[10px] lg:px-[3px] pt-[5px] pb-[20px] cursor-pointer ${tabVal === 'add-address' ? 'text-brand' : ''}`} style={{ borderBottom: tabVal === 'add-address' ? '3px solid green' : '2px solid #DADADA'}} onClick={() => setTabVal('add-address')}>New address</p>
         </div>
         <div className='w-[15%] lg:w-[67%] py-[5px] border-b border-[#DADADA]'></div>
         <div className='absolute top-[15px] lg:top-0 right-[10px] lg:right-[15px] cursor-pointer' onClick={handleCloseModal}>
            <AiOutlineClose className='w-[15px] h-[15px] lg:w-[25px] lg:h-[25px]' />
         </div>
        </div>

        {tabVal === 'add-address' ? (
          <form className="form px-[20px] lg:px-[35px]">
            <div className='grid lg:grid-cols-2 gap-[20px] py-[20px] w-full'>
              <Input
                label='First name'
                id='firstName'
                name='firstName'
                type='text'
                placeholder='Enter your first name'
                className='lg:my-[10px]'
              />

              <Input
                label='Last name'
                id='lastName'
                name='lastName'
                type='text'
                placeholder='Enter your last name'
                className='lg:my-[10px]'
              />
              <Input
                label='Phone number'
                id='phoneNUmber'
                name='text'
                type='text'
                placeholder='080****'
                className='lg:my-[10px]'
              />

              <Input
                label='Address'
                id='address'
                name='address'
                type='text'
                placeholder='Enter your house address'
                className='lg:my-[10px]'
              />
              <Input
                label='State'
                id='state'
                name='state'
                type='text'
                placeholder='Select from dropdowns'
                className='lg:my-[10px]'
              />

              <Input
                label='Region'
                id='region'
                name='region'
                type='text'
                placeholder='Select from dropdowns'
                className='lg:my-[10px]'
              />
            </div>

         <div className='w-full gap-[30px] pt-[10px] pb-[80px] flex justify-end text-[16px]'>
         <button disabled className="bg-transparent border-none text-[#333333]">Discard</button>
         <button disabled className="bg-brand rounded-[5px] text-white px-[50px] lg:px-[20px] py-[10px]">Save</button>
         </div>

        </form>
        ) : (
         <div className='px-[10px] lg:px-[40px] pb-[30px]'>
          {[0,0,0].map((item: any) => (
            <div className='lg:flex justify-between items-center py-[20px] border-b border-[#D9D9D9]'>
            <div className='flex gap-[10px] lg:gap-[20px] items-center py-[10px]'>
              <div className='w-[110px] lg:w-[145px] h-[110px]'>
              <Image
                className='w-full h-full rounded-[5px] lg:rounded-[20px]'
                src='delivery-man.png'
                alt='product'
                type='image'
              />
              </div>
              <div className='leading-[25px] text-[13px] text-[#333333] opacity-70'>
                <h2 className='text-[16px] lg:text-[20px] font-normal text-black opacity-100'>Abdulhammed Ibraheem</h2>
                <p>7, Anthony village road, Anthony Lagos.</p>
                <p>Lagos Nigeria</p>
                <p>Anthony Lagos</p>
                <p>08080803332</p>
              </div>
            </div>

            <div className='flex flex-col items-end gap-[15px] lg:gap-[60px]'>
              <p className='text-brand text-[14px]'>Default address</p>
              <div className='flex gap-[8px] lg:gap-[30px] w-full justify-between'>
                <button className='w-1/2  border-danger border lg:border-none bg-transparent text-danger text-[15px] py-[12px] px-[20px] rounded-[5px] font-normal'>Delete</button>
                <button className='w-1/2 lg:w-full border-none bg-brand text-white text-[15px] py-[12px] px-[20px] rounded-[7px] font-normal'>Edit address</button>
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
