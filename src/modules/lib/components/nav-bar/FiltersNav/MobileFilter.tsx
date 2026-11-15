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
       <div className='w-[330px] lg:w-[1000px] py-[5px] lg:py-[20px] scroll'>
        <div className='flex justify-between py-[10px] relative'>
         <div className='w-[10%] lg:w-[3%] py-[5px] border-b border-[2px] border-[#DADADA]'></div>
         <div className='flex font-normal border-b border-[3px] border-brand w-[20%] text-[16px] text-brand'>
            <p className=' py-[10px] px-[10px] pointr'>Filter</p>
         </div>
         <div className='w-[70%] lg:w-[68%] py-[5px] border-b border-[2px] border-[#DADADA]'></div>
         <div className='absolute top-[15px] lg:top-0 right-[10px] lg:right-[15px] cursor-pointer' onClick={handleCloseModal}>
            <AiOutlineClose className='w-[15px] h-[15px] lg:w-[25px] lg:h-[25px]' />
         </div>
        </div>

        <div className="px-[15px] justify-between">

              <div className='w-full my-[10px] h-[55px] mt-[20px] font-normal text-[18px] text-[#333333] border border-[#A6A6A6] rounded-[10px]'>
                  <div className='flex h-full px-[10px] justify-between items-center w-fit gap-[10px] cursor-pointer'>
                      <select name="" id="" className='border-none bg-white text-[15px] lg:text-[17px] text-black font-medium'>
                      <option value="">Popular</option>
                      <option value="">Trending</option>

                      <span><RxCaretDown className='w-[30px] h-[30px]' /></span>


                    </select>
                  </div>
              </div>
              <div className='w-full my-[20px]'>
                  <p className='text-[#333333] pb-[10px] text-[16px] text-left'>Minimum price (NGN)</p>
                  <div className=" w-full px-[25px] flex overflow-hidden text-[22px] justify-between h-full py-[7px] border border-[#A6A6A6] rounded-[5px] ">
                      <input type="text" placeholder='5,000' className='border-none h-[42px] w-full text-[16px] text-[#A8A6A6]'/>
                  </div>
              </div>

              <div className='w-full my-[20px]'>
                  <p className='text-[#333333] pb-[10px] text-[16px] text-left'>Maximum price (NGN)</p>
                  <div className=" w-full px-[25px] flex overflow-hidden text-[22px] justify-between h-full py-[7px] border border-[#A6A6A6] rounded-[5px] ">
                      <input type="text" placeholder='100,000' className='border-none h-[42px] w-full text-[16px] text-[#A8A6A6]'/>
                  </div>
              </div>

        </div>

        <div className='flex justify-end gap-[10px] px-[15px] py-[10px]'>
        <div className='h-full'>
            <button className='w-full h-full border-none bg-white text-[#333333] text-[16px] py-[10px] px-[20px] rounded-[5px] font-normal'>Discard</button>
        </div>
        <div className='h-full'>
            <button className='w-full h-full border-none bg-brand text-white text-[16px] py-[10px] px-[20px] rounded-[5px] font-normal'>Filter</button>
        </div>
        </div>


       </div>
      </Modal>
    </div>
  );
};

export default MobileFilterModal;
