import React, { FC } from 'react'
import { ProductVariant } from '../../utility/types/product.interface'
import { CartItem } from '../../utility/types/cart.interface'

interface QuantitySelectorProps {
    cartItem: CartItem;
    increment: () => void;
    decrement: () => void;
}

const QuantitySelector: FC<QuantitySelectorProps> = ({ cartItem, increment, decrement }) => {
    return (
        <div className='relative mb-10'>
            <div className='text-10 bg-yellow-600 weight-500 font-oblique w-fit px-10 py-3 radius-5 absolute r-0 b--16'>{cartItem.variant.stockUnit}(s)</div>          
            <div className="text-black bg-white h-38 radius-5 flex a-items-center relative overflow-hidden">
                <button onClick={() => decrement()} className="bg-yellow active:bg-yelow-600 border-none weight-900 text-16 h-full focus:outline-none p-0 pointer w-32" data-action="minus" type="button">-</button>
                <input className="w-40 inline-block text-center weight-900 text-14 bg-yellow-400 @lo:border-none @hi:border-l @hi:border-r border-yellow-700 min-w-0 inline-block h-full focus:outline-none no-arrows" type="number" name="product-qty" min="0" max="10" value={cartItem.quantity} readOnly />
                <button onClick={() => increment()} className="bg-yellow active:bg-yelow-600 border-none weight-900 text-16 h-full focus:outline-none p-0 pointer w-32" data-action="add" type="button">+</button>
            </div>  
        </div>
    )
}

export default QuantitySelector
