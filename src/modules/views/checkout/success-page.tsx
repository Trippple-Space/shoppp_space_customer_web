import Icon from '@/modules/lib/components/icon/Icon'
import Image from '@/modules/lib/components/image/Image'
import React from 'react'


const SuccessMessage = () => {
  return (
    <div className="w-100p h-100p mx-auto flex flex-col items-center j-content-center p-20 l:p-70">
      <Icon name='amico' className='w-80p l:100p h-250 my-10' />
        <h1 className='text-24 l:text-36 line-height-40 my-15 weight-700'>Success! Order number 1462</h1>
        <p className='text-16 l:text-18 line-height-30'>we have already started preparing your order.</p>
        <p className='text-16 l:text-18 line-height-30'>Delivery within 48 hrs</p>
        <button className='bg-green radius-10 text-white text-16 my-20 border-none py-20 px-30'>Track Order</button>
     
    </div>
  )
}

export default SuccessMessage
