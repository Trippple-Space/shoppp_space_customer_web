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

const FilterModal: React.FC<ModalProps> = ({modalOpen, handleCloseModal, data}) => {

  return (
    <div>
      <Modal isOpen={modalOpen} onClose={() => ''} extraClass={{ top: '330px', right: '100px', overflow: 'hidden' }}>
       <div className='w-250 py-20 l:w-300 text-16'>
          <div className='px-25'>
            <p className='py-10 text-green'>Popular</p>
            <p className='py-10'>Trending</p>
            <p className='py-10'>New items</p>
          </div>
        

            <div className='flex space-between border-t border-lighter-grey px-25'>
              <p className='py-10'>Random</p>
             
            </div>
       </div>
      </Modal>
    </div>
  );
};

export default FilterModal;
