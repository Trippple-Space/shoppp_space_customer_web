import Icon from '@/modules/lib/components/icon/Icon'
import Image from '@/modules/lib/components/image/Image'
import React from 'react'
import { AiOutlineShareAlt } from 'react-icons/ai';
import SuccessMessage from './success-page';


const CheckoutPage = () => {
  return (
    <div className="w-100p p-20 l:p-70">
      <h1 className='text-28 py-30 text-dimgrey'>Checkout</h1>
      
      <div className='l:flex pt-10 gap-60'>
       <div className='w-100p l:w-50p pr-30 gap-30'>

        <div className='radius-10 px-20 py-20 flex space-between gap-20 items-center' style={{border: '1px solid #DADADA'}}>
          <div>
            <Icon name='profilea' className='w-55 h-100p' />
          </div>
          <div className='w-70p'>
            <h1 className='text-18 text-light-grey'>LOGIN</h1>
            <div className='flex text-16 pt-10 gap-20 weight-400 text-black'>
              <p>Muhammed Lawal</p>
              <p>+234 81960235</p>
            </div>
          </div>
          <div className='w-25p'>
          <button className='border-none radius-5 text-16 weight-400 bg-lighter-grey px-20 py-10'>CHANGE</button>
          </div>
        </div>
        
        <div className='radius-10 px-20 py-20 my-40' style={{border: '1px solid #DADADA'}}>
          <div className='flex space-between gap-20 items-center'>
            <div>
              <Icon name='car' className='w-55 h-100p' />
            </div>
            <div className='w-70p'>
              <h1 className='text-20 text-black'>SHIPPING ADDRESS</h1>
            </div>
            <div className='w-25p'>
            <button className='border-none radius-5 text-16 weight-400 bg-lighter-grey px-20 py-10'>CHANGE</button>
            </div>
          </div>

          <div className='text-14 line-height-25 ml-70 pt-10 weight-400 mt-10 text-dimgrey' style={{borderTop: '1px solid #DADADA'}}>
                <h1 className='text-18 text-black'>Abdulhammed Ibraheem</h1>
                <p>7, Anthony village road, Anthony Lagos.</p>
                <p>Lagos Nigeria</p>
                <p>Anthony Lagos</p>
                <p>08080803332</p>
              </div>
        </div>
        

      <button className='border-none bg-green text-white text-16 px-35 py-20 radius-10'>Proceed to payment</button>
        
       </div>

       <div className='l:w-50p'>
        <div className='border-1 border-lighter-grey px-40 radius-20 px-15 py-25 l:p-30 shadow-0-2-20-0-shadowGrey l:gap-30' style={{border: '1px solid #DADADA'}}>
          <h2 className='text-20 py-20' style={{borderBottom: '1px solid #DADADA'}}>Your Order</h2>
          <div className='px-10 pb-30'>
          {[0,0].map((data: any) => (
            <div key={data} className='l:flex space-between items-center py-20' style={{ borderBottom: '1px solid #D9D9D9'}}>
            <div className='flex w-100p gap-10 l:gap-30 items-center'>
              <div className='w-115 h-115'>
              <Image
                className='w-fit h-100p radius-5 l:radius-10'
                src='order-product.png'
                alt='product'
                type='image'
              />
              </div>
              <div className='line-height-27 w-80p'>
                <h1 className='text-16 l:text-24 weight-500 text-black'>24 Karat Gold Plated Ring</h1>

                <div className='flex gap-20 w-100p py-10 text-18'>
                  <div className='flex w-100p  items-center'>
                    <div className='flex items-center gap-10'>
                    <p className='text-18'>Quantity:</p>

                      <Icon name='decr' className='w-25 h-25' />
                      <input type="number" className='border-none w-55 text-16 text-center' placeholder='1' />
                      <Icon name='incr' className='w-25 h-25' />
                    </div>

                    <hr className='h-30 mx-20' style={{ borderRight: '1px solid #D9D9D9'}} />

                    <div className='flex j-content-center gap-10 p-15 text-15 l:text-20 text-black'>
                      <p className='text-18'>Unit:</p>
                      <select name="" id="" className='border-none text-15 l:text-18 text-black weight-500'>
                        <option value="">Bundle</option>
                        <option value="">Bale</option>

                      </select>
                    </div>
                  </div>
                </div>

                <h1 className='text-28 weight-500'>NGN 26,000</h1>


              </div>
            </div>

        </div>
          ))}
          <div className='flex space-between text-dimgrey weight-500 py-20'>
            <h2 className='text-dimgrey'>Delivery</h2>
            <h2>NGN 3,500 <span className='text-light-grey'>(Express)</span></h2>
          </div>
         </div>
        </div>
       </div>
      </div>
     
    </div>
  )
}

export default CheckoutPage
