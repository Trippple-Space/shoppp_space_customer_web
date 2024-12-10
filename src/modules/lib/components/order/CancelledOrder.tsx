import React, { useEffect, useState } from 'react'
import OrderProgressCard from './order-progress-card/OrderProgressCard'
import OrderDetails from './order-details/Order-details'
import { useOrders } from '../../utility/hooks/use-orders'
import OrderedProductModal from '../ordered-product/OrderedProductModal'
import { useOrderView } from '../../utility/hooks/views/use-order-view'
import { Order } from '../../utility/types/order.interface'

const CancelledOrder = () => {
  const { orders, fetchOrderById, singleOrder } = useOrderView({
    filters: { status: { In: ['CANCELLED'] } }
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
              svgSrc='order-cancelled.svg'
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
                <OrderedProductModal
                  handleOrderModal={handleOrderModal}
                  orderCartModal={orderCartModal}
                />
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}

export default CancelledOrder
