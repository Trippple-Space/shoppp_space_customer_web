"use client"

import Image from '@/modules/lib/components/image/Image';
import Input from '@/modules/lib/components/input/Input';
import Modal from '@/modules/lib/components/modal/modal';
import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai'
import { BsSearch } from 'react-icons/bs';


interface ModalProps {
  modalOpen: boolean;
  handleCloseModal: () => void;
  data: any;
}

const PromoProductModal: React.FC<ModalProps> = ({modalOpen, handleCloseModal, data}) => {
  const [tabVal, setTabVal] = useState('open');

  return (
    <div>
      <Modal isOpen={modalOpen} onClose={handleCloseModal}>
       <div className='w-450 py-5 l:py-10 scroll'>
        <div className='flex space-between py-7 px-20 border-b border-faint-grey a-items-center'>
          <p className='text-14 text-dimgrey'>Add New Product to this section</p>
          <AiOutlineClose className='w-15 h-15 l:w-20 l:h-20' />
        </div>

        <div className='w-100p h-50 px-20 my-20 flex'>
            <div className=" w-100p pl-30 pr-7 flex overflow-hidden text-22 space-between h-100p py-5 border border-lightgrey radius-45 g|box-shadow:0px|_|2px|_|10px|_|0px|_|#00000014; ">
                <input type="text" placeholder='Search Product' className='border-none w-90p text-14 text-light-grey'/>
                <div className='w-9p flex items-center bg-green round h-100p text-white'>
                    <BsSearch className='w-15 mx-auto' />
                </div>
            </div>
        </div>

        <div className='px-20'>
          <p>Recently added products</p>
          <div className='flex gap-10 py-15'>
            {[0,0].map(() => (
              <div className='flex w-50p p-5 border border-deep-yellow radius-5 relative'>
                <div className='flex gap-10 items-center'>
                  <div className='w-45 h-45'>
                  <Image
                    className='w-fit h-100p radius-5'
                    src='order-product.png'
                    alt='product'
                    type='image'
                  />
                  </div>
                  <div className='line-height-15'>
                      <p className='text-12 text-dimgrey'>Quality Ankara Ga...</p>
                      <h1 className='text-12 text-black weight-500'>NGN 26,000</h1>
                  </div>
                </div>
                <div className='radius-50p absolute r-5'>
                  <Input
                      name='promotionProduct'
                      type='checkbox'
                      className='w-20 radius-50p'
                  />
                </div>
            </div>
            ))}
          </div>
        </div>

       <div className='pb-30'>
        <div className='text-green space-between flex text-14 px-20 py-10 radius-5 weight-500 border-b border-faint-grey'>
          <button className='border-none bg-none text-green '>Ankara</button>
          <button className='border-none bg-none'>Aso oke</button>
          <button className='border-none bg-none'>Linen</button>
          <button className='border-none bg-none'>Senator</button>
          <button className='border-none bg-none'>Lace</button>
          <button className='border-none bg-none'>Guinea</button>

        </div>
          <div className='px-20'>
            <div className='flex space-between py-15'>
              <p>Selected (15)</p>
              <p className='flex items-center'>All
              <Input
                      name='promotionProduct'
                      type='checkbox'
                      className='w-20 radius-50p'
                  />
              </p>
            </div>
            <div className='grid gap-10 grid-3-cols-auto'>
            {[0,0,0,0,0,0].map((data: any) => (
              <div className='p-7 border border-deep-yellow relative radius-8'>
                  <div className='w-100p h-100 relative'>
                      <Image
                        className='w-100p h-100p radius-5'
                        src='order-product.png'
                        alt='product'
                        type='image'
                      />
                      <div className='radius-50p absolute r-5 t-5'>
                      <Input
                          name='promotionProduct'
                          type='checkbox'
                          className='w-20 radius-50p  r-5'
                      />
                    </div>
                  </div>
                  <div className='line-height-20'>
                      <p className='text-12 text-dimgrey'>Quality Ankara Ga...</p>
                      <h1 className='text-12 text-black weight-500'>NGN 26,000</h1>
                      <p className='text-8 p-0 m-0 text-dimgrey opacity-70'>Ankara</p>
                  </div>

            </div>
            ))}
            </div>
          </div>
         </div>
       </div>
      </Modal>
    </div>
  );
};

export default PromoProductModal;
