"use client"

import Image from '@/modules/lib/components/image/Image';
import Modal from '@/modules/lib/components/modal/modal';
import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai'
import { RxCaretDown } from 'react-icons/rx';


interface ModalProps {
  modalOpen: boolean;
  handleCloseModal: () => void;
  data: any;
}

const MobileFilterModal: React.FC<ModalProps> = ({modalOpen, handleCloseModal, data}) => {

  return (
    <div>
      <Modal isOpen={modalOpen} onClose={handleCloseModal}>
       <div className='w-330 l:w-1000 py-5 l:py-20 scroll'>
        <div className='flex space-between py-10 relative'>
         <div className='w-10p l:w-3p py-5 border-b border-2 border-faint-grey'></div>
         <div className='flex weight-400 border-b border-3 border-green w-20p text-16 text-green'>
            <p className=' py-10 px-10 pointr'>Filter</p>
         </div>
         <div className='w-70p l:w-68p py-5 border-b border-2 border-faint-grey'></div>
         <div className='absolute t-15 l:t-0 r-10 l:r-15 pointer' onClick={handleCloseModal}>
            <AiOutlineClose className='w-15 h-15 l:w-25 l:h-25' />
         </div>
        </div>

        <div className="px-15 space-between">

              <div className='w-100p my-10 h-55 mt-20 weight-400 text-18 text-dimgrey border border-deep-grey radius-10'>
                  <div className='flex h-100p px-10 space-between items-center w-fit gap-10 pointer'>
                      <select name="" id="" className='border-none bg-white text-15 l:text-17 text-black weight-500'>
                      <option value="">Popular</option>
                      <option value="">Trending</option>

                      <span><RxCaretDown className='w-30 h-30' /></span>


                    </select>
                  </div>
              </div>
              <div className='w-100p my-20'>
                  <p className='text-dimgrey pb-10 text-16 text-left'>Minimum price (NGN)</p>
                  <div className=" w-100p px-25 flex overflow-hidden text-22 space-between h-100p py-7 border border-deep-grey radius-5 ">
                      <input type="text" placeholder='5,000' className='border-none h-42 w-100p text-16 text-light-grey'/>
                  </div>
              </div>

              <div className='w-100p my-20'>
                  <p className='text-dimgrey pb-10 text-16 text-left'>Maximum price (NGN)</p>
                  <div className=" w-100p px-25 flex overflow-hidden text-22 space-between h-100p py-7 border border-deep-grey radius-5 ">
                      <input type="text" placeholder='100,000' className='border-none h-42 w-100p text-16 text-light-grey'/>
                  </div>
              </div>

        </div>

        <div className='flex j-content-end gap-10 px-15 py-10'>
        <div className='h-100p'>
            <button className='w-100p h-100p border-none bg-white text-dimgrey text-16 py-10 px-20 radius-5 weight-400'>Discard</button>
        </div>
        <div className='h-100p'>
            <button className='w-100p h-100p border-none bg-green text-white text-16 py-10 px-20 radius-5 weight-400'>Filter</button>
        </div>
        </div>


       </div>
      </Modal>
    </div>
  );
};

export default MobileFilterModal;
