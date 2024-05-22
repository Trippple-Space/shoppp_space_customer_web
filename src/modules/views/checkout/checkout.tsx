"use client"
import Icon from '@/modules/lib/components/icon/Icon'
import Image from '@/modules/lib/components/image/Image'
import React, { useState } from 'react'
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar';
import { useRouter } from 'next/navigation';
import Footer from '@/modules/lib/components/footer/Footer';
import useUserStore from '@/modules/lib/utility/store/user.store';
import { useCart } from '@/modules/lib/utility/hooks/use-cart';
import { getCartItemVariantPropertiesAsJsx } from '@/modules/lib/components/minicart/minicart.helper';
import { useSignOut } from '@/modules/lib/utility/hooks/use-sign-out';
import useAddressStore from '@/modules/lib/utility/store/address.store';
import useAddress from '@/modules/lib/utility/hooks/use-address';
import usePayment from '@/modules/lib/utility/hooks/use-payment';
import PuffLoader from '@/modules/lib/components/puff-loader/PuffLoader';
import BoxRadio from '@/modules/lib/components/box-radio/BoxRadio';
import { cx, formatNumberAsPrice } from '@/modules/lib/utility/utility';
import { BiCaretDown, BiChevronDown } from 'react-icons/bi';
import { BsCaretDown } from 'react-icons/bs';
import { FaCaretDown } from 'react-icons/fa';
import { deliveryOptions } from '@/modules/lib/utility/constants';
import OrderSummary from '@/modules/lib/components/order-summary/OrderSummary';
import ImageAlt from '@/modules/lib/components/image-alt/ImageAlt';

