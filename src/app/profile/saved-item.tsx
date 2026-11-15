"use client"

import Icon from '@/modules/lib/components/icon/Icon';
import Image from '@/modules/lib/components/image/Image';
import Modal from '@/modules/lib/components/modal/modal';
import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai'


interface ModalProps {
  modalOpen: boolean;
  handleCloseModal: () => void;
  data: any;
}

const SavedItemModal: React.FC<ModalProps> = ({modalOpen, handleCloseModal, data}) => {
  const savedData = [
    {id: 45621, name: '24 Karat Gold Plated Ring', unit: 2, variation: 'Plated ring', price: '26,000', status: 'out'},
    {id: 45621, name: '24 Karat Gold Plated Ring', unit: 2, variation: 'Plated ring', price: '26,000', status: 'Delivered'},
    {id: 45621, name: '24 Karat Gold Plated Ring', unit: 2, variation: 'Plated ring', price: '26,000', status: 'Delivered'}
  ];


  return (
    <div>
      <Modal isOpen={modalOpen} onClose={handleCloseModal}>
       <div className='w-[330px] lg:w-[1000px] py-[5px] lg:py-[20px] scroll'>
        <div className='flex justify-between py-[10px] relative'>
         <div className='w-[5%] lg:w-[3%] py-[5px]' style={{ borderBottom: '2px solid #DADADA'}}></div>
         <div className='flex font-medium w-1/2 lg:w-[15%] justify-between text-[16px] lg:text-[18px] text-brand'>
            <p className='px-[20px] lg:px-[25px] pt-[10px] pb-[15px] cursor-pointer' style={{ borderBottom: '3px solid green' }}>Saved items</p>
         </div>
         <div className='w-[60%] lg:w-[82%] pb-[15px]' style={{ borderBottom: '2px solid #DADADA'}}></div>
         <div className='absolute flex gap-[20px] top-[15px] lg:top-[10px] right-[10px] lg:right-[40px] cursor-pointer' onClick={handleCloseModal}>
            <button className='bg-transparent border-none text-[16px] text-[#333333]'>Clear all</button>
            <AiOutlineClose className='w-[15px] h-[15px] lg:w-[22px] lg:h-[22px]' />
         </div>
        </div>

        {!data ? (
          <div className='flex mx-auto my-auto h-[70vh] text-center flex items-center justify-center'>
          <p className='text-[16px]'>You don’t have any Saved orders yet</p>
        </div>
        ) : (
         <div className='px-[10px] lg:px-[40px] pb-[40px]'>
          {savedData.map((data: any) => (
            <div className='lg:flex justify-between items-center py-[20px]' style={{ borderBottom: '1px solid #D9D9D9'}}>
              <div className='flex w-full lg:w-1/2 gap-[10px] lg:gap-[30px] items-center'>
                <div className='w-[115px] h-[115px]'>
                <Image
                  className='w-fit h-full rounded-[5px] lg:rounded-[10px]'
                  src='order-product.png'
                  alt='product'
                  type='image'
                />
                </div>
                <div className='leading-[28px]'>
                  <h2 className='text-[16px] lg:text-[18px] font-normal'>{data.name}</h2>
                  <h1 className='text-[16px] font-normal'>NGN 26,000</h1>
                  <p className='text-[12px]'>January 15th, 2023</p>
                  <div className='hidden lg:flex gap-[10px] text-danger text-[12px] items-center'>
                    <Icon name='delete' className='w-[17px] h-[17px]' />
                    <p>Remove</p>
                  </div>

                </div>
              </div>

              <div className='flex justify-between w-full lg:w-[30%]'>
                <div className='flex justify-between w-full'>
                  <div className='flex w-1/2 items-center'>
                    <Icon name='decr' className='w-[25px] h-[25px]' />
                    <input type="number" className='border-none w-[55px] text-[16px] text-center' placeholder='1' />
                    <Icon name='incr' className='w-[25px] h-[25px]' />
                  </div>

                  <div className='flex justify-center w-1/2 p-[15px] text-[15px] lg:text-[20px] text-black'>
                    <select name="" id="" className='border-none text-[15px] lg:text-[17px] text-black font-medium'>
                      <option value="">Bundle</option>
                      <option value="">Bale</option>

                    </select>
                  </div>
                </div>
              </div>

              <div className='flex justify-between gap-[20px] w-full lg:w-[15%]'>
                <button className='flex justify-center lg:hidden w-1/2 lg:w-full border border-[#DE3838] bg-transparent text-danger text-[16px] py-[10px] px-[20px] rounded-[5px] font-normal'>Remove</button>
                <button className='w-1/2 lg:w-full border-none bg-brand text-white text-[15px] py-[10px] px-[20px] rounded-[5px] font-normal  hover:bg-brand-hover'>Add to cart</button>
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

export default SavedItemModal;
