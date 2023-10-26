import React, { useState } from 'react'
import Image from '../image/Image'
import Button from '../button/Button'
import Icon from '../icon/Icon'

const SavedItemsCard: React.FC<any> = ({data, showRemove=true}: {data: any, showRemove: boolean}) => {
  const [unit, setUnit] = useState<number>(data.unit)
  return (
    <div className='l:flex space-between items-center'>
      <div className='flex w-100p l:w-50p gap-10 l:gap-30 items-center'>
        <div className='w-115 h-115'>
        <Image
          className='w-fit h-100p radius-5 l:radius-10'
          src='order-product.png'
          alt='product'
          type='image'
        />
        </div>
        <div className='line-height-28'>
          <h2 className='text-16 l:text-18 weight-400 text-natural-900'>{data?.name}</h2>
          <h1 className='text-16 weight-400 text-natural-900'>NGN 26,000</h1>
          <p className='text-12'>January 15th, 2023</p>
          {
            showRemove ? 
            <div className='hidden l:flex gap-10 text-danger text-12 items-center pointer'>
              <Icon name='delete' className='w-17 h-17' />
              <p>Remove</p>
            </div>
            : ''
          }

        </div>
      </div>

      <div className='flex space-between w-100p l:w-30p'>
        <div className='flex space-between w-100p'>
          <div className='flex w-50p items-center'>
            <Icon name='decr' className='w-25 h-25 pointer' onClick={() => setUnit((prev) => prev <= 0 ? 1 : prev - 1)} />
            <span className="px-20">{unit}</span>
            <Icon name='incr' className='w-25 h-25 pointer' onClick={() => setUnit((prev) => prev + 1)} />
          </div>

          <div className='flex j-content-center w-50p p-15 text-15 l:text-20 text-black bg-white'>
            <select name="" id="" className='border-none text-15 l:text-17 text-black weight-500 bg-white'>
              <option value="">Bundle</option>
              <option value="">Bale</option>
            </select>
          </div>
        </div>
      </div>

      <div className='flex space-between gap-20 w-100p l:w-15p'>
        {<button className='flex j-content-center l:hidden w-50p l:w-100p border-1 border-red bg-none text-danger text-16 py-10 px-20 radius-5 weight-400'>Remove</button>}
        <button className='w-50p l:w-100p border-none bg-green text-white text-15 py-10 px-20 radius-5 weight-400'>Add to cart</button>
      </div>
    </div>
  )
}

export default SavedItemsCard