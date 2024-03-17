import React, { FC } from 'react'
import { ProductVariant } from '../../utility/types/product.interface'
import { CartItem } from '../../utility/types/cart.interface'
import { QuantitySelectorProps } from './QuantitySelector'


const QuantitySelector2: FC<QuantitySelectorProps> = ({ cartItem, increment, decrement }) => {
    return (
        <div className='flex bg-grey-200 w-fit px-27 py-17 radius-30 gap-40 text-green'>
            <button onClick={() => decrement()} className='text-18 bg-none border-none text-green'>-</button>
            <input type="number" className='w-40 border-none bg-none text-center bold text-22 text-green outline-none no-arrows' value={cartItem.quantity} readOnly />
            <button onClick={() => increment()} className='text-18 bg-none border-none text-green'>+</button>
        </div>
    )
}

export default QuantitySelector2
