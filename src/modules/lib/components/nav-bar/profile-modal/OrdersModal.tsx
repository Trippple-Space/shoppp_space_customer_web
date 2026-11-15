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
          <div className='text-[16px] font-normal text-[#6B6662]'>
            {
              orders.map(order => (
                <OrderCard order={order}  />
              ))
            }
          </div>
        )

      // case 'closed-orders':
      //   return (
      //     <div className='text-[16px] font-normal text-[#6B6662]'>
      //       {
      //         ['', '', '', ''].map(() => (
      //           <div className="pb-[20px] mb-[20px] border-b border border-[#E4E1DF]">
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
      <Modal isOpen={modalOpen} onClose={handleCloseModal} extraClass={{ overflow: 'auto' }} className="w-full lg:w-fit">
        <div className='w-full h-screen lg:w-[1000px] lg:h-[600px]'>
          <div className=''>
            <div className=''>
              <div className='flex justify-between items-center gap-[30px] lg:gap-[52px] px-[20px] lg:px-[48px]  border-solid border-b border border-[#E4E1DF] text-[14px] lg:text-[18px] font-normal text-[#6B6662]'>
                <div className={`py-[20px] cursor-pointer ${action == 'open-orders' && 'text-brand border-b border-[2px] border-brand'}`} onClick={() => setAction('open-orders') }> Open orders</div>
                {/* <div className={`py-[20px] cursor-pointer w-fit ${action == 'closed-orders' && 'text-brand border-b border-[2px]  border-brand'}`} onClick={() => setAction('closed-orders') }> Closed orders</div> */}
                <div className="text-[#6B6662] font-bold cursor-pointer mt-[12px]" onClick={handleCloseModal}><AiOutlineClose /></div>
              </div>
            </div>
            <div className="p-[20px]">
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
