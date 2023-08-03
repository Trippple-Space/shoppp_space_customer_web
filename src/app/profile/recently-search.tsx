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
       <div className='w-330 l:w-1000 py-5 l:py-20 scroll'>
        <div className='flex space-between py-10 relative'>
         <div className='w-5p l:w-3p py-5 border-2 border-b border-faint-grey'></div>
         <div className='flex weight-500 w-50p l:w-17p space-between text-16 l:text-18 text-green'>
            <p className='px-18 l:px-27 pt-10 pb-15 pointer border-3 border-b border-green'>Recent search</p>
         </div>
         <div className='w-60p l:w-80p pt-5 pb-15 border-2 border-b border-faint-grey'></div>
         <div className='absolute flex gap-20 t-15 l:t-10 r-10 l:r-40 pointer' onClick={handleCloseModal}>
            <button className='bg-none border-none text-16 text-dimgrey'>Clear all</button>
            <AiOutlineClose className='w-15 h-15 l:w-22 l:h-22' />
         </div>
        </div>

        {!data ? (
          <div className='flex mx-auto my-auto h-70vh text-center flex items-center j-content-center'>
          <p className='text-16'>You don’t have any recent orders yet</p>
        </div>
        ) : (
         <div className='px-10 l:px-40 pb-40'>
          {savedData.map((item: any) => (
            <div className='l:flex space-between items-center py-22 border-b border-lighter-grey'>
              <h2 className='text-16 l:text-16 px-30 weight-400'>{item}</h2>
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
