import React from 'react'
import Image from '../image/Image'
import Button from '../button/Button'

const OrderCard = () => {
  return (
    <div className="grid items-center g|grid-template-columns:auto|_|1fr|_|auto gap-20">
      <div className="">
        <Image
          className='w-fit h-150p radius-5 l:radius-10'
          src='order-product.png'
          alt='product'
          type='image'
        />
      </div>

      <div className="">
        <div className="text-grey-700 weight-400 text-14">Order: #45621</div>
        <div className="text-grey-900 text-16 weight-500 my-7">24 Karat Gold Plated Ring</div>
        <div className="text-grey-700 text-14">
          <span className="text-grey-700 weight-400 text-14 mr-10">Unit: 1</span>
          <span>Variation: Plated ring</span>
        </div>
        <div className="text-grey-900 text-16 weight-500 my-7">NGN 26,000</div>
        <div className="flex items-center gap-10">
          <div className="bg-yellow text-grey-900 text-14 weight-400 w-fit px-16 py-7 radius-8">Out for delivery</div>
          <div className="text-grey-700 weight-400 text-14">January 15th, 2023</div>
        </div>
      </div>

      <Button children={"Buy again"} />
    </div>
  )
}

export default OrderCard