import { Order } from '@/modules/lib/utility/types/order.interface'
import {
  formatDate,
  formatNumberAsPrice,
  formatTime,
  parseApiInstant,
  getCartItems,
  getLastFiveIdChars,
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
              <div className='p-[20px] flex flex-col gap-[20px]'>
                <div className='flex flex-col gap-[10px]'>
                  <div className='flex justify-between items-center'>
                    <div className='whitespace-nowrap w-1/2 lg:w-fit'>
                      <p className='text-[#00000099] font-normal text-[12px] overflow-hidden text-ellipsis lg:overflow font-inter'>
                        Order from:{' '}
                        <span className='text-[14px] font-medium text-[#000000E0] '>
                          {getStoreNames(order?.cart?.storeGroups)}
                        </span>
                      </p>
                    </div>
                    <p
                      className={classNames(
                        'text-[12px] px-[10px] py-[5px] text-white rounded-[4px] font-inter',
                        {
                          'bg-[#1677FF]': isOngoing,
                          'bg-[#0357EE]':
                            order.status == 'DELIVERED',
                          'bg-[#00000099]':
                            order.status == 'CANCELLED'
                        }
                      )}
                    >
                      {isOngoing ? 'ONGOING' : order.status}
                    </p>
                  </div>
                  <div
                    className={classNames('flex items-center justify-between', {
                      'ml-[45px]': cartItems?.length > 4,
                      'ml-[80px]': cartItems?.length === 4,
                      'ml-[70px]': cartItems?.length === 3,
                      'ml-[55px]': cartItems?.length === 2,
                      'ml-[40px]': cartItems?.length === 1
                    })}
                  >

                    <div
                      className={classNames(
                        'text-[12px] flex items-center cursor-pointer h-full'
                      )}
                      onClick={() => handleOpenOrderProductDetail(order)}
                    >
                      <div className={classNames('relative', {})}>
                        <OverlappingImages orderItem={order} />
                      </div>
                      <MdKeyboardArrowRight className='w-[20px] h-[20px] ml-[5px]' />
                    </div>

                    <div className='flex flex-col gap-[10px]'>
                      <p className='text-[12px] font-normal text-[#00000099] text-right'>
                        Total Amount
                      </p>
                      <p className='text-black text-right font-semibold'>
                        {formatNumberAsPrice(order?.totalDiscountPrice || order?.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='lg:flex grid gap-[10px] lg:gap-0 items-center justify-between border-b border-t border-t-[#00000014] border-b-[#00000014]  py-[15px]'>
                  <p className='text-[14px] font-normal text-[#00000099]'>
                    {formatDate(parseApiInstant(order?.createdAt || order?.delivery?.deliveryWindowStart))}
                  </p>
                  <p className='text-[14px] font-normal text-[#00000099]'>#{getLastFiveIdChars(order.id)}</p>
                </div>

                {isOngoing && (
                  <>
                    <div className='flex flex-col gap-[10px] lg:flex-row lg:items-center lg:justify-between'>
                      <p className='text-[14px] font-normal flex items-center'>
                        <span>Share this code with your rider</span>
                      </p>
                      <div className='flex items-center gap-[10px]'>
                        {order.delivery.code.split('').map((str, i) => (
                          <p
                            className='h-[40px] w-[40px] rounded-[5px] font-semibold bg-[#F5F5F5] text-center flex items-center justify-center text-[16px]'
                            key={i}
                          >
                            {str.toLocaleUpperCase()}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className='flex gap-[10px] items-center'>
                      {onGoingOrderStatus.map((status, index) =>
                        <div key={index} className={`p-[5px] rounded-[10px] w-[20%] h-[5px] ${index <= statusIndex ? 'bg-[#0357EE]' : 'bg-[#F5F5F5]'}`}></div>)}
                    </div>
                  </>
                )}
                <div
                  className={classNames(
                    'lg:flex flex-row gap-[6px] lg:gap-0 items-center lg:justify-between',
                    { 'justify-end': isOngoing }
                  )}
                >
                  {isOngoing && (
                    <p className='text-[#00000099] text-[14px] font-normal mb-[8px] lg:mb-0'>
                      {formatTime(
                        order?.updatedAt || order?.createdAt || ''
                      ).toLocaleLowerCase()}{' '}
                      - {getStatusText(order.status)}
                    </p>
                  )}
                  <Link
                    href={`/orders/${order.id}`}
                    className='text-[#1677FF] text-[14px] font-normal border-b border-b-[#1677FF] pb-[1px] cursor-pointer w-fit text-right'
                  >
                    View more details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )
      })}
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
