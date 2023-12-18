"use client"

import Icon from '@/modules/lib/components/icon/Icon';
import Image from '@/modules/lib/components/image/Image';
import Modal from '@/modules/lib/components/modal/modal';
import OrderSummary from '@/modules/lib/components/order-summary/OrderSummary';
import { useCart } from '@/modules/lib/utility/hooks/use-cart';
import { cx, formatNumberAsPrice } from '@/modules/lib/utility/utility';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai'
import { BiArrowBack } from 'react-icons/bi';
import { FaTimes } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { MdOutlineLocalShipping } from 'react-icons/md'
import { PiNyTimesLogoThin } from 'react-icons/pi';
import { TbShoppingBag } from 'react-icons/tb';
import { paths } from '../../utility/paths';
import { getCartItemVariantPropertiesAsJsx } from './minicart.helper';

interface ModalProps {

}

const MiniCart: React.FC<ModalProps> = () => {
  const [open, setOpen] = useState(false);

  const { cart, removeFromCart } = useCart()
  const router = useRouter()


  return (
    <div>
      <Modal isOpen={open} onClose={() => setOpen(false)} extraClass={{ top: '0px', bottom: '0px', height: '100vh', right: '0px', overflow: 'hidden' }}>
        <div className='relative h-full'>
          <div className='py-15 bg-grey-200 pointer' onClick={() => setOpen(false)}>
            <div className="flex px-15 gap-10 j-content-center ">
              <div className='h-fit self-center block'><FaArrowLeftLong className='text-green h-fit mt-2' /></div>
              <div className="text-green block"> Continue shopping </div>
            </div>
          </div>
          <div className='min-w-500 h-full py-10 scroll-y'>

            {!cart.cartItems.length ? (
              <div className='mx-auto h-250 text-center items-center j-content-center mt-50'>
                <p className='text-16 text-grey-500'>Your cart is empty</p>

                <div className='w-100p px-20 py-10'>
                  <button onClick={() => setOpen(false)} className='pointer mx-auto w-40p border-none bg-green text-white text-16 py-10 px-20 radius-5 weight-400'>Shop now</button>
                </div>
              </div>
            ) : (
              <div className='px-20 pb-20'>
                <div className='uppercase mb-30'>Your cart</div>
                {cart.cartItems.map((cartItem: any, i) => (
                  <div className={cx('space-between items-center radius-5 py-10 mb-20 px-15 g|box-shadow:1px|_|0px|_|2px|_|0px|_|rgba(0,0,0,0.10);', {
                    'bg-whitesmoke border border-whitesmoke': i % 2,
                    'border border-whitesmoke': !(i % 2),
                  })} >
                    <span className='float-right pointer' onClick={() => removeFromCart(cartItem.id)}> <IoClose /> </span>
                    {/* <div className='flex w-100p gap-10 l:gap-30 items-center'>
                      <div className='w-80 h-80 border border-lightgrey radius-5 l:radius-10 '>
                        <Image
                          className='w-full h-full radius-5 l:radius-10'
                          src={cartItem.variant.media[0].url}
                          alt='product'
                          type='image'
                        />
                      </div>
                      <div className='line-height-20'>
                        <h2 className='text-12 l:text-14 weight-400'>{cartItem.variant.product.name} ({cartItem.variant.name})</h2>
                        <p className='text-12 text-light-grey'>{cartItem.variant.stock} {cartItem.variant.stockUnit}(s) left</p>
                        <h1 className='text-14 weight-400'>{formatNumberAsPrice(cartItem.variant.price * cartItem.quantity)}</h1>
                        <div className='flex space-between gap-20 w-100p'>
                          <button className='w-100p flex l:w-100p border-1 border-green bg-white text-green text-10 py-5 px-10 radius-5 weight-500'><MdOutlineLocalShipping className='w-25' /> 10% Shipping discount</button>
                        </div>
                      </div>
                    </div>
                    <div className='flex space-between w-100p'>
                      <div className='flex space-between w-100p'>
                        <div className='flex gap-10 text-danger text-12 items-center weight-400'>
                          <Icon name='delete' className='w-17 h-17' />
                          <p>Remove</p>
                        </div>

                        <div className='flex j-content-center w-33p p-15 text-15 l:text-20 text-black'>
                          <select name="" id="" className='border-none text-15 l:text-12 text-black weight-400'>
                            <option value="">Bundle</option>
                            <option value="">Bale</option>
                          </select>
                        </div>
                        <div className='flex w-33p items-center'>
                          <Icon name='decr' className='w-25 h-25' />
                          <input type="number" value={cartItem.quantity} className='border-none w-55 text-16 text-center' placeholder='1' />
                          <Icon name='incr' className='w-25 h-25' />
                        </div>
                      </div>
                    </div> */}


                      <div className="flex gap-10">
                        <div className={cx('w-50 h-50', {
                          'bg-white': (i % 2),
                          'bg-grey-100': !(i % 2),
                        })}>
                          <Image
                            className='w-full h-full radius-3'
                            src={cartItem.variant.media[0].url}
                            alt='product'
                            type='image'
                          />
                        </div>

                        <div className='w-full h-full flex flex-col'>
                          <div className="w-full h-20">
                            <div className={cx("w-150 h-12 radius-3 text-13 weight-500", {
                              // 'bg-white': (i % 2),
                              // 'bg-grey-100': !(i % 2),
                            })}> {cartItem.variant.product.name} </div>
                          </div>

                          <div className="w-full h-20">
                            <div className={cx("w-100 h-8 radius-3 flex gap-3 text-13", {
                              // 'bg-white': (i % 2),
                              // 'bg-grey-100': !(i % 2),
                            })}>
                                {getCartItemVariantPropertiesAsJsx(cartItem)}
                            </div>
                          </div>

                          <div className="w-full h-20">
                            <div className={cx("w-100 h-8 radius-3 flex text-12", {
                              // 'bg-white': (i % 2),
                              // 'bg-grey-100': !(i % 2),
                            })}>
                              {cartItem.variant.stock} {cartItem.variant.stockUnit}(s) left
                            </div>
                          </div>

                          <div className="w-full h-20 flex space-between">
                            <div></div>
                            <div className={cx('w-50 radius-3 text-12 bold', {
                              // 'bg-white': (i % 2),
                              // 'bg-grey-100': !(i % 2),
                            })}>
                              {formatNumberAsPrice(cartItem.totalPrice)}
                            </div>
                          </div>
                        </div>

                      </div>
                  </div>
                ))}
                <div className="offset h-400 w-full"></div>
              </div>
            )}

          </div>
          { !!cart.cartItems.length && <div className='bg-yellow-50 pb-30 absolute b-0 left-0 w-full '>
              <div className='px-20 mt-15 mb-15'>
                  <OrderSummary
                    subTotal={cart.subTotal}
                    extraSavings={cart.total - cart.subTotal}
                    shippingFee={1500}
                    total={cart.total}
                  />
              </div>
              <div className='w-fit mx-auto mt-30'>
                  <button className='bg-green border-none radius-5 text-white py-14 px-30 weight-600 text-16 pointer' onClick={() => router.push(paths.checkout)}>Proceed to checkout</button>
              </div>

              <div className='text-13 mt-5 w-fit mx-auto'>
                  For Returns Policy,
                  <span className='text-green text-13'> click here</span>
              </div>
          </div>}
        </div>
      </Modal>

      <div className="w-100p b-70 r-10">
        <div onClick={() => setOpen(true)} className="mx-auto pointer flex w-140 h-50  bg-green p-4 text-white radius-10">
          <div className="w-40p radius-10 radius-t-r-0 radius-b-r-0 flex items-center j-content-center bg-darkgreen text-white">
            <TbShoppingBag className="w-25 h-25" />
          </div>
          <div className="w-60p text-18 flex text-center items-center j-content-center">
            {cart.cartItems.length} items
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniCart;
