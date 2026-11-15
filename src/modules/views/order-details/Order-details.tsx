'use client'

import {
  formatNumberAsPrice,
  getActiveOrderCartLines,
  getLastFiveIdChars,
  getStoreNames
} from '@/modules/lib/utility/utility'
import React, { useEffect, useMemo, useState } from 'react'
import Image from '../../lib/components/image/Image'
import { GoArrowLeft, GoHome } from 'react-icons/go'
import { MdKeyboardArrowDown } from 'react-icons/md'
import OrderedProductCard from '../../lib/components/ordered-product/orderedProductCard'
import OrderProgress from '../../lib/components/order/order-progress-details/OrderProgressDetails'
import { PiArrowClockwise } from 'react-icons/pi'
import OverlappingImages from '../../lib/components/overlapping-images/OverlappingImages'
import classNames from 'classnames'
import { useRouter } from 'next/navigation'
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar'
import OrderHeader from '@/modules/lib/components/order/OrderHeader'
import { BuyAgain, CartItem } from '@/modules/lib/utility/types/cart.interface'
import Link from 'next/link'
import OrderTabContent from '@/modules/lib/components/order/OrderTabContent'
import PuffLoader from '@/modules/lib/components/puff-loader/PuffLoader'
import { useOrders } from '@/modules/lib/utility/hooks/use-orders'
import { useCart } from '@/modules/lib/utility/hooks/use-cart'
import {
  getOrderLevelDiscountTotalFromCart,
  hasOrderLevelDiscountInCart,
  sumOrderCartPayableTotal,
  sumOrderCartReferenceSubtotal,
} from '@/modules/lib/utility/visible-discount'

interface OrderDetailsProps {
  orderId: string
}

