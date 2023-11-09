import React from 'react'
import Image from '../image/Image'
import Button from '../button/Button'

const AddressCard = () => {
  return (
    <div className='l:flex space-between items-center py-20 border-b border-lighter-grey'>
      <div className='flex gap-10 l:gap-20 items-center py-10'>
        <div className='w-110 l:w-145 h-110'>
        <Image
          className='w-100p h-100p radius-5 l:radius-20'
          src='delivery-man.png'
          alt='product'
          type='image'
        />
        </div>
        <div className='line-height-25 text-13 text-dimgrey opacity-70'>
          <h2 className='text-16 l:text-20 weight-400 text-black opacity-100'>Abdulhammed Ibraheem</h2>
          <p>7, Anthony village road, Anthony Lagos.</p>
          <p>Lagos Nigeria</p>
          <p>Anthony Lagos</p>
          <p>08080803332</p>
        </div>
      </div>

      <div className='flex flex-col a-items-end gap-15 l:gap-60'>
        <p className='text-green text-14'>Default address</p>
        <div className='flex gap-8 l:gap-30 w-100p space-between'>
          <button className='w-50p  border-danger border-1 l:border-none bg-none text-danger text-15 py-12 px-20 radius-5 weight-400'>Delete</button>
          <button className='w-50p l:w-100p border-none bg-green text-white text-15 py-12 px-20 radius-7 weight-400'>Edit address</button>
        </div>
      </div>
    </div>
  )
}

export default AddressCard