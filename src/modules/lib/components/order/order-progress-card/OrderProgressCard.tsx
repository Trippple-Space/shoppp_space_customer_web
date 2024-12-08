import { Order } from '@/modules/lib/utility/types/order.interface'
import {
  formatDate,
  formatNumberAsPrice,
  formatTime,
  getStoreNames
} from '@/modules/lib/utility/utility'
import classNames from 'classnames'
import Link from 'next/link'
import React from 'react'
import { MdKeyboardArrowRight } from 'react-icons/md'

interface OrderProgressProp {
  orders: Order[]
  handleOrderModal: () => void
  setOrderCartModal: (order: Order) => void
  handleOpenProductDetail: (order: Order, id: number) => void
  status: string
}

const OrderProgressCard = ({
  orders,
  handleOrderModal,
  setOrderCartModal,
  handleOpenProductDetail,
  status
}: OrderProgressProp) => {
  return (
    <>
      {orders.map(order => (
        <>
          <div className='bg-white'>
            <div className='p-20 flex flex-col gap-20'>
              <div className='flex space-between a-items-center'>
                <p className='text-12 text-black'>
                  <span className='color-#00000099'>Order from:</span>{' '}
                  {getStoreNames(order.cart.cartItems)}
                </p>
                <p
                  className={classNames('text-12 p-5 color-white radius-4', {
                    'bg-#1677FF': status === 'Ongoing',
                    'bg-#0B9378': status === 'Delivered',
                    'bg-#00000099': status === 'Cancelled'
                  })}
                >
                  {/* {order.status} */}
                  {status}
                </p>
              </div>
              <div className='flex a-items-center space-between'>
                <div
                  className='text-12 flex a-items-center w-fit bg-green cursor-pointer'
                  onClick={handleOrderModal}
                >
                  <div onClick={() => setOrderCartModal(order)}>
                    Overlapping image
                  </div>
                  <MdKeyboardArrowRight className='w-20 h-20' />
                </div>

                <div className='flex flex-col gap-10'>
                  <p className='text-12 color-#00000099'>Total Amount</p>
                  <p className='text-16 color-black text-end weight-600'>
                    {formatNumberAsPrice(order.cart.total)}
                  </p>
                </div>
              </div>

              <div className='l:flex grid gap-10 l:gap-0 a-items-center space-between border-b border-t border-t-#00000014 border-b-#00000014  py-15'>
                <p className='text-14 color-#00000099'>
                  {formatDate(new Date(order.delivery.deliveryWindowStart))}
                </p>
                <p className='text-14 color-#00000099'>{order.id}</p>
              </div>

              {status === 'Ongoing' && (
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
                  <div>progress bars</div>
                </>
              )}
              <div
                className={classNames(
                  'l:flex grid gap-10 l:gap-0 a-items-center space-between',
                  { 'j-content-end': status !== 'Ongoing' }
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
                <p
                  className='color-#1677FF text-14 border-b border-b-#1677FF pb-1 cursor pointer w-fit text-right'
                  onClick={() => handleOpenProductDetail(order, order.id)}
                >
                  View more details
                </p>
              </div>
            </div>
          </div>
        </>
      ))}
    </>
  )
}

export default OrderProgressCard