const OrderDetails = ({ orderId }: OrderDetailsProps) => {
  const { fetchOrderById, singleOrder } = useOrders({})
  const { buyAgain } = useCart()
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
      CONFIRMED: 'Your order has been confirmed. Thank you for shopping with Shoppp!',
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

  const buyOrdersAgain = async (cartItems: CartItem[]) => {
    const buyAgainItems: BuyAgain[] = []
    cartItems.map((cartItem) => {
      const data = {
        variantId: cartItem.variant.id,
        quantity: cartItem.quantity
      }
      buyAgainItems.push(data)
    })
    buyAgain(buyAgainItems)
  }
  const isOngoing = singleOrder?.status !== 'CANCELLED' && singleOrder?.status !== 'DELIVERED' && singleOrder?.status !== 'RETURNED'

  const orderCartItems = useMemo(
    () => (singleOrder ? getActiveOrderCartLines(singleOrder) : []),
    [singleOrder]
  )

  const hasRemovedLines = useMemo(
    () =>
      singleOrder?.orderItems?.some((line) => line.status === 'REMOVED') ??
      false,
    [singleOrder?.orderItems]
  )

  const hasOrderDiscount = useMemo(
    () => hasOrderLevelDiscountInCart(singleOrder?.cart),
    [singleOrder?.cart]
  )

  const orderDisplaySubtotal = useMemo(
    () =>
      hasOrderDiscount
        ? sumOrderCartReferenceSubtotal(orderCartItems)
        : sumOrderCartPayableTotal(orderCartItems),
    [hasOrderDiscount, orderCartItems]
  )

  const orderDisplayDiscount = useMemo(
    () =>
      hasOrderDiscount
        ? getOrderLevelDiscountTotalFromCart(singleOrder?.cart)
        : 0,
    [hasOrderDiscount, singleOrder?.cart]
  )

  return (
    <>
      <div>
        <HomepageNavBar parent={'orders'} />
      </div>
      <div className='mt-[120px] w-full h-full flex items-center flex-col gap-[30px]'>
        <div className='flex  items-center gap-[5px] lg:w-1/2 w-[90%]'>
          <GoHome className='w-fit text-[#00000066] w-[15px] h-[15px]' />
          <Link href='/home' className='text-[14px] font-normal text-[#00000066]'>
            Home /
          </Link>
          <span className='text-[14px] font-normal'>Orders</span>
        </div>
        <OrderHeader orderStatus={isOngoing ? "ONGOING" : singleOrder?.status} />
        <div className='lg:w-1/2 w-[90%] flex flex-col gap-[50px] pb-[32px]'>
          {/* Default "Order Details" View */}
          {showDetails ? (
            <>
              {singleOrder ? (
                <div className='flex items-center gap-[10px] bg-[#F5F5F5] p-[5px] rounded-[6px] justify-center'>
                  <div className='flex flex-col gap-[10px] w-full p-[10px]'>
                    <div
                      onClick={() => router.back()}
                      className='flex items-center gap-[10px] mb-[10px] cursor-pointer w-fit font-normal text-[16px]'
                    >
                      <GoArrowLeft className='w-fit' />
                      <p className='font-normal text-[16px]'>
                        Order #{getLastFiveIdChars(singleOrder.id)}
                      </p>
                    </div>
                    <div className='bg-white p-[25px] flex items-center justify-between'>
                      <div className='grid gap-[5px]'>
                        <p className='text-[18px] font-semibold'>
                          Hi, {singleOrder.user.profile.firstName}
                        </p>
                        <p className='text-[14px] font-normal text-[#00000099]'>
                          {orderReturnMessage(singleOrder.status)}
                        </p>
                        {hasRemovedLines && singleOrder.status !== 'CANCELLED' && (
                          <p className='text-[13px] font-normal text-[#00000099] mt-[4px]'>
                            Some items were removed because a seller did not
                            acknowledge them in time. Remaining items may still
                            be processed.
                          </p>
                        )}
                      </div>
                      <div className='bg-[#F5F5F5] p-[12px] rounded-[12px] w-[60px] h-[60px] flex flex-col justify-center items-center'>
                        <Image
                          type='icon'
                          src={getOrderImage(singleOrder?.status) || ''}
                          alt='placed order icon'
                          className='!w-fit'
                          width={50}
                          height={50}
                        />
                      </div>
                    </div>
                    <div
                      className='bg-white p-[25px] flex flex-col gap-[25px] cursor-pointer'
                      onClick={handleOrderedProducts}
                    >
                      <div className='flex items-center justify-between'>
                        <div className='whitespace-nowrap w-[90%] lg:w-fit'>
                          <p className='text-[#00000099] text-[12px] font-normal overflow-hidden text-ellipsis lg:overflow'>
                            Order from:{' '}
                            <span className='font-medium text-[#000000E0] text-[14px] font-inter'>
                              {getStoreNames(singleOrder.cart.storeGroups)}
                            </span>
                          </p>
                        </div>
                        <div>
                          <div className='flex items-center justify-center'>
                            <div
                              className={classNames(
                                'text-[12px] hidden lg:block relative',
                                {}
                              )}
                            >
                              <OverlappingImages orderItem={singleOrder} />
                            </div>

                            <MdKeyboardArrowDown className='w-[25px] h-[25px] ml-[5px]' />
                          </div>
                        </div>
                      </div>
                      {openOrderedProducts && (
                        <OrderedProductCard orderedProducts={singleOrder} />
                      )}
                    </div>
                    <div className='p-[20px] flex flex-col lg:flex-row gap-[15px] lg:gap-0 lg:items-center justify-between bg-white'>
                      {isOngoing ? (
                        <>
                          <div className='flex flex-col gap-[5px]'>
                            <p className='text-[#00000099] text-[14px]'>
                              Delivery confirmation code
                            </p>
                            <p className='text-[14px] font-semibold'>
                              Share this code with your rider
                            </p>
                          </div>
                          <div className='flex gap-[10px]'>
                            {singleOrder.delivery.code
                              .split('')
                              .map((str: string, i) => (
                                <p
                                  key={i}
                                  className='w-[40px] h-[40px] p-[10px] rounded-[5px] font-semibold bg-[#F5F5F5] text-center'
                                >
                                  {str.toLocaleUpperCase()}
                                </p>
                              ))}
                          </div>
                        </>
                      ) : (
                        <div className='flex w-full items-center justify-between'>
                          <p className='text-[14px] font-medium'>
                            #{singleOrder.id.slice(-5)}
                          </p>

                          <button
                            className='flex gap-[10px] items-center px-[10px] py-[7px] rounded-[5px] border border-[#00000026] bg-transparent cursor-pointer'
                            onClick={() =>
                              buyOrdersAgain(getActiveOrderCartLines(singleOrder))
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
                      <div className='bg-white p-[20px]'>
                        <div
                          className='flex items-center justify-between cursor-pointer '
                          onClick={handleOpenTotal}
                        >
                          <p className='text-[16px] font-inter font-semibold'>
                            Order info
                          </p>
                          <MdKeyboardArrowDown className='w-fit' />
                        </div>
                        {openTotal && (
                          <div className='grid gap-[10px] pt-[20px]'>
                            <div className='grid gap-[15px]'>
                              <div className='flex justify-between'>
                                <p className='text-[#000000E0] font-normal'>
                                  Subtotal
                                </p>
                                <p className='text-[16px]'>
                                  {formatNumberAsPrice(orderDisplaySubtotal)}
                                </p>
                              </div>
                              {orderDisplayDiscount > 0 ? (
                                <div className='flex justify-between'>
                                  <p className='text-[#000000E0] font-normal'>
                                    Discount
                                  </p>
                                  <p className='text-[16px]'>
                                    −{' '}
                                    {formatNumberAsPrice(orderDisplayDiscount)}
                                  </p>
                                </div>
                              ) : null}
                              <div className='flex justify-between border-b border-b-[#00000014] pb-[10px]'>
                                <p className='text-[#000000E0] font-normal'>
                                  Delivery
                                </p>
                                <p className='text-[16px] font-normal'>
                                  {formatNumberAsPrice(
                                    singleOrder.deliveryFee
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className='grid gap-[15px]'>
                              <div className='flex justify-between'>
                                <p className='text-[#000000E0] font-normal'>
                                  Total
                                </p>
                                <p className='text-[16px] font-normal'>
                                  {formatNumberAsPrice(
                                    singleOrder.totalAmount
                                  )}
                                </p>
                              </div>
                              <div className='flex justify-between'>
                                <p className='text-[#000000E0] font-normal'>
                                  Payment Method
                                </p>
                                <p className='text-[16px] font-normal'>Paid online</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='relative w-full h-[250px]'>
                  <div className='h-full absolute flex items-center  left-[50%] [transform:translate(-50%)] bottom-0'>
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
