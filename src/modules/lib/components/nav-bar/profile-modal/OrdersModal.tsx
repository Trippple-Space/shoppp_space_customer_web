"use client"

import Image from '@/modules/lib/components/image/Image';
import Modal from '@/modules/lib/components/modal/modal';
import classNames from 'classnames';
import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai'
import OrderCard from '../../order-card/OrderCard';
import { useOrders } from '@/modules/lib/utility/hooks/use-orders';

interface ModalProps {
  modalOpen: boolean;
  handleCloseModal: () => void;
  data: any;
}

const OrdersModal: React.FC<ModalProps> = ({modalOpen, handleCloseModal, data}) => {
  const [action, setAction] = useState('open-orders');
  const { orders, fetchOrders } = useOrders({})


  const selected = (option: any) => {
    switch (option) {
      case 'open-orders':
        return (
          <div className='text-16 weight-400 text-grey-700'>
            {
              orders.map(order => (
                <OrderCard order={order}  />
              ))
            }
          </div>
        )

      // case 'closed-orders':
      //   return (
      //     <div className='text-16 weight-400 text-grey-700'>
      //       {
      //         ['', '', '', ''].map(() => (
      //           <div className="pb-20 mb-20 border-b border-1 border-grey-300">
      //             <OrderCard order={order} />
      //           </div>
      //         ))
      //       }
      //     </div>
      //   )
    }
  }
  return (
    <div>
      <Modal isOpen={modalOpen} onClose={handleCloseModal} extraClass={{ overflow: 'auto' }} className="w-100p l:w-fit">
        <div className='w-100p h-100vh l:w-1000 l:h-600'>
          <div className=''>
            <div className=''>
              <div className='flex space-between items-center gap-30 l:gap-52 px-20 l:px-48  border-solid border-b border-1 border-grey-300 text-14 l:text-18 weight-400 text-grey-700'>
                <div className={`py-20 pointer ${action == 'open-orders' && 'text-green border-b border-2 border-green'}`} onClick={() => setAction('open-orders') }> Open orders</div>
                {/* <div className={`py-20 pointer w-fit ${action == 'closed-orders' && 'text-green border-b border-2  border-green'}`} onClick={() => setAction('closed-orders') }> Closed orders</div> */}
                <div className="text-grey-700 weight-700 pointer mt-12" onClick={handleCloseModal}><AiOutlineClose /></div>
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
