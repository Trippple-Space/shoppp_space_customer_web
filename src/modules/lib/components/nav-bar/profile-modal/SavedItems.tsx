"use client"

import Image from '@/modules/lib/components/image/Image';
import Modal from '@/modules/lib/components/modal/modal';
import classNames from 'classnames';
import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai'
import OrderCard from '../../order-card/OrderCard';
import SavedItemCard from '../../save-item-card/SavedItemCard';
import { useSavedVariant } from '@/modules/lib/utility/hooks/use-saved-variants';


interface ModalProps {
  modalOpen: boolean;
  handleCloseModal: () => void;
  data: any;
}

const SavedItemsModal: React.FC<ModalProps> = ({modalOpen, handleCloseModal}) => {
  const [action, setAction] = useState('open-orders');

  const { savedVariants, removeSavedVariant, clearSavedVariants } = useSavedVariant()
  

  const selected = (option: any) => {
    switch (option) {
      case 'open-orders':
        return (
          <div className='text-16 weight-400 text-grey-700 l:mt-60 mt-80'>
            {
              savedVariants.map((savedVariant) => (
                <div className="pb-20 mb-30 border-b border-1 border-grey-300">
                  <SavedItemCard savedVariant={savedVariant} removeSavedVariant={removeSavedVariant} />
                </div>
              ))
            }
      
          </div>
        )
    }
  }
  return (
    <div>
      <Modal isOpen={modalOpen} onClose={handleCloseModal} extraClass={{
        overflow: 'auto',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px'
      }}>
        <div className='w-330 l:w-1000 l:h-600 h-500 no-scrollbar relative overflow-auto'>
          <div className='relative'>
            <div className='fixed top-0 l:w-1000 w-330 bg-white z-5' style={{borderTopLeftRadius: '10px', borderTopRightRadius: '10px'}}>
              <div className='flex space-between items-center  px-48   border-b border-1 border-grey-300 text-18 weight-400 text-grey-700'>
                <div className={`py-20 pointer w-fit ${action == 'open-orders' && 'text-green border-b border-2 border-green'}`} onClick={() => setAction('open-orders')}>Saved items</div>
              </div>
            </div>
            <div className="p-20">
                <div className="">
                    {selected(action)}
                </div>
            </div>
      </div>
        </div>
          <div className='border-t border-#00000014'>
            <div className='p-20 flex gap-10 a-items-center j-content-end bg w-full'>
            <button className='px-25 py-10 radius-6 outline-none border-1 weight-500 bg-none color-black cursor-pointer' onClick={handleCloseModal} >Close</button>
            
              <button className='px-25 py-10 radius-6 outline-none border-none bg-#D4280C color-white cursor-pointer' onClick={() => {
                    clearSavedVariants()
                  }}>Clear saved items</button>
              </div>
          </div>
      </Modal>
    </div>
  );
};

export default SavedItemsModal;
