'use client'

import { useEffect, useState } from 'react'
import OrderDetails from '../../../views/order-details/Order-details'
import OrderProgressCard from './order-progress-card/OrderProgressCard'
import { Order } from '../../utility/types/order.interface'
import Image from '../image/Image'
import Link from 'next/link'
import { useOrders } from '../../utility/hooks/use-orders'
import PuffLoader from '../puff-loader/PuffLoader'
import { onGoingOrderStatusQuery } from '../../utility/utility'

interface OrderTabContentProps {
  status: any
}



const OrderTabContent = ({ status }: OrderTabContentProps) => {
  const { orders, singleOrder: order, fetching } = useOrders({
    filters: { status: { In: status ==='ONGOING' ? onGoingOrderStatusQuery : status } }
  })
  const [singleOrder, setSingleOrder] = useState<Order | void>(
    order
  )

  if (fetching) {
    return (
      <div className='relative w-full h-[250px]'>
        <div className='h-full absolute flex items-center  left-[50%] [transform:translate(-50%)] bottom-0'>
          <PuffLoader />
        </div>
      </div>
    )
  }

  return (
    <>
      {orders.length > 0 ? (
        <div className='relative bg-[#F5F5F5] p-[15px] w-full flex flex-col gap-[15px]'>
          {singleOrder ? (
            <OrderDetails orderId={singleOrder.id} />
          ) : (
            <OrderProgressCard
              orders={orders}
              setSingleOrder={setSingleOrder}
            />
          )}
        </div>
      ) : (
        <div className='flex flex-col items-center gap-[10px] mt-[30px]'>
          <div className='flex flex-col items-center gap-[10px]'>
            <Image
              type='icon'
              className='w-[200px] h-[200px]'
              src='order-message.svg'
              alt='no-order-image'
            />
            <p className='text-center text-[14px] text-[#00000073]'>
              We are waiting for your next order
            </p>
          </div>

          <Link
            href='/'
            className='cursor-pointer px-[15px] py-[12px] lg:w-[250px] bg-[#0357EE] rounded-[6px] text-white text-center font-normal'
          >
            Explore products
          </Link>
        </div>
      )}
    </>
  )
}

export default OrderTabContent
