"use client"

import Icon from '@/modules/lib/components/icon/Icon';
import Image from '@/modules/lib/components/image/Image';
import Modal from '@/modules/lib/components/modal/modal';
import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai'
import { MdOutlineLocalShipping } from 'react-icons/md'

interface ModalProps {
  modalOpen: boolean;
  handleCloseModal: () => void;
  data: any;
}

const CarttemModal: React.FC<ModalProps> = ({modalOpen, handleCloseModal, data}) => {
  const cartData = [
    {id: 45621, name: '24 Karat Gold Plated Ring', unit: 2, variation: 'Plated ring', price: '26,000', status: 'out'},
    {id: 45621, name: '24 Karat Gold Plated Ring', unit: 2, variation: 'Plated ring', price: '26,000', status: 'Delivered'},
    {id: 45621, name: '24 Karat Gold Plated Ring', unit: 2, variation: 'Plated ring', price: '26,000', status: 'Delivered'}
  ];


  return (
    <div>
      <Modal isOpen={modalOpen} onClose={handleCloseModal} extraClass={{ bottom: '150px', maxHeight: '45vh', overflow: 'hidden'}}>
       <div className='relative'>
       <div className='min-w-350 h-320 py-10 scroll-y'>
        {!data ? (
          <div className='mx-auto h-250 text-center items-center j-content-center'>
          <p className='text-16'>Your cart is empty</p>

          <div className='w-100p px-20 py-10'>
            <button className='mx-auto w-40p border-none bg-green text-white text-16 py-10 px-20 radius-5 weight-400'>Shop now</button>
        </div>
        </div>
        ) : (
         <div className='px-20 pb-20'>
          {cartData.map((data: any) => (
            <div className='space-between items-center py-10' style={{ borderBottom: '1px solid #D9D9D9'}}>
              <div className='flex w-100p gap-10 l:gap-30 items-center'>
                <div className='w-90 h-90'>
                <Image
                  className='w-fit h-100p radius-5 l:radius-10'
                  src='order-product.png'
                  alt='product'
                  type='image'
                />
                </div>
                <div className='line-height-20'>
                  <h2 className='text-12 l:text-14 weight-400'>{data.name}</h2>
                  <p className='text-12 text-light-grey'>4 unit left</p>
                  <h1 className='text-14 weight-400'>NGN 26,000</h1>
                  <div className='flex space-between gap-20 w-100p'>
                    <button className='w-100p flex l:w-100p border-1 border-green bg-white text-green text-10 py-5 px-10 radius-5 weight-500'><MdOutlineLocalShipping className='w-25' /> 10% Shipping discount</button>
                  </div>
                 

                </div>
              </div>

              <div className='flex space-between w-100p'>
                <div className='flex space-between w-100p'>
                <div className='flex gap-10 text-danger text-12 items-center weight-400'>
                    <Icon name='delete' className='w-17 h-17' />
                    <p>Remove</p>
                </div>

                  <div className='flex j-content-center w-33p p-15 text-15 l:text-20 text-black'>
                    <select name="" id="" className='border-none text-15 l:text-12 text-black weight-400'>
                      <option value="">Bundle</option>
                      <option value="">Bale</option>

                    </select>
                  </div>
                  <div className='flex w-33p items-center'>
                    <Icon name='decr' className='w-25 h-25' />
                    <input type="number" className='border-none w-55 text-16 text-center' placeholder='1' />
                    <Icon name='incr' className='w-25 h-25' />
                  </div>

                  
                </div>
              </div>

              
          </div>
          ))}
         </div>
        )}

        
        
       </div>

       <div className='h-60'>
        <div className='h-100p px-20 py-10'>
            <button className='w-100p h-100p border-none bg-green text-white text-14 py-10 px-20 radius-5 weight-400'>Checkout (NGN 105,000)</button>
        </div>
        </div>
       </div>
      </Modal>
    </div>
  );
};

export default CarttemModal;
