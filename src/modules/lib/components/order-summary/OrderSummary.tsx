import React, { FC, useState } from 'react'
import { formatNumberAsPrice } from '../../utility/utility'
import { TrustedAdvisor } from 'aws-sdk'
import Input from '../input/Input'
import Button from '../button/Button'
import { useCart } from '../../utility/hooks/use-cart'
import { toast } from 'sonner'
import { AiOutlineTag } from 'react-icons/ai'
import { Cart, StoreGroupResponse } from '../../utility/types/cart.interface'
interface IOrderSummary {
  subTotal: number
  shippingFee?: number
  total: any
  slashedPrice?: number
  cart: Cart
  loading: boolean
}

const OrderSummary: FC<IOrderSummary> = ({
  subTotal,
  shippingFee,
  total,
  cart,
  loading
}) => {


  const { applyDiscount, applyingCode } = useCart();

  const [showDisCountInput, setShowDisCountInput] = React.useState(false)
  const [discountCode, setDiscountCode] = useState<string>("");

  const orderDiscount = cart.systemDiscountCode || cart.storeGroups.find((store) => store.discountCode !== null)
  const totalProductDiscounts = () => {
    let total = 0
    cart.cartItems.forEach(item => {
      total += item.discountValue
    });
    return total
  }

  const getStoreProductsDiscounts = (store: StoreGroupResponse) => {
    let total = 0
    store.items.forEach(item => {
      total += item.discountValue
    });
    return total
  }

  const handleApplyDiscount = (code: string) => {
    if (code.length <= 4) {
      toast.error("Invalid promo code")
    } else {
      applyDiscount(code)
      setDiscountCode("")
    }
  }

  return (
    <div className='w-full flex flex-col md:gap-[15px] gap-[20px] md:pb-0 pb-[12px] md:pt-0 sm:pt-[12px] pt-[56px]'>

      <div className='flex flex-col gap-[16px] text-[16px] leading-[24px] font-normal text-[#000000E0]'>
        <div className='flex justify-between sm:pt-0 pt-[16px]'>
          <div className=''>Subtotal</div>
          <div className="flex items-center gap-[8px]">

            {

              <p className={`font-normal`}>
                {formatNumberAsPrice(subTotal - totalProductDiscounts())}
              </p>
            }

          </div>
        </div>

        <div className='flex justify-between'>
          <div className=''>Promo Code</div>
          <div className='text-[#1677FF] underline cursor-pointer' onClick={() =>
            setShowDisCountInput(prev => !prev)

          }>
            {showDisCountInput ? "Close" : "Enter code"}
          </div>
        </div>

        {
          showDisCountInput && (
            <>

              <div className="flex gap-[8px] items-center w-full">
                <input placeholder="Enter discount code"
                  className="h-[41px] block font-inter px-[10px] w-full flex flex-col items-center pb-[4px]
            border-solid border border-[#E4E1DF] font-normal outline-none
            placeholder:text-grey-400 rounded-[6px]
            focus:border-brand placeholder:text-[12px] grow"

                  value={discountCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiscountCode(e.target.value)}

                />
                <div className=""
                  onClick={() =>
                    handleApplyDiscount(discountCode)
                  }
                >
                  <Button disabled={applyingCode} className="flex flex-col justify-center items-center h-[40px]">{applyingCode ? "Processing..." : "Apply"}</Button>
                </div>
              </div>

            </>
          )
        }

        {orderDiscount && (
          <div className=''>
            <div>
              <div className=''>Discounts</div>
              <div className='flex flex-col gap-[3px]'>
                {
                  cart?.storeGroups?.map((store) => (
                    store.discountCode &&
                    <div key={store.id} className='flex justify-between items-center text-[15px]'>
                      <p className='py-[3px] flex gap-[3px] items-center text-[#00000099]'>
                        <AiOutlineTag className='w-[16px] h-[16px]' />
                        <span className=''>{store.discountCode}</span>
                      </p>
                      <p>- {formatNumberAsPrice(store.storeDiscountValue - getStoreProductsDiscounts(store))}</p>
                    </div>
                  ))
                }
                {
                  cart.systemDiscountCode &&
                  <div className='flex justify-between items-center text-[15px]'>
                    <p className='py-[3px] flex gap-[3px] items-center text-[#00000099]'>
                      <AiOutlineTag className='w-[16px] h-[16px]' />
                      <span className=''>{cart.systemDiscountCode}</span>
                    </p>
                    <p>- {formatNumberAsPrice(cart.systemDiscountValue)}</p>
                  </div>
                }
              </div>
            </div>
          </div>
        )}

        {shippingFee !== undefined && (
          <div className='flex justify-between'>
            <div className=''>Delivery fee</div>
            <div className=''>{shippingFee === 0 ? <span>Free</span> :
              loading ?
                <div className="bg-[#00000014] w-[70px] h-[24px] rounded-[6px] animate-pulse"></div>
                :
                <span>{formatNumberAsPrice(shippingFee)}</span>
            }</div>
          </div>
        )}
      </div>

      {!!total && (
        <div className='flex justify-between border-t md:border-b-0 border-b border-[#E4E1DF] sm:text-[20px] text-[18px] sm:leading-[28px] leading-[24px] font-semibold md:pt-[24px] pt-[20px] md:pb-0 pb-[20px]'>
          <div className=''>Total</div>
          <div className="flex items-center gap-[8px]">
            {
              loading ?
                <div className="bg-[#00000014] w-[100px] h-[30px] rounded-[6px] animate-pulse"></div>
                :
                <p className={`font-semibold`}>
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
