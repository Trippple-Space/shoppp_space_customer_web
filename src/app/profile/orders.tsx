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
    <p  className={`px-[20px] py-[2px] rounded-[5px] text-${color} bg-${bgC}`}>
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
       <div className='w-[330px] lg:w-[1000px] py-[5px] lg:py-[20px] scroll'>
        <div className='flex justify-between py-[10px] relative'>
         <div className='w-[5%] lg:w-[3%] py-[5px]' style={{ borderBottom: '2px solid #DADADA'}}></div>
         <div className='flex font-medium w-[80%] lg:w-[30%] justify-between text-[16px] lg:text-[18px] text-black'>
            <p className={`px-[15px] lg:px-[10px] py-[10px] cursor-pointer ${tabVal === 'open' ? 'text-brand' : ''}`} style={{ borderBottom: tabVal === 'open' ? '3px solid green' : '2px solid #DADADA'}} onClick={() => setTabVal('open')}>Open orders</p>
            <p className='px-[13px] lg:px-[30px] py-[5px]' style={{ borderBottom: '2px solid #DADADA'}}></p>
            <p className={`px-[10px] lg:px-[3px] py-[10px] cursor-pointer ${tabVal === 'close' ? 'text-brand' : ''}`} style={{ borderBottom: tabVal === 'close' ? '3px solid green' : '2px solid #DADADA'}} onClick={() => setTabVal('close')}>Closed orders</p>
         </div>
         <div className='w-[15%] lg:w-[68%] py-[5px]' style={{ borderBottom: '2px solid #DADADA'}}></div>
         <div className='absolute top-[15px] lg:top-0 right-[10px] lg:right-[15px] cursor-pointer' onClick={handleCloseModal}>
            <AiOutlineClose className='w-[15px] h-[15px] lg:w-[25px] lg:h-[25px]' />
         </div>
        </div>

        {!data ? (
          <div className='flex mx-auto my-auto h-[70vh] text-center flex items-center justify-center'>
          <p className='text-[16px]'>You don’t have any open orders yet</p>
        </div>
        ) : (
         <div className='px-[10px] lg:px-[40px] pb-[30px]'>
          {OrderData.map((data: any) => (
            <div className='lg:flex justify-between items-center py-[20px] border-b border-[#D9D9D9]'>
            <div className='flex gap-[10px] lg:gap-[30px] items-center'>
              <div className='w-[115px] h-[110px]'>
              <Image
                className='w-fit h-full rounded-[5px] lg:rounded-[15px]'
                src='order-product.png'
                alt='product'
                type='image'
              />
              </div>
              <div className='leading-[25px]'>
                <p className='text-[14px] text-[#333333]'>Order: {data.id}</p>
                <h2 className='text-[16px] lg:text-[18px] font-normal'>{data.name}</h2>
                <div className='flex gap-[30px] text-[14px] text-[#333333]'>
                  <p>Unit: {data.unit}</p>
                  <p>Variation: {data.variation}</p>
                </div>
                {/* <h1 className='text-[16px] font-normal'>NGN 26,000</h1> */}
                <div className='hidden lg:flex gap-[20px] text-[13px] py-[10px]'>
                  {getStatus(data.status)}
                  <p>January 15th, 2023</p>
                </div>
              </div>
            </div>
            <div className='flex lg:hidden justify-between gap-[20px] text-[12px] py-[15px] lg:py-[10px]'>
                  {getStatus(data.status)}
                  <p>January 15th, 2023</p>
                </div>

            <div className='w-full w-[15%]'>
              <button className='w-full border-none bg-brand text-white text-[15px] py-[8px] px-[20px] rounded-[5px] font-normal'>Buy again</button>
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
