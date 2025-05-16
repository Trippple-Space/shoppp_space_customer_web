import React, { FC } from 'react'
import { formatNumberAsPrice } from '../../utility/utility'
interface IOrderSummary {
  subTotal: number
  extraSavings: number
  shippingFee?: number
  total: any
  slashedPrice?: number
}

const OrderSummary: FC<IOrderSummary> = ({
  subTotal,
  extraSavings,
  shippingFee,
  total,
  slashedPrice
}) => {
  return (
    <div className='w-full flex flex-col md:gap-24 gap-20 md:pb-0 pb-12 md:pt-0 sm:pt-12 pt-56'>
      <div className='flex flex-col gap-16 text-16 line-height-24 weight-400 color-#000000E0'>
        <div className='flex space-between'>
          <div className=''>Subtotal</div>
                    <div className="flex a-items-center gap-8">
                                                     
                                                         {
                                                   
                                                           <p className={`weight-400 md:text-16 sm:text-12 text-10 md:line-height-24 sm:line-height-20 line-height-18`}>
                                                             {formatNumberAsPrice(total)}
                                                           </p>
                                                         }
            
                                                       </div>
        </div>

        {!!extraSavings && (
          <div className='flex space-between'>
            <div className=''>Extra savings</div>
            <div className=''>{formatNumberAsPrice(extraSavings)}</div>
          </div>
        )}

        {!!shippingFee && (
          <div className='flex space-between'>
            <div className=''>Delivery fee</div>
            <div className=''>{formatNumberAsPrice(shippingFee)}</div>
          </div>
        )}
      </div>
      {!!total && (
        <div className='flex space-between border-t md:border-b-0 border-b border-grey-300 text-20 line-height-28 weight-600 md:pt-24 pt-20 md:pb-0 pb-20'>
          <div className=''>Total</div>
           <div className="flex a-items-center gap-8">
                                                         <p className={`weight-600 md:text-20 sm:text-16 text-14 md:line-height-28 sm:line-height-24 line-height-22`}>
                                                          {slashedPrice ? formatNumberAsPrice(slashedPrice) : formatNumberAsPrice(total)}
                                                         </p>
                                                         {
                                                   
                                                           <p className={`weight-400 md:text-16 sm:text-12 text-10 md:line-height-24 sm:line-height-20 line-height-18 line-through color-#00000099`}>
                                                             {formatNumberAsPrice(total)}
                                                           </p>
                                                         }
            
                                                       </div>
        </div>
      )}
    </div>
  )
}

export default OrderSummary
