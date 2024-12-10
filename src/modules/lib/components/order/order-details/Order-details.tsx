'use client'

import {
  formatNumberAsPrice,
  getStoreNames
} from '@/modules/lib/utility/utility'
import React, { useState } from 'react'
import Image from '../../image/Image'
import { GoArrowLeft } from 'react-icons/go'
import useUserStore from '@/modules/lib/utility/store/user.store'
import { MdKeyboardArrowDown } from 'react-icons/md'
import OrderedProductCard from '../../ordered-product/orderedProductCard'
import OrderProgress from '../order-progress-details/OrderProgressDetails'
import { PiArrowClockwise } from 'react-icons/pi'
import OverlappingImages from '../../overlapping-images/OverlappingImages'
import classNames from 'classnames'

const OrderDetails = ({
  orderCartModal,
  handleOpenProductDetail,
  svgSrc
}: any) => {
  const { user } = useUserStore()
  const [openTotal, setOpenTotal] = useState(false)
  const [openOrderedProducts, setOpenOrderedProducts] = useState(false)

  const handleOrderedProducts = () => {
    setOpenOrderedProducts(prev => !prev)
  }

  const handleOpenTotal = () => {
    setOpenTotal(prev => !prev)
  }


  return (
    <>
      <div className='flex flex-col gap-10'>
        <div
          className='flex a-items-center gap-10 mb-10 cursor-pointer'
          onClick={handleOpenProductDetail}
        >
          <GoArrowLeft className='w-fit' />
          <p className='weight-400 text-16'>Order #{orderCartModal.id}</p>
        </div>
        <div className='bg-white p-25 flex a-items-center space-between'>
          <div className='grid gap-5'>
            <p className='text-18 weight-600'>Hi, {user?.profile.firstName}</p>
            <p className='text-14 color-#00000099'>
              Your order will be confirmed shortly.
            </p>
          </div>
          <div className='bg-whitesmoke p-12 radius-12 w-60 h-60'>
            <Image
              type='icon'
              src={svgSrc}
              alt='placed order icon'
              className='w-fit'
            />
          </div>
        </div>
        <div
          className='bg-white p-25 flex flex-col gap-10 cursor-pointer'
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
                {orderCartModal.delivery.code.split('').map((str: string) => (
                  <p className='w-40 h-40 p-10 radius-5 weight-600 bg-whitesmoke text-center'>
                    {str.toLocaleUpperCase()}
                  </p>
                ))}
              </div>
            </>
          ) : (
            <div className='flex w-100p a-items-center space-between'>
              <p className='text-14 weight-500'>#{orderCartModal.id}</p>

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
        <div>
          <div className='bg-white p-20'>
            <div
              className='flex a-items-center space-between cursor-pointer '
              onClick={handleOpenTotal}
            >
              <p className='text-16 font-inter weight-600'>Order info</p>
              <MdKeyboardArrowDown className='w-fit' />
            </div>
            {openTotal && (
              <div className='grid gap-10 pt-20'>
                <div className='grid gap-15'>
                  <div className='flex space-between'>
                    <p className='color-#000000E0'>Subtotal</p>
                    <p className='text-16'>
                      {formatNumberAsPrice(orderCartModal.cart.subTotal)}
                    </p>
                  </div>
                  <div className='flex space-between border-b border-b-#00000014 pb-10'>
                    <p className='color-#000000E0'>Delivery</p>
                    <p className='text-16'>{formatNumberAsPrice(3900)}</p>
                  </div>
                </div>
                <div className='grid gap-15'>
                  <div className='flex space-between'>
                    <p className='color-#000000E0'>Total</p>
                    <p className='text-16'>
                      {formatNumberAsPrice(orderCartModal.cart.subTotal + 3900)}
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
    </>
  )
}

export default OrderDetails
