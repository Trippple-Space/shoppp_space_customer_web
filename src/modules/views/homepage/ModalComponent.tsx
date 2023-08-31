"use client"

import Image from '@/modules/lib/components/image/Image';
import Modal from '@/modules/lib/components/modal/modal';
import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai'
import { BiHomeAlt2 } from 'react-icons/bi';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';


interface ModalProps {
  modalOpen: boolean;
  handleCloseModal: () => void;
  data: any;
}

const HomepageModal: React.FC<ModalProps> = ({modalOpen, handleCloseModal, data}) => {

  return (
    <div>
      <Modal isOpen={modalOpen} onClose={() => ''} extraClass={{ top: '210px', left: '115px', overflow: 'hidden' }}>
       <div className='w-330 l:w-700'>
        <div className='w-100p grid grid-2-cols-auto gap-30 py-5 l:py-25 px-35'>

            <div className='flex gap-10 l:gap-20 items-center'>
                <div className='w-45 h-45 flex items-center border border-green radius-5'>
                  <BiHomeAlt2 />
                </div>
                <div className='line-height-20 weight-400 text-dimgrey'>
                  <p className='text-16 '>Asoebi Home</p>
                  <p className='text-12 opacity-70'>Explore all Asoebi Fabrics</p>

                </div>
              </div>

              {[0, 0, 0, 0, 0].map(() => (
                <div className='flex gap-10 l:gap-20 items-center'>
                  <div className='w-45 h-45'>
                    <Image
                      className="w-fit h-100p pointer radius-5 l:radius-5 a-self-center g|object-fit:cover"
                      src='order-product.png'
                      alt="product-image"
                    />
                  </div>
                  <div className='line-height-20 weight-400 text-dimgrey'>
                    <p className='text-16 '>Asoebi Home</p>
                    <p className='text-12 opacity-70'>Explore all Asoebi Fabrics</p>

                  </div>
              </div>
            ))}
            </div>

            <div className='flex space-between border-t border-lighter-grey px-35 py-20'>
              <button disabled className="hidden w-125 l:flex items-center j-content-center bg-white px-12 py-7 text-15 weight-500 text-dimgrey border-1 border-whisper radius-7">
                <BsArrowLeftShort className='w-30 h-22' />
                Previous
              </button>

              <button className="hidden w-125 l:flex bg-white items-center j-content-center px-12 py-7 text-15 weight-500 text-dimgrey border-1 border-whisper radius-7">
                Next
                <BsArrowRightShort className='w-30 h-22' />
              </button>
            </div>
       </div>
      </Modal>
    </div>
  );
};

export default HomepageModal;
