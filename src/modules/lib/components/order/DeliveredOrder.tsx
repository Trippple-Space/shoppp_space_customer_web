import React, { useState } from 'react'
import OrderDetails from './order-details/Order-details'
import { useOrders } from '../../utility/hooks/use-orders'
import OrderedProductModal from '../ordered-product/OrderedProductModal'
import OrderProgressCard from './order-progress-card/OrderProgressCard'

const DeliveredOrder = ({ status }: { status: string }) => {
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
              svgSrc='order-delivered.svg'
              status='Delivered'
            />
          ) : (
            <>
              <OrderProgressCard
                orders={orders}
                handleOrderModal={handleOrderModal}
                setOrderCartModal={setOrderCartModal}
                handleOpenProductDetail={handleOpenProductDetail}
                status='Delivered'
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

export default DeliveredOrder
