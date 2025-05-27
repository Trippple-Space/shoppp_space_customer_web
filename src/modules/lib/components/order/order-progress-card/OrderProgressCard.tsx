import { Order } from '@/modules/lib/utility/types/order.interface'
import {
  formatDate,
  formatNumberAsPrice,
  formatTime,
  getCartItems,
  getStatusText,
  getStoreNames,
  onGoingOrderStatus
} from '@/modules/lib/utility/utility'
import classNames from 'classnames'
import Link from 'next/link'
import React, { useState } from 'react'
import { MdKeyboardArrowRight } from 'react-icons/md'
import OverlappingImages from '../../overlapping-images/OverlappingImages'
import OrderedProductModal from '../../ordered-product/OrderedProductModal'

interface OrderProgressProp {
  orders: Order[]
  setSingleOrder: (order: Order) => void
}

const OrderProgressCard = ({ orders }: OrderProgressProp) => {
  const [openOrderProductDetails, setOpenOrderProductDetails] = useState(false)
  const [orderedProduct, setOrderedProduct] = useState<Order>()

  const handleOpenOrderProductDetail = (order?: Order) => {
    setOpenOrderProductDetails(prev => !prev)
    setOrderedProduct(order)
  }

  const currentStatusIndex = (order: Order) => onGoingOrderStatus.indexOf(
    order.status.toUpperCase()
  )

  return (
    <>
      {orders.map(order => {
        const statusIndex = currentStatusIndex(order)
        const isOngoing = order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && order.status !== 'RETURNED'
        const cartItems = getCartItems(order?.cart?.storeGroups)

        return (
        <div key={order.id}>
          <div className='bg-white'>
            <div className='p-20 flex flex-col gap-20'>
              <div className='flex flex-col gap-10'>
                <div className='flex space-between a-items-center'>
                  <div className='whitespace-nowrap w-50p l:w-fit'>
                    <p className='color-#00000099 weight-400 text-12 overflow-hidden text-ellipsis l:overflow font-inter'>
                      Order from:{' '}
                      <span className='text-14 weight-500 color-#000000E0 '>
                        {getStoreNames(order?.cart?.storeGroups)}
                      </span>
                    </p>
                  </div>
                  <p
                    className={classNames(
                      'text-12 px-10 py-5 color-white radius-4 font-inter',
                      {
                        'bg-#1677FF': isOngoing,
                        'bg-#0B9378':
                          order.status == 'DELIVERED',
                        'bg-#00000099':
                          order.status == 'CANCELLED'
                      }
                    )}
                  >
                     {isOngoing ? 'ONGOING' : order.status}
                  </p>
                </div>
                <div
                  className={classNames('flex a-items-center space-between', {
                    'ml-45': cartItems?.length > 4,
                    'ml-80': cartItems?.length === 4,
                    'ml-70': cartItems?.length === 3,
                    'ml-55': cartItems?.length === 2,
                    'ml-40': cartItems?.length === 1
                  })}
                  >
                    
                  <div
                    className={classNames(
                      'text-12 flex a-items-center cursor-pointer h-full'
                    )}
                    onClick={() => handleOpenOrderProductDetail(order)}
                  >
                    <div className={classNames('relative', {})}>
                      <OverlappingImages orderItem={order} />
                    </div>
                    <MdKeyboardArrowRight className='w-20 h-20 ml-5' />
                  </div>

                  <div className='flex flex-col gap-10'>
                    <p className='text-12 weight-400 color-#00000099 text-right'>
                      Total Amount
                    </p>
                    <p className='color-black text-right weight-600'>
                      {formatNumberAsPrice(order?.cart?.total)}
                    </p>
                  </div>
                </div>
              </div>

              <div className='l:flex grid gap-10 l:gap-0 a-items-center space-between border-b border-t border-t-#00000014 border-b-#00000014  py-15'>
                <p className='text-14 weight-400 color-#00000099'>
                  {formatDate(new Date(order.delivery.dateCreated))}
                </p>
                <p className='text-14 weight-400 color-#00000099'>{order.id}</p>
              </div>

              {isOngoing && (
                <>
                  <div className='flex flex-col gap-10 l:flex-row l:a-items-center l:space-between'>
                    <p className='text-14 weight-400 flex a-items-center'>
                      <span>Share this code with your rider</span>
                    </p>
                    <div className='flex a-items-center gap-10'>
                      {order.delivery.code.split('').map((str, i) => (
                        <p
                          className='h-40 w-40 radius-5 weight-600 bg-whitesmoke text-center flex a-items-center j-content-center text-16'
                          key={i}
                        >
                          {str.toLocaleUpperCase()}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className='flex gap-10 a-items-center'>
                      {onGoingOrderStatus.map((status, index) =>
                        <div key={index} className={`p-5 radius-10 w-20p h-5 ${ index <=statusIndex ? 'bg-#0B9378': 'bg-whitesmoke'}`}></div>)}
                  </div>
                </>
              )}
              <div
                className={classNames(
                  'l:flex flex-row gap-6 l:gap-0 a-items-center l:space-between',
                  { 'j-content-end': isOngoing}
                )}
              >
                { isOngoing && (
                  <p className='color-#00000099 text-14 weight-400 mb-8 l:mb-0'>
                    {formatTime(
                      order.delivery.deliveryDate
                    ).toLocaleLowerCase()}{' '}
                    - {getStatusText(order.status)}
                  </p>
                )}
                <Link
                  href={`/orders/${order.id}`}
                  className='color-#1677FF text-14 weight-400 border-b border-b-#1677FF pb-1 cursor-pointer w-fit text-right'
                >
                  View more details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )})}
      {openOrderProductDetails && (
        <OrderedProductModal
          
          handleOrderModal={handleOpenOrderProductDetail}
          order={orderedProduct}
        />
      )}
    </>
  )
}

export default OrderProgressCard
