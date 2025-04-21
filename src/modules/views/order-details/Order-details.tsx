'use client'

import {
  formatNumberAsPrice,
  getStoreNames
} from '@/modules/lib/utility/utility'
import React, { useEffect, useState } from 'react'
import Image from '../../lib/components/image/Image'
import { GoArrowLeft, GoHome } from 'react-icons/go'
import { MdKeyboardArrowDown } from 'react-icons/md'
import OrderedProductCard from '../../lib/components/ordered-product/orderedProductCard'
import OrderProgress from '../../lib/components/order/order-progress-details/OrderProgressDetails'
import { PiArrowClockwise } from 'react-icons/pi'
import OverlappingImages from '../../lib/components/overlapping-images/OverlappingImages'
import classNames from 'classnames'
import { Order } from '@/modules/lib/utility/types/order.interface'
import { useRouter, useSearchParams } from 'next/navigation'
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar'
import OrderHeader from '@/modules/lib/components/order/OrderHeader'
import { CartItem } from '@/modules/lib/utility/types/cart.interface'
import Link from 'next/link'
import { cartService } from '@/modules/lib/utility/services/cart.service'
import { orderService } from '@/modules/lib/utility/services/order.service'
import OrderTabContent from '@/modules/lib/components/order/OrderTabContent'
import PuffLoader from '@/modules/lib/components/puff-loader/PuffLoader'
import { useOrders } from '@/modules/lib/utility/hooks/use-orders'

interface OrderDetailsProps {
  orderId: number
}

