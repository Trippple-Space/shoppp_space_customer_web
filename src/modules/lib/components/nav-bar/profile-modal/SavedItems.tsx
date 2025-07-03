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

const SavedItemsModal: React.FC<ModalProps> = ({ modalOpen, handleCloseModal }) => {
  const [action, setAction] = useState('open-orders');

  const { savedVariants, removeSavedVariant, clearSavedVariants } = useSavedVariant()


  const selected = (option: any) => {
    switch (option) {
      case 'open-orders':
        return (
          <div className='text-16 weight-400 text-grey-700'>
            {
              savedVariants.length === 0 ?
                <div className='flex flex-col a-items-center gap-8 py-16 h-full j-content-center'>
                  <Image
                    src='empty-tray.png'
                    className='w-184 h-152 object-fit-scale-down ml--30'
                    alt='empty'
                  />
                  <p className='text-14 weight-400 line-height-22 color-#00000073 w-320 px-12 py-5'>
                    Continue shopping to discover our best deals!
                  </p>
                </div>
                :
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
        overflow: 'hidden',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        height: "calc(100dvh - 80px)",
        width: "90%",
        maxWidth: "800px"
      }}>
        <div className='relative w-full'>
          <div className='w-full'>
            <div className='bg-white z-5 w-100p' style={{ borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
              <div className='flex space-between items-center px-48   border-b border-1 border-grey-300 text-18 weight-400 text-grey-700'>
                <div className={`py-20 pointer w-fit ${action == 'open-orders' && 'text-green border-b border-2 border-green'}`} onClick={() => setAction('open-orders')}>Saved items</div>
              </div>
            </div>
            <div className="p-20 overflow-auto no-scrollbar" style={{ height: "calc(100dvh - 230px)" }}>
              <div className="">
                {selected(action)}
              </div>
            </div>
          </div>
        </div>
        <div className='border-t border-#00000014'>
          <div className='p-20 flex gap-10 a-items-center j-content-end bg w-full'>
            <button className='px-25 py-10 radius-6 outline-none border-1 weight-500 bg-none color-black cursor-pointer' onClick={handleCloseModal} >Close</button>

            {
              savedVariants.length > 0 && <button className='px-25 py-10 radius-6 outline-none border-none bg-#D4280C color-white cursor-pointer' onClick={() => {
                clearSavedVariants()
              }}>Clear saved items</button>
            }
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SavedItemsModal;
