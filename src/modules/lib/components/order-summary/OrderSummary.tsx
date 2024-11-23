import React, { FC } from 'react'
import { formatNumberAsPrice } from '../../utility/utility'


interface IOrderSummary{
    subTotal: number,
    extraSavings: number,
    shippingFee?: number,
    total: any,
}

const OrderSummary: FC<IOrderSummary> = ({subTotal, extraSavings, shippingFee, total}) => {
    return(
        <div className='w-full'>
            <div className='weight-500 text-16'>Order Summary</div>
            <div className='text-13'>
                <div className='mt-15 flex space-between'>
                    <div className='text-muted'>Subtotal</div>
                    <div className='weight-500'>{formatNumberAsPrice(subTotal)}</div>
                </div>

                {!!extraSavings && <div className='mt-15 flex space-between'>
                    <div className='text-muted '>Extra savings</div>
                    <div className='weight-500'>-{formatNumberAsPrice(extraSavings)}</div>
                </div>
                }

                {!!shippingFee && <div className='mt-15 flex space-between'>
                    <div className='text-muted'>Delivery fee</div>
                    <div className='weight-400 '>{formatNumberAsPrice(shippingFee)}</div>
                </div>}

                {!!total && <div className='mt-15 flex space-between border-t border-grey-300 pt-15'>
                    <div className='text-muted '>Order total</div>
                    <div className='primary-green bold '>{formatNumberAsPrice(total)}</div>
                </div>}
            </div>
        </div>
    )
}

export default OrderSummary