const CheckoutPage = () => {
  const [unitCounter, setUnitCounter] = useState<number>(1);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<keyof typeof deliveryOptions>('standard');
  const router = useRouter()
  const { user } = useUserStore()
  const { cart, removeFromCart } = useCart()
  const signOut = useSignOut()
  const { openAddressModal, selectedAddress } = useAddress()
  const { loading: isPaymentLoading, payWithPaystack } = usePayment()
  const canProceedToPayment = !(!isPaymentLoading && selectedAddress && user)
  const [isCartCollapsed, setIsCartCollapsed] = useState(false)
  const selectedDeliveryOptionDetails = deliveryOptions[selectedDeliveryOption]

  return (
    <>
      <HomepageNavBar />
      <div className="app-width pt-42 mb-150">
        <h1 className='text-18 m:py-30 weight-300 uppercase text-dimgrey mt-50'>Checkout</h1>

        <div className='l:flex pt-10 gap-10 m:gap-60'>
          <div className='w-100p l:w-50p m:pr-30 gap-10 m:gap-30'>

            <div className='grid items-center gap-20 radius-10 px-10 py-20 m:px-20 py-20 border border-faint-grey g|grid-template-columns:auto|_|1fr|_|auto'>
              <div>
                <Icon name='profilea' className='w-25 m:w-55 h-100p' />
              </div>
              <div className=''>
                <h1 className='text-14 m:text-16 text-light-grey'>You're logged in as:</h1>
                <div className='text-14 m:text-16 pt-5 m:pt-10 gap-5 m:gap-20 weight-400 text-black'>
                  <p>{user?.profile.firstName} {user?.profile?.lastName}</p>
                  <p className='text-12 text-grey-600'>{user?.email}</p>
                </div>
              </div>
              <div className=''>
                <button className='border-none radius-5 text-12 m:text-14 weight-400 bg-yellow px-16 py-10' onClick={signOut}>CHANGE</button>
              </div>
            </div>

            <div className='px-10 m:px-40 radius-10 px-15 py-25 border border-faint-grey l:gap-30 my-20'>
              <div
                onClick={() => setIsCartCollapsed((collapsed) => !collapsed)}
                className='text-18 pb-20 weight-500 border-b border-grey-100 pointer flex space-between w-full'>
                <div className='block w-fit'>Your order</div>
                <BiChevronDown className='w-20 h-20' />
              </div>
              <div className={cx('px-10', {
                'hidden': isCartCollapsed
              })}>
                {cart.cartItems.map((cartItem, idx: number) => (
                  console.log(cartItem),
                  <div key={idx} className='l:flex space-between items-center border-b border-grey-100 py-30'>
                    <div className='flex w-100p gap-10 l:gap-20 items-center'>
                      <div className='w-80 h-80'>
                        <ImageAlt
                          className='w-full h-full radius-3'
                          src={cartItem.variant.media?.[0].url}
                          type='image'
                        />
                      </div>
                      <div className='line-height-27 w-70p'>
                        <h1 className='l:text-16 text-14 weight-400 text-black'> {cartItem.variant.product.name} </h1>
                        <div className='l:text-15 text-12 l:py-5'> {getCartItemVariantPropertiesAsJsx(cartItem)} </div>

                        {/* <div className='flex gap-20 w-100p py-5 l:text-18'>
                          <div className='grid m:flex w-100p  items-center'>
                            <div className='flex items-center gap-10 border-grey-300 pr-20 mr-10'>
                              <p className='text-16'>Unit:</p>
                              <div className='flex items-center '>
                                <Icon name='decr' className='w-20 h-20 pointer' onClick={() => setUnitCounter(prev => prev <= 1 ? 1 : prev - 1)} />
                                <div className="px-16 text-16">{unitCounter}</div>
                                <Icon name='incr' className='w-20 h-20 pointer' onClick={() => setUnitCounter(prev => prev + 1)} />
                              </div>
                            </div>
                          </div>
                        </div> */}

                        <h3 className='text-14 m:text-14 weight-600'>{formatNumberAsPrice(cartItem.variant.price)}</h3>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className='l:w-50p'>
            <div className='radius-10 px-20 py-20 border border-faint-grey'>
              <div className='grid g|grid-template-columns:auto|_|1fr|_|auto gap-10 m:gap-20 items-center'>
                <div>
                  <Icon name='car' className='w-25 m:w-55 h-100p' />
                </div>
                <div className=''>
                  <h1 className='text-16 m:text-16 text-light-grey m:text-black weight-500 m:weight-600'>Shipping address</h1>
                </div>
                <div className='w-35p m:w-25p'>
                  {selectedAddress && <button className='border-none radius-5 text-12 m:text-14 weight-400 px-16 py-10 bg-yellow pointer' onClick={openAddressModal}>CHANGE</button>}
                </div>
              </div>
              {
                selectedAddress ?
                  <div className='text-14 line-height-30 ml-70 pt-10 text-dimgrey border-t border-grey-100'>
                    <h1 className='text-16 weight-300 text-black'> {selectedAddress?.label} </h1>
                    <div className='opacity-70 weight-300 flex flex-col gap-0'>
                      <div>{selectedAddress?.address} {selectedAddress?.city} {selectedAddress?.state}</div>
                      <div>{selectedAddress?.contactNo}</div>
                    </div>
                  </div> :
                  <div>
                    <button className='radius-5 text-12 m:text-14 weight-400 px-16 py-10 bg-yellow hover:bg-yellow-600 border-none pointer w-fit mx-auto block mt-20' onClick={openAddressModal}>Select an address</button>
                  </div>
              }
            </div>

            <div className='px-10 m:px-40 radius-10 py-25 border border-faint-grey l:gap-30 mt-30'>
              <h2 className='text-18 pb-20 weight-500 border-b border-grey-100'>Delivery options</h2>
              <div className=''>
                <div className='mt-20 flex space-between gap-23 flex-col m:flex-row'>
                  {
                    Object.entries(deliveryOptions).map(([key, option]) => (
                      <BoxRadio id="delivery-type" name="delivery-type" key={key} value={key} label={
                        <div>
                          <h3 className='weight-500'>{option.title}</h3>
                          <div className='flex space-between w-full items-center'>
                            <div>{option.description}</div>
                            <div className='text-green w-fit text-right bg-green-50 px-5 py-3 h-fit radius-5'>{formatNumberAsPrice(option.price)}</div>
                          </div>
                        </div>
                      } 
                      checked={selectedDeliveryOption === key}
                      onChange={() => setSelectedDeliveryOption(key as keyof typeof deliveryOptions)}
                      />
                    ))
                  }
                </div>
              </div>
            </div>

            <div className='radius-10 l:gap-30 mt-30'>
              <div className='flex l:content-end '>
                <div className="l:w-60p w-100p">
                  <OrderSummary
                    subTotal={cart.subTotal}
                    extraSavings={cart.total - cart.subTotal}
                    shippingFee={selectedDeliveryOptionDetails.price}
                    total={cart.total + selectedDeliveryOptionDetails.price}
                  />
                </div>
              </div>
            </div>

            <button onClick={() => payWithPaystack({ addressId: selectedAddress?.id, deliveryOption: selectedDeliveryOption })} disabled={canProceedToPayment} className='border-none bg-green disabled:bg-green-300 hidden m:flex text-white text-14 px-16 py-16 radius-8 pointer mt-30 l:float-right'>
              <span className=''>Proceed to payment</span>
              <PuffLoader size={15} loading={isPaymentLoading} className='ml-10' />
            </button>
          </div>

          <button className='border-none mt-40 w-100p bg-green mt-20 mx-auto m:hidden text-white text-16 l:px-35 l:py-20 px-20 py-15 radius-10 pointer' onClick={() => router.push('/checkout/success')}>
            Proceed to payment
          </button>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default CheckoutPage
