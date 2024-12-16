import React, { useEffect, useState } from 'react'
import OrderProgressCard from './order-progress-card/OrderProgressCard'
import OrderDetails from '../../../views/order-details/Order-details'
import { useOrders } from '../../utility/hooks/use-orders'
import OrderedProductModal from '../ordered-product/OrderedProductModal'
import { useOrderView } from '../../utility/hooks/views/use-order-view'
import { Order } from '../../utility/types/order.interface'
import Link from 'next/link'
import Image from '../image/Image'
import { useParams } from 'next/navigation'

const CancelledOrder = () => {
  const { orders, fetchOrderById, singleOrder } = useOrderView({
    filters: { status: { In: ['CANCELLED'] } }
  })

  const [openOrderModal, setOpenModalOpen] = useState(false)
  const [orderCartModal, setOrderCartModal] = useState<Order | void>(
    singleOrder
  )

  const handleOrderModal = () => {
    setOpenModalOpen(prev => !prev)
  }

  const handleOpenProductDetail = (order: Order) => {
    fetchOrderById(order.id, {})
  }

  useEffect(() => {
    setOrderCartModal(singleOrder)
  }, [singleOrder])

  return (
    <>
      {orders.length > 0 && (
        <div className='relative bg-whitesmoke p-15 w-100p flex flex-col gap-15'>
          {orderCartModal ? (
            <OrderDetails orderCartModal={orderCartModal} />
          ) : (
            <>
              <OrderProgressCard
                orders={orders}
                handleOrderModal={handleOrderModal}
                setOrderCartModal={setOrderCartModal}
              />
              {openOrderModal && (
                <OrderedProductModal
                  handleOrderModal={handleOrderModal}
                  orderCartModal={orderCartModal}
                />
              )}
            </>
          )}
        </div>
      )}
      {orders.length <= 0 && (
        <>
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
              className='cursor-pointer px-15 py-12 l:w-250 bg-#0B9378  radius-6 color-white text-center weight-400'
            >
              Explore products
            </Link>
          </div>
        </>
      )}
    </>
  )
}

export default CancelledOrder
