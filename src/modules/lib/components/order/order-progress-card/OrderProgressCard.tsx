import { Order } from '@/modules/lib/utility/types/order.interface'
import {
  formatDate,
  formatNumberAsPrice,
  formatTime,
  getStoreNames
} from '@/modules/lib/utility/utility'
import classNames from 'classnames'
import Link from 'next/link'
import React, { useState } from 'react'
import { MdKeyboardArrowRight } from 'react-icons/md'
import OverlappingImages from '../../overlapping-images/OverlappingImages'
import OrderedProductModal from '../../ordered-product/OrderedProductModal'

interface OrderProgressProp {
  orders: Order[]
  handleOrderModal: () => void
  setOrderCartModal: (order: Order) => void
}

const OrderProgressCard = ({
  orders,
  handleOrderModal,
  setOrderCartModal
}: OrderProgressProp) => {
  // const orderDetailModal = (order: Order) => {
  //   handleOrderModal()
  //   setOrderCartModal(order)
  // }
  const [openOrderProductDetails, setOpenOrderProductDetails] = useState(false)

  const handleOpenOrderProductDetail = () => {
    setOpenOrderProductDetails(prev => !prev)
  }

  return (
    <>
      {orders.map(order => (
        <>
          <div className='bg-white' key={order.id}>
            <div className='p-20 flex flex-col gap-20'>
              <div className='flex flex-col gap-10'>
                <div className='flex space-between a-items-center'>
                  <div className='whitespace-nowrap w-50p l:w-fit'>
                    <p className='color-#00000099 text-12 overflow-hidden text-ellipsis l:overflow'>
                      Order from:{' '}
                      <span className='weight-600 color-#000000E0 '>
                        {getStoreNames(order.cart.cartItems)}
                      </span>
                    </p>
                  </div>
                  <p
                    className={classNames('text-12 p-5 color-white radius-4', {
                      'bg-#1677FF':
                        order.status == 'Ongoing'.toLocaleUpperCase(),
                      'bg-#0B9378':
                        order.status == 'confirmed'.toLocaleUpperCase(),
                      'bg-#00000099':
                        order.status == 'Cancelled'.toLocaleUpperCase()
                    })}
                  >
                    {order.status}
                  </p>
                </div>
                <div
                  className={classNames('flex a-items-center space-between', {
                    'ml-50': order.cart.cartItems.length > 4,
                    'ml-80': order.cart.cartItems.length === 4,
                    'ml-70': order.cart.cartItems.length === 3,
                    'ml-55': order.cart.cartItems.length === 2,
                    'ml-40': order.cart.cartItems.length === 1
                  })}
                >
                  <div
                    className={classNames(
                      'text-12 flex a-items-center cursor-pointer h-full'
                    )}
                    onClick={handleOpenOrderProductDetail}
                  >
                    <div className={classNames('relative', {})}>
                      <OverlappingImages orderItem={order} />
                    </div>
                    <MdKeyboardArrowRight className='w-20 h-20 ml-5' />
                  </div>

                  <div className='flex flex-col gap-10'>
                    <p className='text-12 color-#00000099 text-right'>
                      Total Amount
                    </p>
                    <p className='color-black text-right weight-600'>
                      {formatNumberAsPrice(order.cart.total)}
                    </p>
                  </div>
                </div>
              </div>

              <div className='l:flex grid gap-10 l:gap-0 a-items-center space-between border-b border-t border-t-#00000014 border-b-#00000014  py-15'>
                <p className='text-14 color-#00000099'>
                  {formatDate(new Date(order.delivery.deliveryWindowStart))}
                </p>
                <p className='text-14 color-#00000099'>{order.id}</p>
              </div>

              {order.status === 'ONGOING' && (
                <>
                  <div className='flex flex-col gap-10 l:flex-row l:a-items-center l:space-between'>
                    <p className='text-14 weight-400 flex a-items-center'>
                      <span>Share this code with your rider</span>
                    </p>
                    <div className='flex a-items-center gap-10'>
                      {order.delivery.code.split('').map(str => (
                        <p className='h-40 w-40 radius-5 weight-600 bg-whitesmoke text-center flex a-items-center j-content-center'>
                          {str.toLocaleUpperCase()}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className='flex gap-10 a-items-center'>
                    <div className='p-5 radius-10 w-20p h-5 bg-#0B9378'></div>
                    <div className='p-5 radius-10 w-20p h-5 bg-whitesmoke'></div>
                    <div className='p-5 radius-10 w-20p h-5 bg-whitesmoke'></div>
                    <div className='p-5 radius-10 w-20p h-5 bg-whitesmoke'></div>
                    <div className='p-5 radius-10 w-20p h-5 bg-whitesmoke'></div>
                  </div>
                </>
              )}
              <div
                className={classNames(
                  'l:flex grid gap-10 l:gap-0 a-items-center space-between',
                  { 'j-content-end': order.status !== 'Ongoing' }
                )}
              >
                {status === 'Ongoing' && (
                  <p className='color-#00000099 text-14 weight-400'>
                    {formatTime(
                      order.delivery.deliveryWindowStart
                    ).toLocaleLowerCase()}{' '}
                    - Order Placed
                  </p>
                )}
                <Link
                  href={`/orders/${order.id}`}
                  className='color-#1677FF text-14 border-b border-b-#1677FF pb-1 cursor-pointer w-fit text-right'
                >
                  View more details
                </Link>
              </div>
            </div>
          </div>
          {openOrderProductDetails && (
            <OrderedProductModal
              handleOrderModal={handleOpenOrderProductDetail}
              order={order}
            />
          )}
        </>
      ))}
    </>
  )
}

export default OrderProgressCard
