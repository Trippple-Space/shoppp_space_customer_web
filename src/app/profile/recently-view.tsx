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

const RecentViewModal: React.FC<ModalProps> = ({modalOpen, handleCloseModal, data}) => {
  const savedData = [
    {id: 45621, name: '24 Karat Gold Plated Ring', unit: 2, variation: 'Plated ring', price: '26,000', status: 'out'},
    {id: 45621, name: '24 Karat Gold Plated Ring', unit: 2, variation: 'Plated ring', price: '26,000', status: 'Delivered'},
    {id: 45621, name: '24 Karat Gold Plated Ring', unit: 2, variation: 'Plated ring', price: '26,000', status: 'Delivered'}
  ];


  return (
    <div>
      <Modal isOpen={modalOpen} onClose={handleCloseModal}>
       <div className='w-330 l:w-1000 py-5 l:py-20 scroll'>
        <div className='flex space-between py-10 relative'>
         <div className='w-5p l:w-3p py-5 border-2 border-b border-faint-grey'></div>
         <div className='flex weight-500 w-50p l:w-17p space-between text-16 l:text-18 text-green'>
            <p className='px-18 l:px-25 pt-10 pb-15 pointer border-3 border-b border-green'>Recently viewied</p>
         </div>
         <div className='w-60p l:w-80p pt-5 pb-15 border-2 border-b border-faint-grey'></div>
         <div className='absolute flex gap-15 t-15 l:t-10 r-10 l:r-40 pointer' onClick={handleCloseModal}>
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
          {[0,0,0].map((data: any) => (
            <div className='l:flex space-between items-center py-20 border-b border-lighter-grey'>
              <div className='flex w-100p l:w-50p gap-15 l:gap-30 items-center'>
                <div className='w-115 h-115'>
                <Image
                  className='w-fit h-100p radius-5 l:radius-10'
                  src='order-product.png'
                  alt='product'
                  type='image'
                />
                </div>
                <div className='line-height-27'>
                  <h2 className='text-16 l:text-18 weight-400'>24 Karat Gold Plated Ring</h2>
                  <h1 className='text-16 weight-400'>NGN 26,000</h1>
                  <p className='text-12'>January 15th, 2023</p>

                </div>
              </div>

              <div className='flex space-between w-100p l:w-30p'>
                <div className='flex space-between w-100p'>
                  <div className='flex w-50p items-center'>
                    <Icon name='decr' className='w-25 h-25' />
                    <input type="number" className='border-none w-55 text-16 text-center' placeholder='1' />
                    <Icon name='incr' className='w-25 h-25' />
                  </div>

                  <div className='flex j-content-center w-50p p-15 text-15 l:text-20 text-black'>
                    <select name="" id="" className='border-none text-15 l:text-17 text-black weight-500'>
                      <option value="">Bundle</option>
                      <option value="">Bale</option>

                    </select>
                  </div>
                </div>
              </div>

              <div className='flex space-between gap-20 w-100p l:w-15p'>
                <button className='w-100p border-none bg-green text-white text-15 py-10 px-20 radius-5 weight-400  hover:bg-darkgreen'>Add to cart</button>
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

export default RecentViewModal;
