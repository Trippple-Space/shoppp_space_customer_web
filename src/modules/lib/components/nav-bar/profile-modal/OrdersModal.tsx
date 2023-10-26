"use client"

import Image from '@/modules/lib/components/image/Image';
import Modal from '@/modules/lib/components/modal/modal';
import classNames from 'classnames';
import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai'
import OrderCard from '../../order-card/OrderCard';

interface ModalProps {
  modalOpen: boolean;
  handleCloseModal: () => void;
  data: any;
}

const OrdersModal: React.FC<ModalProps> = ({modalOpen, handleCloseModal, data}) => {
  const [action, setAction] = useState('open-orders');

  const selected = (option: any) => {
    switch (option) {
      case 'open-orders':
        return (
          <div className='text-16 weight-400 text-natural-700'>
            <OrderCard />
          </div>
        )

      case 'closed-orders':
        return (
          <div className='text-16 weight-400 text-natural-700'>
            {
              ['', '', '', ''].map(() => (
                <div className="pb-20 mb-20 border-b border-1 border-natural-300">
                  <OrderCard />
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
              <div className='grid g|grid-template-columns:auto|_|1fr|_|auto items-center gap-52 px-48  border-solid border-b border-1 border-natural-300 text-18 weight-400 text-natural-700'>
                <div className={`py-20 pointer ${action == 'open-orders' && 'text-green border-b border-2 border-green'}`} onClick={() => setAction('open-orders') }> Open orders</div>
                <div className={`py-20 pointer w-fit ${action == 'closed-orders' && 'text-green border-b border-2  border-green'}`} onClick={() => setAction('closed-orders') }> Closed orders</div>
                <div className="text-natural-700 weight-600 pointer" onClick={handleCloseModal}><AiOutlineClose /></div>
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

export default OrdersModal;
