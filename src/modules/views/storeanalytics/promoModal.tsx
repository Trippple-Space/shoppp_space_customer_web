"use client"

import Image from '@/modules/lib/components/image/Image';
import Input from '@/modules/lib/components/input/Input';
import Modal from '@/modules/lib/components/modal/modal';
import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai'
import { BsSearch } from 'react-icons/bs';
import { FaRegCheckCircle } from 'react-icons/fa';


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
                <div className='w-35 h-35 flex items-center bg-green round h-100p text-white mt-2'>
                    <BsSearch className='w-15 mx-auto' />
                </div>
            </div>
        </div>

        <div className='px-20'>
          <p className='text-14'>Recently added products</p>
          <div className='flex gap-10 py-15'>
            {[0,0].map(() => (
              <div className="border-solid border-1 border-yellow w-200 radius-8 flex space-between p-8 mt-15 mb-25">
                <div className="flex items-center gap-10">
                    <div className='w-50 h-50'>
                        <Image
                            className='w-fit h-100p radius-5 l:radius-10'
                            src={'order-product.png'}
                            alt='product'
                            type='image'
                        />
                    </div>
                    <div className="text-14 weight-500">
                        <div className="">Ankara g....</div>
                        <div className="mt-4">NGN 28,000</div>
                    </div>
                </div>
                <div ><FaRegCheckCircle className="text-yellow border-solid border-1 border-grey-300 radius-50p w-20 h-20 text-20" /></div>
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
              <p className='text-12'>Selected (15)</p>
              <p className='flex items-center text-12'>All
              <Input
                      name='promotionProduct'
                      type='checkbox'
                      className='w-20 radius-50p'
                  />
              </p>
            </div>
            <div className='grid gap-10 grid-3-cols-auto'>
            {[0,0,0,0,0,0].map((data: any) => (
              <div className="border-solid border-1 border-yellow w-130 radius-8 p-8">
                <div className="relative">
                  <div className="absolute r-5 t-5 ">
                      <FaRegCheckCircle className="text-yellow border-solid border-1 border-grey-300 radius-50p w-20 h-20 text-20 bg-white radius-50p w-fit" />
                  </div>
                  <div className='w-full h-100'>
                      <Image
                          className='w-full h-100p radius-5 l:radius-10'
                          src={'order-product.png'}
                          alt='product'
                          type='image'
                      />
                  </div>
                  <div className="text-14 weight-500">
                      <div className="text-12 mt-10 weight-500">Ankara grade II</div>
                      <div className="mt-4 text-12 weight-500">NGN 28,000</div>
                  </div>

                  <div className='text-8 weight-500 my-10'>Ankara</div>
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
