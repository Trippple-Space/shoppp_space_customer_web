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

const RecentSearchModal: React.FC<ModalProps> = ({modalOpen, handleCloseModal, data}) => {
  const savedData = ['Senator asoebi', 'Adidas sneakers', 'Men wrist watch', 'High quality ankara', 'Sandals' ];


  return (
    <div>
      <Modal isOpen={modalOpen} onClose={handleCloseModal}>
       <div className='w-[330px] lg:w-[1000px] py-[5px] lg:py-[20px] scroll'>
        <div className='flex justify-between py-[10px] relative'>
         <div className='w-[5%] lg:w-[3%] py-[5px] border-[2px] border-b border-[#DADADA]'></div>
         <div className='flex font-medium w-1/2 lg:w-[17%] justify-between text-[16px] lg:text-[18px] text-brand'>
            <p className='px-[18px] lg:px-[27px] pt-[10px] pb-[15px] cursor-pointer border-[3px] border-b border-brand'>Recent search</p>
         </div>
         <div className='w-[60%] lg:w-[80%] pt-[5px] pb-[15px] border-[2px] border-b border-[#DADADA]'></div>
         <div className='absolute flex gap-[20px] top-[15px] lg:top-[10px] right-[10px] lg:right-[40px] cursor-pointer' onClick={handleCloseModal}>
            <button className='bg-transparent border-none text-[16px] text-[#333333]'>Clear all</button>
            <AiOutlineClose className='w-[15px] h-[15px] lg:w-[22px] lg:h-[22px]' />
         </div>
        </div>

        {!data ? (
          <div className='flex mx-auto my-auto h-[70vh] text-center flex items-center justify-center'>
          <p className='text-[16px]'>You don’t have any recent orders yet</p>
        </div>
        ) : (
         <div className='px-[10px] lg:px-[40px] pb-[40px]'>
          {savedData.map((item: any) => (
            <div className='lg:flex justify-between items-center py-[22px] border-b border-[#D9D9D9]'>
              <h2 className='text-[16px] lg:text-[16px] px-[30px] font-normal'>{item}</h2>
          </div>
          ))}
         </div>
        )}
       </div>
      </Modal>
    </div>
  );
};

export default RecentSearchModal;
