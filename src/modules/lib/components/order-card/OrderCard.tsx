import React from 'react'
import Image from '../image/Image'
import Button from '../button/Button'
import { Order } from '../../utility/types/order.interface'
import { getCartItems } from '../../utility/utility'

const OrderCard = ({ order }: { order: Order }) => {
  const cartItems = getCartItems(order?.cart?.storeGroups)

  return (
    <div className="grid items-center [grid-template-columns:1fr_auto] lg:[grid-template-columns:auto_1fr_auto] gap-[15px] lg:gap-[40px]">
      
      {
          cartItems?.map(item => (
            <>
              <div className="">
                <Image
                  className='w-[60px] h-[60px] rounded-[5px] lg:rounded-[10px]'
                  src={item?.variant?.media?.[0]?.url}
                  alt='product'
                  type='image'
                />
              </div>
        
              <div className="">
                <div className="text-[#6B6662] font-normal text-[12px]">Order: #{order?.id}</div>
                <div className="text-[#1F1B17] text-[14px] font-medium my-[7px]">{item?.variant?.product?.name}</div>
                <div className="text-[#6B6662] text-[14px]">
                  <span className="text-[#6B6662] font-normal text-[12px] mr-[10px]">Unit: {item.quantity} {item.variant.stockUnit}</span>
                  <span>Variation: {Object.entries(item?.variant?.properties).map(([key, value]) => `${key.toLocaleUpperCase()}: ${value} `)}</span>
                </div>
                <div className="text-[#1F1B17] text-[14px] font-medium my-[7px]">NGN {order.cart.total}</div>
                <div className="grid lg:flex items-center gap-[10px]">
                  <div className="bg-[#FACE33] text-[#1F1B17] text-[12px] font-normal w-fit px-[16px] py-[7px] rounded-[8px]">{order.status}</div>
                  <div className="text-[#6B6662] font-normal text-[12px]">{order.delivery.deliveryWindowStart} - {order.delivery.deliveryWindowEnd}</div>
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