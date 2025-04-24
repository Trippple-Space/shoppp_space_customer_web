"use client"

import Image from '@/modules/lib/components/image/Image';
import Modal from '@/modules/lib/components/modal/modal';
import { useOrders } from '@/modules/lib/utility/hooks/use-orders';
import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai'


interface ModalProps {
  modalOpen: boolean;
  handleCloseModal: () => void;
  data: any;
}

const OrderModal: React.FC<ModalProps> = ({modalOpen, handleCloseModal, data}) => {
  const [tabVal, setTabVal] = useState('open');

  
  const getStatusGrid = (color: any, bgC: any, name: any) => (
    <p  className={`px-20 py-2 radius-5 text-${color} bg-${bgC}`}>
      {name}
    </p>
  );

  const getStatus = (status: any) => {
    switch (status) {
      case 'out':
        return getStatusGrid('black', 'deep-yellow', 'Out for delivery');
      case 'cancel':
        return getStatusGrid('white', 'dimgrey', 'Payment cancelled');
      default:
        return getStatusGrid('white', 'green', 'Delivered');
    }
  };





  const openOrderData = [
    {id: 45621, name: '24 Karat Gold Plated Ring', unit: 2, variation: 'Plated ring', price: '26,000', status: 'out'},
    {id: 45621, name: '24 Karat Gold Plated Ring', unit: 2, variation: 'Plated ring', price: '26,000', status: 'Delivered'},
    {id: 45621, name: '24 Karat Gold Plated Ring', unit: 2, variation: 'Plated ring', price: '26,000', status: 'Delivered'}
  ];

  const closeOrderData = [
    {id: 45621, name: '24 Karat Gold Plated Ring', unit: 2, variation: 'Plated ring', price: '26,000', status: 'cancel'},
    {id: 45621, name: '24 Karat Gold Plated Ring', unit: 2, variation: 'Plated ring', price: '26,000', status: 'cancel'},
    {id: 45621, name: '24 Karat Gold Plated Ring', unit: 2, variation: 'Plated ring', price: '26,000', status: 'cancel'}
  ];

  const OrderData = tabVal === 'open' ? openOrderData : closeOrderData;

  return (
    <div>
      <Modal isOpen={modalOpen} onClose={handleCloseModal}>
       <div className='w-330 l:w-1000 py-5 l:py-20 scroll'>
        <div className='flex space-between py-10 relative'>
         <div className='w-5p l:w-3p py-5' style={{ borderBottom: '2px solid #DADADA'}}></div>
         <div className='flex weight-500 w-80p l:w-30p space-between text-16 l:text-18 text-black'>
            <p className={`px-15 l:px-10 py-10 pointer ${tabVal === 'open' ? 'text-green' : ''}`} style={{ borderBottom: tabVal === 'open' ? '3px solid green' : '2px solid #DADADA'}} onClick={() => setTabVal('open')}>Open orders</p>
            <p className='px-13 l:px-30 py-5' style={{ borderBottom: '2px solid #DADADA'}}></p>
            <p className={`px-10 l:px-3 py-10 pointer ${tabVal === 'close' ? 'text-green' : ''}`} style={{ borderBottom: tabVal === 'close' ? '3px solid green' : '2px solid #DADADA'}} onClick={() => setTabVal('close')}>Closed orders</p>
         </div>
         <div className='w-15p l:w-68p py-5' style={{ borderBottom: '2px solid #DADADA'}}></div>
         <div className='absolute t-15 l:t-0 r-10 l:r-15 pointer' onClick={handleCloseModal}>
            <AiOutlineClose className='w-15 h-15 l:w-25 l:h-25' />
         </div>
        </div>

        {!data ? (
          <div className='flex mx-auto my-auto h-70vh text-center flex items-center j-content-center'>
          <p className='text-16'>You don’t have any open orders yet</p>
        </div>
        ) : (
         <div className='px-10 l:px-40 pb-30'>
          {OrderData.map((data: any) => (
            <div className='l:flex space-between items-center py-20 border-b border-lighter-grey'>
            <div className='flex gap-10 l:gap-30 items-center'>
              <div className='w-115 h-110'>
              <Image
                className='w-fit h-100p radius-5 l:radius-15'
                src='order-product.png'
                alt='product'
                type='image'
              />
              </div>
              <div className='line-height-25'>
                <p className='text-14 text-dimgrey'>Order: {data.id}</p>
                <h2 className='text-16 l:text-18 weight-400'>{data.name}</h2>
                <div className='flex gap-30 text-14 text-dimgrey'>
                  <p>Unit: {data.unit}</p>
                  <p>Variation: {data.variation}</p>
                </div>
                {/* <h1 className='text-16 weight-400'>NGN 26,000</h1> */}
                <div className='hidden l:flex gap-20 text-13 py-10'>
                  {getStatus(data.status)}
                  <p>January 15th, 2023</p>
                </div>
              </div>
            </div>
            <div className='flex l:hidden space-between gap-20 text-12 py-15 l:py-10'>
                  {getStatus(data.status)}
                  <p>January 15th, 2023</p>
                </div>

            <div className='w-100p w-15p'>
              <button className='w-100p border-none bg-green text-white text-15 py-8 px-20 radius-5 weight-400'>Bay again</button>
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

export default OrderModal;
