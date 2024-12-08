'use client'

import { useOrders } from '../../utility/hooks/use-orders'
import { useState } from 'react'
import OrderDetails from './order-details/Order-details'
import OrderedProductModal from '../ordered-product/OrderedProductModal'
import OrderProgressCard from './order-progress-card/OrderProgressCard'
import { orderService } from '../../utility/services/order.service'

const OngoingOrder = ({ status }: { status: string }) => {
  const { orders } = useOrders()
  const [openOrderModal, setOpenModalOpen] = useState(false)
  const [orderCartModal, setOrderCartModal] = useState<any>()
  const [orderDetail, setOrderDetail] = useState(false)

  const handleOrderModal = () => {
    setOpenModalOpen(prev => !prev)
  }
  const handleOpenProductDetail = async (order: any, id: number) => {
    // const fetchSingleOrder = await orderService.fetchOrderById(
    //   id.toString(),
    //   {}
    // )
    // console.log({ id })
    setOrderDetail(prev => !prev)
    setOrderCartModal(order)
  }

  return (
    <>
      {orders.length > 0 && (
        <div className='relative bg-whitesmoke p-15 w-100p flex flex-col gap-15'>
          {orderDetail ? (
            <OrderDetails
              orderCartModal={orderCartModal}
              handleOpenProductDetail={handleOpenProductDetail}
              svgSrc='order-placed.svg'
              status='Ongoing'
            />
          ) : (
            <>
              <OrderProgressCard
                orders={orders}
                handleOrderModal={handleOrderModal}
                setOrderCartModal={setOrderCartModal}
                handleOpenProductDetail={handleOpenProductDetail}
                status='Ongoing'
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
