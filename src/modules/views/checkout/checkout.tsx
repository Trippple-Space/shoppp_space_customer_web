"use client"

import Icon from '@/modules/lib/components/icon/Icon'
import Image from '@/modules/lib/components/image/Image'
import React, { useState } from 'react'
import { AiOutlineShareAlt } from 'react-icons/ai';
import SuccessMessage from './success-page';
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar';
import { useRouter } from 'next/navigation';
import Footer from '@/modules/lib/components/footer/Footer';


const CheckoutPage = () => {
  const [unitCounter, setUnitCounter] = useState<number>(1);
  const router = useRouter()
  return (
    <>
      <HomepageNavBar />
      <div className="app-width pt-42">
        <h1 className='text-28 m:py-30 text-dimgrey'>Checkout</h1>
        
        <div className='l:flex pt-10 gap-10 m:gap-60'>
        <div className='w-100p l:w-50p m:pr-30 gap-10 m:gap-30'>

          <div className='grid items-center gap-20 radius-10 px-10 py-20 m:px-20 py-20 border border-faint-grey g|grid-template-columns:auto|_|1fr|_|auto'>
            <div>
              <Icon name='profilea' className='w-25 m:w-55 h-100p' />
            </div>
            <div className=''>
              <h1 className='text-14 m:text-16 text-light-grey'>LOGIN</h1>
              <div className='grid m:flex text-14 m:text-16 pt-5 m:pt-10 gap-5 m:gap-20 weight-400 text-black'>
                <p>Muhammed Lawal</p>
                <p>+234 81960235</p>
              </div>
            </div>
            <div className=''>
            <button className='border-none radius-5 text-12 m:text-14 weight-400 bg-whitesmoke px-16 py-10'>CHANGE</button>
            </div>
          </div>
          
          <div className='radius-10 px-20 py-20 my-40 border border-faint-grey'>
            <div className='grid g|grid-template-columns:auto|_|1fr|_|auto gap-10 m:gap-20 items-center'>
              <div>
                <Icon name='car' className='w-25 m:w-55 h-100p' />
              </div>
              <div className=''>
                <h1 className='text-16 m:text-16 text-light-grey m:text-black weight-500 m:weight-600'>SHIPPING ADDRESS</h1>
              </div>
              <div className='w-35p m:w-25p'>
              <button className='border-none radius-5 text-12 m:text-14 weight-400 bg-whitesmoke px-16 py-10'>CHANGE</button>
              </div>
            </div>

            <div className='text-14 line-height-30 ml-70 pt-10 weight-400 mt-10 text-dimgrey border-t border-natural-300'>
                  <h1 className='text-16 weight-400 text-black'>Abdulhammed Ibraheem</h1>
                  <div className='opacity-70'>
                  <p>7, Anthony village road, Anthony Lagos.</p>
                  <p>Lagos Nigeria</p>
                  <p>Anthony Lagos</p>
                  <p>08080803332</p>
                  </div>
                </div>
          </div>
          

        <button className='border-none bg-green hidden m:flex text-white text-14 px-16 py-16 radius-8 pointer' onClick={() => router.push('/checkout/success')}>
          Proceed to payment
        </button>
          
        </div>

        <div className='l:w-50p'>
          <div className='px-10 m:px-40 radius-20 px-15 py-25 border border-faint-grey shadow-0-2-20-0- l:gap-30'>
            <h2 className='text-18 py-20 weight-500 border-b border-lighter-grey'>Your Order</h2>
            <div className='px-10'>
            {[0,0].map((data: any, idx: number) => (
              <div key={idx} className='l:flex space-between items-center border-b border-lighter-grey py-20'>
              <div className='flex w-100p gap-10 l:gap-30 items-center'>
                <div className='w-140 h-140 m:w-150 m:h-160'>
                <Image
                  className='w-100p h-100p radius-5 l:radius-10'
                  src='order-product.png'
                  alt='product'
                  type='image'
                />
                </div>
                <div className='line-height-27 w-70p'>
                  <h1 className='text-18 l:text-20 weight-500 text-black'>24 Karat Gold Plated Ring</h1>

                  <div className='flex gap-20 w-100p py-10 text-18'>
                    <div className='grid m:flex w-100p  items-center'>
                      <div className='flex items-center gap-10 border-r pr-20 mr-20'>
                        <p className='text-16'>Unit:</p>
                        <div className='flex items-center '>
                          <Icon name='decr' className='w-20 h-20 pointer' onClick={() => setUnitCounter(prev => prev <= 1 ? 1 : prev- 1)} />
                          <div className="px-16 text-16">{unitCounter}</div>
                          <Icon name='incr' className='w-20 h-20 pointer' onClick={() => setUnitCounter(prev => prev + 1)} />
                        </div>
                      </div>

                      {/* <hr className='h-30 mx-20 hidden m:grid border-r border-lighter-grey'/> */}

                      <div className='flex m:j-content-center gap-10 px-0 py-10 m:px-15 text-15 l:text-20 text-black'>
                        <p className='text-16'>Quantity:</p>
                        <select name="" id="" className='border-none text-15 l:text-18 text-black weight-500 bg-transparent outline-none'>
                          <option value="">Bundle</option>
                          <option value="">Bale</option>

                        </select>
                      </div>
                    </div>
                  </div>

                  <h1 className='text-20 m:text-20 weight-500'>$15.25</h1>


                </div>
              </div>

          </div>
            ))}
            <div className='flex items-center space-between py-20'>
              <h2 className='weight-500 text-18 text-dimgrey'>Delivery</h2>
              <h2 className='weight-500 text-18'>$35.00 <span className='text-16 text-light-grey'>(Express)</span></h2>
            </div>
          </div>
          </div>
        </div>

        <button className='border-none bg-green mt-20 mx-auto m:hidden text-white text-16 px-35 py-20 radius-10 pointer' onClick={() => router.push('/checkout/success')}>
          Proceed to payment
        </button>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default CheckoutPage