const OrderDetails = ({ orderId }: OrderDetailsProps) => {
  const { fetchOrderById, singleOrder } = useOrders({})
   const router = useRouter()

  useEffect(() => {
    fetchOrderById(orderId, {})
    
  }, [])
  
  const [showDetails, setShowDetails] = useState(true)

  const getOrderImage = (status?: string) => {
    const statusImageMap: Record<string, string> = {
      ONGOING: 'order-placed.svg',
      PENDING_CONFIRMATION: 'pending-confirmation.svg',
      CONFIRMED: 'waiting-to-be-shipped.svg',
      ACKNOWLEDGED: 'waiting-to-be-shipped.svg',
      WAITING_TO_BE_SHIPPED: 'waiting-to-be-shipped.svg',
      OUT_FOR_DELIVERY: 'out-for-delivery.svg',
      DELIVERED: 'order-delivered.svg',
    };
    return statusImageMap[status || ''] || 'order-cancelled.svg';
  };

  const orderReturnMessage = (status: string) => {
    const statusMessageMap: Record<string, string> = {
      ONGOING: 'Your order is being processed. Please wait for confirmation.',
      PENDING_CONFIRMATION: 'Your order is awaiting confirmation. We will notify you soon.',
      CONFIRMED: 'Your order has been confirmed. Thank you for shopping with Asoebi!',
      ACKNOWLEDGED: 'We have acknowledged your order. It is being prepared.',
      WAITING_TO_BE_SHIPPED: 'Your order is ready and waiting to be shipped.',
      OUT_FOR_DELIVERY: 'Your order is on its way. It will reach you soon!',
      DELIVERED: 'Your order has been successfully delivered. Enjoy!',
    };
    return statusMessageMap[status] || 'Unknown order status. Please contact support for more details.';
  };

  const [openTotal, setOpenTotal] = useState(false)
  const [openOrderedProducts, setOpenOrderedProducts] = useState(false)


  const handleOrderedProducts = () => {
    setOpenOrderedProducts(prev => !prev)
  }

  const handleOpenTotal = () => {
    setOpenTotal(prev => !prev)
  }


  useEffect(() => {
    setShowDetails(true)
  }, [singleOrder])

  const buyAgain = async (cartItems: CartItem[]) => {
    await cartService.buyCartItemAgain(cartItems)
  }
        const isOngoing = singleOrder?.status !== 'CANCELLED' && singleOrder?.status !== 'DELIVERED' && singleOrder?.status !== 'RETURNED'
  
  return (
    <>
      <div>
        <HomepageNavBar parent={'orders'} />
      </div>
      <div className='mt-120 w-full h-full flex a-items-center flex-col gap-30'>
        <div className='flex  a-items-center gap-5 l:w-50p w-90p'>
          <GoHome className='w-fit color-#00000066 w-15 h-15' />
          <Link href='/home' className='text-14 weight-400 color-#00000066'>
            Home /
          </Link>
          <span className='text-14 weight-400'>Orders</span>
        </div>
        <OrderHeader orderStatus={isOngoing ? "ONGOING" : singleOrder?.status} />
        <div className='l:w-50p w-90p flex flex-col gap-50 pb-32'>
          {/* Default "Order Details" View */}
          {showDetails ? (
            <>
              {singleOrder ? (
                <div className='flex a-items-center gap-10 bg-#F5F5F5 p-5 radius-6 j-content-center'>
                  <div className='flex flex-col gap-10 w-100p p-10'>
                    <div
                      onClick={() => router.back()}
                      className='flex a-items-center gap-10 mb-10 cursor-pointer w-fit weight-400 text-16'
                    >
                      <GoArrowLeft className='w-fit' />
                      <p className='weight-400 text-16'>
                        Order #{singleOrder.id}
                      </p>
                    </div>
                    <div className='bg-white p-25 flex a-items-center space-between'>
                      <div className='grid gap-5'>
                        <p className='text-18 weight-600'>
                          Hi, {singleOrder.user.profile.firstName}
                        </p>
                        <p className='text-14 weight-400 color-#00000099'>
                         {orderReturnMessage(singleOrder.status)}
                        </p>
                      </div>
                      <div className='bg-whitesmoke p-12 radius-12 w-60 h-60'>
                        <Image
                          type='icon'
                          src={getOrderImage(singleOrder?.status) || ''}
                          alt='placed order icon'
                          className='w-fit'
                        />
                      </div>
                    </div>
                    <div
                      className='bg-white p-25 flex flex-col gap-25 cursor-pointer'
                      onClick={handleOrderedProducts}
                    >
                      <div className='flex a-items-center space-between'>
                        <div className='whitespace-nowrap w-90p l:w-fit'>
                          <p className='color-#00000099 text-12 weight-400 overflow-hidden text-ellipsis l:overflow'>
                            Order from:{' '}
                            <span className='weight-500 color-#000000E0 text-14 font-inter'>
                              {getStoreNames(singleOrder.cart.cartItems)}
                            </span>
                          </p>
                        </div>
                        <div>
                          <div className='flex a-items-center j-content-center'>
                            <div
                              className={classNames(
                                'text-12 hidden l:block relative',
                                {}
                              )}
                            >
                              <OverlappingImages orderItem={singleOrder} />
                            </div>

                            <MdKeyboardArrowDown className='w-25 h-25 ml-5' />
                          </div>
                        </div>
                      </div>
                      {openOrderedProducts && (
                        <OrderedProductCard orderedProducts={singleOrder} />
                      )}
                    </div>
                    <div className='p-20 flex flex-col l:flex-row gap-15 l:gap-0 l:a-items-center space-between bg-white'>
                      {isOngoing ? (
                        <>
                          <div className='flex flex-col gap-5'>
                            <p className='color-#00000099 text-14'>
                              Delivery confirmation code
                            </p>
                            <p className='text-14 weight-600'>
                              Share this code with your rider
                            </p>
                          </div>
                          <div className='flex gap-10'>
                            {singleOrder.delivery.code
                              .split('')
                              .map((str: string) => (
                                <p
                                  key={str}
                                  className='w-40 h-40 p-10 radius-5 weight-600 bg-whitesmoke text-center'
                                >
                                  {str.toLocaleUpperCase()}
                                </p>
                              ))}
                          </div>
                        </>
                      ) : (
                        <div className='flex w-100p a-items-center space-between'>
                          <p className='text-14 weight-500'>
                            #{singleOrder.id}
                          </p>

                          <button
                            className='flex gap-10 a-items-center px-10 py-7 radius-5 border border-#00000026 bg-none cursor-pointer'
                            onClick={() =>
                              buyAgain(singleOrder.cart.cartItems)
                            }
                          >
                            <PiArrowClockwise className='w-fit' />
                            Buy again
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <OrderProgress singleOrder={singleOrder} />
                    </div>
                    <div>
                      <div className='bg-white p-20'>
                        <div
                          className='flex a-items-center space-between cursor-pointer '
                          onClick={handleOpenTotal}
                        >
                          <p className='text-16 font-inter weight-600'>
                            Order info
                          </p>
                          <MdKeyboardArrowDown className='w-fit' />
                        </div>
                        {openTotal && (
                          <div className='grid gap-10 pt-20'>
                            <div className='grid gap-15'>
                              <div className='flex space-between'>
                                <p className='color-#000000E0 weight-400'>
                                  Subtotal
                                </p>
                                <p className='text-16'>
                                  {formatNumberAsPrice(
                                    singleOrder.cart.subTotal
                                  )}
                                </p>
                              </div>
                              <div className='flex space-between border-b border-b-#00000014 pb-10'>
                                <p className='color-#000000E0 weight-400'>
                                  Delivery
                                </p>
                                <p className='text-16 weight-400'>
                                  {formatNumberAsPrice(
                                    singleOrder.deliveryFee
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className='grid gap-15'>
                              <div className='flex space-between'>
                                <p className='color-#000000E0 weight-400'>
                                  Total
                                </p>
                                <p className='text-16 weight-400'>
                                  {formatNumberAsPrice(
                                    singleOrder.totalAmount
                                  )}
                                </p>
                              </div>
                              <div className='flex space-between'>
                                <p className='color-#000000E0 weight-400'>
                                  Payment Method
                                </p>
                                <p className='text-16 weight-400'>Pay online</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='relative w-100p h-250'>
                  <div className='h-100p absolute flex a-items-center  l-50p g|transform:translate(-50%) b-0'>
                    <PuffLoader />
                  </div>
                </div>
              )}
            </>
          ) : (
            <OrderTabContent status={singleOrder?.status} />
          )}
        </div>
      </div>
    </>
  )
}

export default OrderDetails
