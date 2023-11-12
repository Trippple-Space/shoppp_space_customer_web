"use client"

import Image from '@/modules/lib/components/image/Image';
import Modal from '@/modules/lib/components/modal/modal';
import classNames from 'classnames';
import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai'
import OrderCard from '../../order-card/OrderCard';
import SavedItemCard from '../../save-item-card/SavedItemCard';

interface ModalProps {
  modalOpen: boolean;
  handleCloseModal: () => void;
  data: any;
}

const RecentlySearchItems: React.FC<ModalProps> = ({modalOpen, handleCloseModal, data}) => {
  const [action, setAction] = useState('open-orders');
  const savedData = ['Senator asoebi', 'Adidas sneakers', 'Men wrist watch', 'High quality ankara', 'Sandals' ];

  const selected = (option: any) => {
    switch (option) {
      case 'open-orders':
        return (
          <div className='text-16 weight-400 text-grey-700'>
            {
              savedData.map((data) => (
                <div className="pb-20 mb-20 px-30 border-b border-1 border-grey-300">
                  <span className="pointer hover:text-green">{data}</span>
                </div>
              ))
            }
          </div>
        )
    }
  }
  return (
    <div>
      <Modal isOpen={modalOpen} onClose={handleCloseModal} extraClass={{ overflow: 'auto' }}>
        <div className='w-330 l:w-1000 l:h-600'>
          <div className=''>
            <div className=''>
              <div className='grid g|grid-template-columns:1fr|_|auto items-center gap-52 px-48  border-solid border-b border-1 border-grey-300 text-18 weight-400 text-grey-700'>
                <div className={`py-20 pointer w-fit ${action == 'open-orders' && 'text-green border-b border-2 border-green'}`} onClick={() => setAction('open-orders') }>Recent Search</div>
                <div className="text-grey-700 weight-600 pointer flex gap-20" onClick={handleCloseModal}>
                  <button className='bg-none border-none text-14 text-dimgrey'>Clear all</button>
                  <AiOutlineClose className='text-grey-900 w-15 h-15 l:w-22 l:h-22' />
                </div>
              </div>
            </div>
            <div className="p-20">
                <div className="">
                    {selected(action)}
                </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RecentlySearchItems;
