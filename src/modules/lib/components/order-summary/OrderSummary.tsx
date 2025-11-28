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
    <div className='w-full flex flex-col md:gap-15 gap-20 md:pb-0 pb-12 md:pt-0 sm:pt-12 pt-56'>

      <div className='flex flex-col gap-16 text-16 line-height-24 weight-400 color-#000000E0'>
        <div className='flex space-between sm:pt-0 pt-16'>
          <div className=''>Subtotal</div>
          <div className="flex a-items-center gap-8">

            {

              <p className={`weight-400`}>
                {formatNumberAsPrice(subTotal - totalProductDiscounts())}
              </p>
            }

          </div>
        </div>

        <div className='flex space-between'>
          <div className=''>Promo Code</div>
          <div className='color-#1677FF underline pointer' onClick={() =>
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
                  className="h-41 block font-inter px-10 w-full flex flex-col a-items-center pb-4
            @lo:border-solid @lo:border-1 @lo:border-grey-300 @lo:weight-400 @lo:outline-none
            @lo:placeholder:text-grey-400 @lo:radius-6
            @lo:focus:border-green @lo:placeholder:text-12 flex-grow-1"

                  value={discountCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiscountCode(e.target.value)}

                />
                <div className=""
                  onClick={() =>
                    handleApplyDiscount(discountCode)
                  }
                >
                  <Button disabled={applyingCode || discountCode.length <= 4} className="flex flex-col j-content-center a-items-center h-40">{applyingCode ? "Processing..." : "Apply"}</Button>
                </div>
              </div>

            </>
          )
        }

        {orderDiscount && (
          <div className=''>
            <div>
              <div className=''>Discounts</div>
              <div className='flex flex-col gap-3'>
                {
                  cart?.storeGroups?.map((store) => (
                    store.discountCode &&
                    <div key={store.id} className='flex space-between a-items-center text-15'>
                      <p className='py-3 flex gap-3 a-items-center color-#00000099'>
                        <AiOutlineTag className='w-16 h-16' />
                        <span className=''>{store.discountCode}</span>
                      </p>
                      <p>- {formatNumberAsPrice(store.storeDiscountValue - getStoreProductsDiscounts(store))}</p>
                    </div>
                  ))
                }
                {
                  cart.systemDiscountCode &&
                  <div className='flex space-between a-items-center text-15'>
                    <p className='py-3 flex gap-3 a-items-center color-#00000099'>
                      <AiOutlineTag className='w-16 h-16' />
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
          <div className='flex space-between'>
            <div className=''>Delivery fee</div>
            <div className=''>{shippingFee === 0 ? <span>Free</span> :
              loading ?
                <div className="bg-#00000014 w-70 h-24 radius-6 animate-pulse"></div>
                :
                <span>{formatNumberAsPrice(shippingFee)}</span>
            }</div>
          </div>
        )}
      </div>

      {!!total && (
        <div className='flex space-between border-t md:border-b-0 border-b border-grey-300 sm:text-20 text-18 sm:line-height-28 line-height-24 weight-600 md:pt-24 pt-20 md:pb-0 pb-20'>
          <div className=''>Total</div>
          <div className="flex a-items-center gap-8">
            {
              loading ?
                <div className="bg-#00000014 w-100 h-30 radius-6 animate-pulse"></div>
                :
                <p className={`weight-600`}>
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
