import React, { FC, useEffect, useState } from 'react'
import { ProductVariant } from '../../utility/types/product.interface'
import { CartItem } from '../../utility/types/cart.interface'
import { displayStockUnit } from '../../utility/utility'

export interface QuantitySelectorProps {
  cartItem: CartItem
  increment: () => void
  decrement: () => void
}

const QuantitySelector: FC<QuantitySelectorProps> = ({
  cartItem,
  increment,
  decrement
}) => {
  return (
    <div className='relative mb-10'>
      <div className='bg-green-400! text-white! text-10 bg-green-600 border border-green-900 weight-500 font-oblique w-fit px-10 py-3 radius-5 absolute l-0 b--16'>
        {displayStockUnit(cartItem.variant.stockUnit)}(s)
      </div>
      <div className='text-black border-green-900 border bg-white h-37 radius-5 flex a-items-center relative overflow-hidden w-fit'>
        <button
          onClick={() => decrement()}
          className='bg-green! text-white! bg-green active:bg-green-600 border-none weight-900 text-16 h-full focus:outline-none p-0 pointer w-32'
          data-action='minus'
          type='button'
        >
          -
        </button>
        <input
          className='bg-green-400! text-white! w-40 inline-block text-center weight-900 text-14 bg-green-400 @lo:border-none @hi:border-l @hi:border-r border-green-700 min-w-0 inline-block h-full focus:outline-none no-arrows'
          type='number'
          name='product-qty'
          min='0'
          max='10'
          value={cartItem.quantity}
          readOnly
        />
        <button
          onClick={() => increment()}
          className='bg-green! text-white! bg-green active:bg-green-600 border-none weight-900 text-16 h-full focus:outline-none p-0 pointer w-32'
          data-action='add'
          type='button'
        >
          +
        </button>
      </div>
    </div>
  )
}

export default QuantitySelector
