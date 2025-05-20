import React, { FC, useState } from 'react'
import { formatNumberAsPrice } from '../../utility/utility'
import { TrustedAdvisor } from 'aws-sdk'
import Input from '../input/Input'
import Button from '../button/Button'
import { useCart } from '../../utility/hooks/use-cart'
interface IOrderSummary {
  subTotal: number
  discount?: number
  shippingFee?: number
  total: any
  slashedPrice?: number
}

const OrderSummary: FC<IOrderSummary> = ({
  subTotal,
  discount,
  shippingFee,
  total
}) => {


  const { applyDiscount } = useCart(); 

  const [showDisCountInput, setShowDisCountInput] = React.useState(false)
  const [discountCode, setDiscountCode] = useState<string>("");
  
   const handleApplyDiscount = (code: string) => {
    applyDiscount(code);
  }

  return (
    <div className='w-full flex flex-col md:gap-15 gap-20 md:pb-0 pb-12 md:pt-0 sm:pt-12 pt-56'>
      
      <div className='flex flex-col gap-16 text-16 line-height-24 weight-400 color-#000000E0'>
      
        <div className='flex space-between'>
          <div className=''>Subtotal</div>
                    <div className="flex a-items-center gap-8">
                                                     
                                                         {
                                                   
                                                           <p className={`weight-400 md:text-16 sm:text-12 text-10 md:line-height-24 sm:line-height-20 line-height-18`}>
                                                             {formatNumberAsPrice(subTotal)}
                                                           </p>
                                                         }
            
                                                       </div>
        </div>

        {!!discount && (
          <div className='flex space-between'>
            <div className=''>Discount</div>
            <div className=''>-{formatNumberAsPrice(discount)}</div>
          </div>
        )}

        {!!shippingFee && (
          <div className='flex space-between'>
            <div className=''>Delivery fee</div>
            <div className=''>{formatNumberAsPrice(shippingFee)}</div>
          </div>
        )}
      </div>

     
          <div className='flex space-between'>
            <div className=''>Apply discount</div>
           
            <div className='color-#1677FF border-b pointer' onClick={() => 
setShowDisCountInput(prev => !prev)

            }>
              {showDisCountInput ? "Close" : "Enter code"}
            </div>
          </div>
        
      {
        showDisCountInput && (
          <>
            
            <div className="flex gap-8 a-items-center w-full">
                  <input placeholder="Enter discount code"
                className=" h-15 block font-inter 
            @lo:border-solid @lo:border-1 @lo:border-grey-300 py-17  @lo:px-10  @lo:weight-400 @lo:outline-none
            @lo:placeholder:text-grey-400 @lo:radius-8
            @lo:focus:border-green @lo:placeholder:text-12 "
             
              value={discountCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiscountCode(e.target.value)}
              
            />
            <div className=""
              onClick={ () => 
                handleApplyDiscount(discountCode)
               }
            
            >

            <Button className="l:py-9">Apply</Button>
            </div>
          </div>
          
          </>
        )
      }


      {!!total && (
        <div className='flex space-between border-t md:border-b-0 border-b border-grey-300 text-20 line-height-28 weight-600 md:pt-24 pt-20 md:pb-0 pb-20'>
          <div className=''>Total</div>
           <div className="flex a-items-center gap-8">
                                                         <p className={`weight-600 md:text-20 sm:text-16 text-14 md:line-height-28 sm:line-height-24 line-height-22`}>
                                                         {formatNumberAsPrice (total)}
                                                         </p>
                                                      
            
            
                                                       </div>
        </div>
        
      )}
      
    </div>
  )
}

export default OrderSummary
