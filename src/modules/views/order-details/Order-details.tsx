'use client'

import {
  formatNumberAsPrice,
  getStoreNames
} from '@/modules/lib/utility/utility'
import React, { useEffect, useState } from 'react'
import Image from '../../lib/components/image/Image'
import { GoArrowLeft } from 'react-icons/go'
import useUserStore from '@/modules/lib/utility/store/user.store'
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
import { useOrderView } from '@/modules/lib/utility/hooks/views/use-order-view'

interface OrderDetailsProps {
  orderCartModal?: Order
}

const OrderDetails = ({ orderCartModal }: OrderDetailsProps) => {
  const { user } = useUserStore()
  const router = useRouter()

  // Use product status as the default active tab
  const savedActiveTab =
    typeof window !== 'undefined' ? localStorage.getItem('activeTab') : null
  const defaultTab = orderCartModal?.status || 'ONGOING'

  const [activeTab, setActiveTab] = useState<string>(
    savedActiveTab || defaultTab
  )
  const [showDetails, setShowDetails] = useState(true)

  const { orders } = useOrderView({
    filters: { status: { In: [activeTab] } }
  })

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

  // Sync activeTab with product status when loaded
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

  return (
    <>
      <HomepageNavBar />
      <div className='w-full h-full flex a-items-center flex-col gap-30 mt-150'>
        <OrderHeader setActiveTab={handleTabClick} activeTab={activeTab} />
        <div className='l:w-50p w-90p flex flex-col gap-50'>
          {/* Default "Order Details" View */}
          {showDetails ? (
            <div className='flex a-items-center gap-10 bg-#F5F5F5 p-5 radius-6 j-content-center'>
              {orderCartModal ? (
                <div className='flex flex-col gap-10 w-100p p-10'>
                  <div
                    className='flex a-items-center gap-10 mb-10 cursor-pointer'
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
                        Hi, {user?.profile.firstName}
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

                        <button className='flex gap-10 a-items-center px-10 py-7 radius-5 border border-#00000026 bg-none cursor-pointer'>
                          <PiArrowClockwise className='w-fit' />
                          Buy again
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <OrderProgress orderCartModal={orderCartModal} />
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
