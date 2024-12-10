'use client'

import { useEffect, useState } from 'react'
import OrderDetails from './order-details/Order-details'
import OrderedProductModal from '../ordered-product/OrderedProductModal'
import OrderProgressCard from './order-progress-card/OrderProgressCard'
import { orderService } from '../../utility/services/order.service'
import { useOrderView } from '../../utility/hooks/views/use-order-view'
import { Order } from '../../utility/types/order.interface'

const OngoingOrder = () => {
  const { orders, singleOrder, fetchOrderById } = useOrderView({
    filters: { status: { In: ['ONGOING'] } }
  })
  const [openOrderModal, setOpenModalOpen] = useState(false)
  const [orderCartModal, setOrderCartModal] = useState<Order | void>(
    singleOrder
  )
  const [orderDetail, setOrderDetail] = useState(false)

  const handleOrderModal = () => {
    setOpenModalOpen(prev => !prev)
  }

  const handleOpenProductDetail = async (order: Order) => {
    fetchOrderById(order.id, {})
    setOrderDetail(prev => !prev)
  }

  useEffect(() => {
    setOrderCartModal(singleOrder)
  }, [singleOrder])

  return (
    <>
      {orders.length > 0 && (
        <div className='relative bg-whitesmoke p-15 w-100p flex flex-col gap-15'>
          {orderDetail && orderCartModal ? (
            <OrderDetails
              orderCartModal={orderCartModal}
              handleOpenProductDetail={handleOpenProductDetail}
              svgSrc='order-placed.svg'
            />
          ) : (
            <>
              <OrderProgressCard
                orders={orders}
                handleOrderModal={handleOrderModal}
                setOrderCartModal={setOrderCartModal}
                handleOpenProductDetail={handleOpenProductDetail}
              />
              {openOrderModal && (
                <>
                  <OrderedProductModal
                    handleOrderModal={handleOrderModal}
                    orderCartModal={orderCartModal}
                  />
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}

export default OngoingOrder
