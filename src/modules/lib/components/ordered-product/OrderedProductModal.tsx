import { checkMediaType, ellipseText, formatNumberAsPrice, getCartItems } from '@/modules/lib/utility/utility'
import { IoMdClose } from 'react-icons/io'
import Image from '../image/Image'
import { PiArrowClockwise } from 'react-icons/pi'
import { Order } from '../../utility/types/order.interface'
import { BuyAgain, CartItem } from '../../utility/types/cart.interface'
import { cartService } from '../../utility/services/cart.service'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useCart } from '../../utility/hooks/use-cart'
import PuffLoader from '../puff-loader/PuffLoader'
import VideoSrc from '../video-src/VideoSrc'


const OrderedProductModal = ({
  handleOrderModal,
  order
}: {
  handleOrderModal: () => void
  order: Order | undefined
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null) // Tracks which text is expanded
  const { buyAgain, fetching } = useCart()

  const handleTextClick = (id: string) => {
    setExpandedId(prevId => (prevId === id ? null : id))
  }

  const cartItems = getCartItems(order?.cart?.storeGroups || [])

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
    handleOrderModal()
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
            className={`absolute z-10 l-50p g|transform:translate(-50%) z-10 w-80p l:w-40p bg-white no-scrollbar overflow-auto radius-8 g|max-height:90vh l:h-fit`}
            onClick={e => e.stopPropagation()}
          >
            <div className='overflow-auto no-scrollbar '>
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
                  className='flex gap-10 a-items-center px-10 py-7 radius-5 border border-#00000026 bg-none cursor-pointer weight-500'
                  onClick={() => buyOrdersAgain(cartItems)}
                >
                  <PiArrowClockwise className='w-fit' />
                  Buy again
                </button>
              </div>
              <div
                className={classNames(
                  'px-25 overflow-auto j-content-center no-scrollbar mb-20 mt-20',
                  {
                    'l:h-33vh': cartItems.length > 2,
                    'h-250': cartItems.length > 2
                  }
                )}
                key={order.id}
              >
                <div
                  className={classNames(
                    'flex flex-col gap-10 overflow-auto j-content-center no-scrollbar'
                  )}
                >
                  {cartItems.map((item: CartItem, i) => {
                    const mediaType = checkMediaType(item?.variant.media[0].url) ?? 'image';

                    return (
                      <div

                        className={classNames(
                          'bg-whitesmoke radius-8 p-10 gap-5 flex flex-col  l:flex-row space-between a-items-start'
                        )}
                        key={i}
                      >
                        <div className='flex gap-10 l:w-60p'>
                          {
                            mediaType === 'image' ?
                              <Image
                                src={item?.variant.media[0].url}
                                alt={item.variant?.product?.name || ''}
                                className='w-80 h-80 xl:w-70 xl:h-70 radius-8 object-fit-cover'
                              />
                              :
                              <VideoSrc
                                className='w-80 h-80 xl:w-70 xl:h-70 radius-8 object-fit-cover'
                                src={item?.variant.media[0].url}
                              />
                          }
                          <div className='flex flex-col gap-6'>
                            <div className='flex flex-col gap-3'>
                              <div
                                className='weight-600 text-12 xl:w-10 xl:white-space-nowrap text-overflow-ellipsis'
                                onClick={() => handleTextClick(item.id)}
                              >
                                {ellipseText(
                                  item.variant.product?.name ?? '',
                                  expandedId === item.id,
                                  30
                                )}
                              </div>
                              <p className='color-#0000008C text-10 w-fit'>
                                {item.variant.product?.store.name}
                              </p>
                            </div>
                            <div className='flex flex-col gap-5'>
                              {' '}
                              {item?.variant?.size ?
                                <p className='color-#0000008C text-12 w-fit'>
                                  Size: {item?.variant?.size}
                                </p>
                                : null
                              }
                              <p className='color-#0000008C text-12 w-fit'>
                                Color: {item.variant.properties.color}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className='l:grid flex flex-col a-items-end w-100p l:w-fit gap-5 mt-10 l:mt-0'>
                          <p className='text-14 weight-500'>
                            {formatNumberAsPrice(item.totalPrice)}
                          </p>
                          <p className='text-12 weight-600 color-#0000008C text-right'>
                            {' '}
                            X {item.quantity}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className={classNames('px-25 pb-20 flex flex-col gap-10')}>
                <div className='grid gap-15'>
                  <div className='flex space-between'>
                    <p className='color-#000000E0 weight-400'>Subtotal</p>
                    <p className='text-16 weight-400'>
                      {formatNumberAsPrice(order.cart?.subTotal)}
                    </p>
                  </div>
                  {order.cart?.totalDiscountValue ?
                    <div className='flex space-between'>
                      <p className='color-#000000E0 weight-400'>Discount</p>
                      <p className='text-16 weight-400'>
                        − {formatNumberAsPrice(order.cart?.totalDiscountValue)}
                      </p>
                    </div>
                    : null
                  }
                  <div className='flex space-between border-b border-b-#00000014 pb-10'>
                    <p className='color-#000000E0 weight-400'>Delivery</p>
                    <p className='text-16 weight-400'>
                      {formatNumberAsPrice(order.deliveryFee)}
                    </p>
                  </div>
                </div>
                <div className='grid gap-15'>
                  <div className='flex space-between'>
                    <p className='color-#000000E0  weight-400'>Total</p>
                    <p className='text-16 weight-400'>
                      {formatNumberAsPrice(order.totalAmount)}
                    </p>
                  </div>
                  <div className='flex space-between'>
                    <p className='color-#000000E0 weight-400'>Payment Method</p>
                    <p className='text-16 weight-400'>Paid online</p>
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