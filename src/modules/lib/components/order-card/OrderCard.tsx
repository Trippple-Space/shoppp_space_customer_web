import React from 'react'
import Image from '../image/Image'
import Button from '../button/Button'
import { Order } from '../../utility/types/order.interface'
import { getCartItems } from '../../utility/utility'

const OrderCard = ({ order }: { order: Order }) => {
  const cartItems = getCartItems(order?.cart?.storeGroups)

  return (
    <div className="grid items-center g|grid-template-columns:1fr|_|auto l:g|grid-template-columns:auto|_|1fr|_|auto gap-15 l:gap-40">
      
      {
          cartItems?.map(item => (
            <>
              <div className="">
                <Image
                  className='w-60 h-60 radius-5 l:radius-10'
                  src={item?.variant?.media?.[0]?.url}
                  alt='product'
                  type='image'
                />
              </div>
        
              <div className="">
                <div className="text-grey-700 weight-400 text-12">Order: #{order?.id}</div>
                <div className="text-grey-900 text-14 weight-500 my-7">{item?.variant?.product?.name}</div>
                <div className="text-grey-700 text-14">
                  <span className="text-grey-700 weight-400 text-12 mr-10">Unit: {item.quantity} {item.variant.stockUnit}</span>
                  <span>Variation: {Object.entries(item?.variant?.properties).map(([key, value]) => `${key.toLocaleUpperCase()}: ${value} `)}</span>
                </div>
                <div className="text-grey-900 text-14 weight-500 my-7">NGN {order.cart.total}</div>
                <div className="grid l:flex items-center gap-10">
                  <div className="bg-yellow text-grey-900 text-12 weight-400 w-fit px-16 py-7 radius-8">{order.status}</div>
                  <div className="text-grey-700 weight-400 text-12">{order.delivery.deliveryWindowStart} - {order.delivery.deliveryWindowEnd}</div>
                </div>
              </div>
        
              <Button children={"Buy again"} />
            
            </>
          ))
        }
      
    </div>
  )
}

export default OrderCard