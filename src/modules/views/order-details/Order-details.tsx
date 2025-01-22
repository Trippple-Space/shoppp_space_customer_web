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
import { useRouter } from 'next/navigation'
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar'
import OrderHeader from '@/modules/lib/components/order/OrderHeader'
import CancelledOrder from '../../lib/components/order/CancelledOrder'
import DeliveredOrder from '../../lib/components/order/DeliveredOrder'
import OngoingOrder from '../../lib/components/order/OngoingOrder'
import { CartItem } from '@/modules/lib/utility/types/cart.interface'
import Link from 'next/link'
import { useCart } from '@/modules/lib/utility/hooks/use-cart'
import { cartService } from '@/modules/lib/utility/services/cart.service'

interface OrderDetailsProps {
  orderCartModal?: Order
}

const OrderDetails = ({ orderCartModal }: OrderDetailsProps) => {
  const { addToCart } = useCart()

  const router = useRouter()

  const savedActiveTab =
    typeof window !== 'undefined' ? localStorage.getItem('activeTab') : null

  const defaultTab = orderCartModal?.status || 'ONGOING'

  const [activeTab, setActiveTab] = useState<string>(
    savedActiveTab || defaultTab
  )
  const [showDetails, setShowDetails] = useState(true)

  const getOrderImage = (status?: string) => {
    switch (status) {
      case 'ONGOING':
        return 'order-placed.svg'
      case 'CONFIRMED':
        return 'order-delivered.svg'
      default:
        return 'order-cancelled.svg'
    }
  }

  const [openTotal, setOpenTotal] = useState(false)
  const [openOrderedProducts, setOpenOrderedProducts] = useState(false)

  useEffect(() => {
    if (orderCartModal?.status) {
      setActiveTab(orderCartModal.status)
      localStorage.setItem('activeTab', orderCartModal.status)
    }
  }, [orderCartModal?.status])

  const handleOrderedProducts = () => {
    setOpenOrderedProducts(prev => !prev)
  }

  const handleOpenTotal = () => {
    setOpenTotal(prev => !prev)
  }

  const handleTabClick = (tab: string) => {
    router.push('/orders')
    setActiveTab(tab)
    setShowDetails(false)

    if (typeof window !== 'undefined') {
      localStorage.setItem('activeTab', tab)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ONGOING':
        return <OngoingOrder />
      case 'CONFIRMED':
        return <DeliveredOrder />
      case 'CANCELLED':
        return <CancelledOrder />
      default:
        return null
    }
  }

  useEffect(() => {
    setShowDetails(true)
  }, [orderCartModal])

  const buyAgain = async (cartItems: CartItem[]) => {
    await cartService.buyCartItemAgain(cartItems)
  }

  return (
    <>
      <div>
        <HomepageNavBar parent={'orders'} />
      </div>
      <div className='mt-120 w-full h-full flex a-items-center flex-col gap-30'>
        <div className='flex  a-items-center gap-5 l:w-50p w-90p'>
          <GoHome className='w-fit color-#00000066 w-15 h-15' />
          <Link href='/home' className='text-14 color-#00000066'>
            Home /
          </Link>
          <span className='text-14 weight-400'>Orders</span>
        </div>
        <OrderHeader setActiveTab={handleTabClick} activeTab={activeTab} />
        <div className='l:w-50p w-90p flex flex-col gap-50 pb-32'>
          {/* Default "Order Details" View */}
          {showDetails ? (
            <div className='flex a-items-center gap-10 bg-#F5F5F5 p-5 radius-6 j-content-center'>
              {orderCartModal ? (
                <div className='flex flex-col gap-10 w-100p p-10'>
                  <div
                    className='flex a-items-center gap-10 mb-10 cursor-pointer w-fit'
                    onClick={() => router.push('/orders')}
                  >
                    <GoArrowLeft className='w-fit' />
                    <p className='weight-400 text-16'>
                      Order #{orderCartModal.id}
                    </p>
                  </div>
                  <div className='bg-white p-25 flex a-items-center space-between'>
                    <div className='grid gap-5'>
                      <p className='text-18 weight-600'>
                        Hi, {orderCartModal.user.profile.firstName}
                      </p>
                      <p className='text-14 color-#00000099'>
                        Your order will be confirmed shortly.
                      </p>
                    </div>
                    <div className='bg-whitesmoke p-12 radius-12 w-60 h-60'>
                      <Image
                        type='icon'
                        src={getOrderImage(orderCartModal?.status) || ''}
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
                        <p className='color-#00000099 text-12 overflow-hidden text-ellipsis l:overflow'>
                          Order from:{' '}
                          <span className='weight-600 color-#000000E0 '>
                            {getStoreNames(orderCartModal.cart.cartItems)}
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
                            <OverlappingImages orderItem={orderCartModal} />
                          </div>

                          <MdKeyboardArrowDown className='w-25 h-25 ml-5' />
                        </div>
                      </div>
                    </div>
                    {openOrderedProducts && (
                      <OrderedProductCard orderedProducts={orderCartModal} />
                    )}
                  </div>
                  <div className='p-20 flex flex-col l:flex-row gap-15 l:gap-0 l:a-items-center space-between bg-white'>
                    {orderCartModal.status === 'ONGOING' ? (
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
                          {orderCartModal.delivery.code
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
                          #{orderCartModal.id}
                        </p>

                        <button
                          className='flex gap-10 a-items-center px-10 py-7 radius-5 border border-#00000026 bg-none cursor-pointer'
                          onClick={() =>
                            buyAgain(orderCartModal.cart.cartItems)
                          }
                        >
                          <PiArrowClockwise className='w-fit' />
                          Buy again
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <OrderProgress orderCartModal={orderCartModal} />
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
                              <p className='color-#000000E0'>Subtotal</p>
                              <p className='text-16'>
                                {formatNumberAsPrice(
                                  orderCartModal.cart.subTotal
                                )}
                              </p>
                            </div>
                            <div className='flex space-between border-b border-b-#00000014 pb-10'>
                              <p className='color-#000000E0'>Delivery</p>
                              <p className='text-16'>
                                {formatNumberAsPrice(
                                  orderCartModal.deliveryFee
                                )}
                              </p>
                            </div>
                          </div>
                          <div className='grid gap-15'>
                            <div className='flex space-between'>
                              <p className='color-#000000E0'>Total</p>
                              <p className='text-16'>
                                {formatNumberAsPrice(
                                  orderCartModal.totalAmount
                                )}
                              </p>
                            </div>
                            <div className='flex space-between'>
                              <p className='color-#000000E0'>Payment Method</p>
                              <p className='text-16'>Pay online</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                'Loading...'
              )}
            </div>
          ) : (
            renderTabContent()
          )}
        </div>
      </div>
    </>
  )
}

export default OrderDetails
