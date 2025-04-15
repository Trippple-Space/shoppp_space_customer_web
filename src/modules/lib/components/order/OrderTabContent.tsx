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
  const { orders, singleOrder, fetching } = useOrders({
    filters: { status: { In: status ==='ONGOING' ? onGoingOrderStatusQuery : status } }
  })
  const [orderCartModal, setOrderCartModal] = useState<Order | void>(
    singleOrder
  )

  if (fetching) {
    return (
      <div className='relative w-100p h-250'>
        <div className='h-100p absolute flex a-items-center  l-50p g|transform:translate(-50%) b-0'>
          <PuffLoader />
        </div>
      </div>
    )
  }

  return (
    <>
      {orders.length > 0 ? (
        <div className='relative bg-whitesmoke p-15 w-full flex flex-col gap-15'>
          {orderCartModal ? (
            <OrderDetails orderId={orderCartModal.id} />
          ) : (
            <OrderProgressCard
              orders={orders}
              setOrderCartModal={setOrderCartModal}
            />
          )}
        </div>
      ) : (
        <div className='flex flex-col a-items-center gap-10 mt-30'>
          <div className='flex flex-col a-items-center gap-10'>
            <Image
              type='icon'
              className='w-200'
              src='order-message.svg'
              alt='no-order-image'
            />
            <p className='text-center text-14 color-#00000073'>
              We are waiting for your next order
            </p>
          </div>

          <Link
            href='/'
            className='cursor-pointer px-15 py-12 l:w-250 bg-#0B9378 radius-6 color-white text-center weight-400'
          >
            Explore products
          </Link>
        </div>
      )}
    </>
  )
}

export default OrderTabContent
