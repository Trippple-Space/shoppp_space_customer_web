import { formatNumberAsPrice } from '@/modules/lib/utility/utility'
import { IoMdClose } from 'react-icons/io'
import Image from '../image/Image'
import { PiArrowClockwise } from 'react-icons/pi'
import { Order } from '../../utility/types/order.interface'
import { CartItem } from '../../utility/types/cart.interface'
import { cartService } from '../../utility/services/cart.service'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '../../utility/hooks/use-cart'

const OrderedProductModal = ({
  handleOrderModal,
  order
}: {
  handleOrderModal: () => void
  order: Order | undefined
}) => {
  const { addToCart } = useCart()

  const router = useRouter()

  const buyAgain = async (cartItems: CartItem[]) => {
    try {
      const currentCart = await cartService.fetchCart()

      const existingCartItemIds = currentCart.cartItems.map(
        (item: CartItem) => item.variant.id
      )

      for (const cartItem of cartItems) {
        if (!existingCartItemIds.includes(cartItem.variant.id)) {
          addToCart(cartItem.variant.id, cartItem.quantity)
        }
      }
      router.push('/checkout')
    } catch (error) {
      console.error('Error processing buy again action:', error)
    }
  }

  useEffect(() => {
    if (order?.id) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [order])

  return (
    <>
      <div className='fixed inset-0 bg-#00000073 z-5 no-scrollbar' />
      {order?.id && (
        <div
          className='fixed t-10 flex inset-0 z-5 j-content-center a-items-center'
          onClick={handleOrderModal}
        >
          <div
            className={`absolute z-10 l-50p g|transform:translate(-50%) z-10 w-90p l:w-40p bg-white overflow-scroll radius-8`}
            onClick={e => e.stopPropagation()}
          >
            <div className='overflow-auto no-scrollbar'>
              <div className='relative'>
                <div className='fixed w-100p bg-white border-b border-b-#00000026 flex a-items-center space-between p-15 radius-t-r-8 radius-t-l-8'>
                  <p className='weight-500'>Order - Products</p>
                  <IoMdClose
                    className='w-fit cursor-pointer'
                    onClick={handleOrderModal}
                  />
                </div>
              </div>
              <div className='p-15 px-25 flex a-items-center space-between border-b border-b-10 border-b-whitesmoke mt-50'>
                <p className='text-14 weight-500'>#{order.id}</p>
                <button
                  className='flex gap-10 a-items-center px-10 py-7 radius-5 border border-#00000026 bg-none cursor-pointer'
                  onClick={() => buyAgain(order.cart.cartItems)}
                >
                  <PiArrowClockwise className='w-fit' />
                  Buy again
                </button>
              </div>
              <div
                className={classNames(
                  'px-25 overflow-auto j-content-center no-scrollbar mb-20 mt-20',
                  {
                    'l:h-33vh': order.cart.cartItems.length > 2,
                    'h-250': order.cart.cartItems.length > 2
                  }
                )}
                key={order.id}
              >
                <div
                  className={classNames(
                    'flex flex-col gap-10 overflow-auto j-content-center no-scrollbar'
                  )}
                >
                  {order.cart.cartItems.map((item: CartItem) => (
                    <>
                      <div
                        className={classNames(
                          'bg-whitesmoke radius-8 p-10 flex flex-col w-full l:flex-row space-between a-items-start'
                        )}
                        key={item.id}
                      >
                        <div className='flex gap-10 l:w-60p'>
                          <Image
                            src={item?.variant.media[0].url}
                            alt={item.variant?.product?.name || ''}
                            className='w-70 h-70 radius-8 object-fit-cover'
                          />
                          <div className='flex flex-col gap-10'>
                            <div className='flex flex-col gap-3'>
                              <p className='weight-600 text-14 w-fit'>
                                {item.variant.product?.name}
                              </p>
                              <p className='color-#0000008C text-12 w-fit'>
                                {item.variant.product?.store.name}
                              </p>
                            </div>
                            <div className='flex flex-col gap-5'>
                              {' '}
                              <p className='color-#0000008C text-14 w-fit'>
                                Size: {item.variant.product?.stockUnit}
                              </p>
                              <p className='color-#0000008C text-14 w-fit'>
                                Color: {item.variant.properties.color}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className='l:grid flex flex-col a-items-end w-100p l:w-fit gap-5 mt-10 l:mt-0'>
                          <p className='text-14 weight-500'>
                            {formatNumberAsPrice(item.totalPrice)}
                          </p>
                          <p className='text-14 text-right'>
                            {' '}
                            X {item.quantity}
                          </p>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </div>
              <div className={classNames('px-25 pb-20 flex flex-col gap-10')}>
                <div className='grid gap-15'>
                  <div className='flex space-between'>
                    <p className='color-#000000E0'>Subtotal</p>
                    <p className='text-16'>
                      {formatNumberAsPrice(order.cart.subTotal)}
                    </p>
                  </div>
                  <div className='flex space-between border-b border-b-#00000014 pb-10'>
                    <p className='color-#000000E0'>Delivery</p>
                    <p className='text-16'>
                      {formatNumberAsPrice(order.deliveryFee)}
                    </p>
                  </div>
                </div>
                <div className='grid gap-15'>
                  <div className='flex space-between'>
                    <p className='color-#000000E0'>Total</p>
                    <p className='text-16'>
                      {formatNumberAsPrice(order.totalAmount)}
                    </p>
                  </div>
                  <div className='flex space-between'>
                    <p className='color-#000000E0'>Payment Method</p>
                    <p className='text-16'>Pay online</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default OrderedProductModal
