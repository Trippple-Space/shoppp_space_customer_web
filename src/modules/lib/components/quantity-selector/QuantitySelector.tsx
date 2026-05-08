import React, { FC, useEffect, useState } from 'react'
import { ProductVariant } from '../../utility/types/product.interface'
import { CartItem } from '../../utility/types/cart.interface'
import { displayStockUnit } from '../../utility/utility'
import { GoDash, GoPlus } from 'react-icons/go'
import { PiMinus, PiPlus, PiTrashSimple } from 'react-icons/pi'

export interface QuantitySelectorProps {
  cartItem: CartItem
  increment: () => void
  decrement: () => void
  disabled?: boolean
}

const QuantitySelector: FC<QuantitySelectorProps> = ({
  cartItem,
  increment,
  decrement,
  disabled = false,
}) => {
  return (
    <div className='relative mb-10'>
      <div className='bg-#FACE33 text-black text-10 border border-rgba(245,245,245,0.9) weight-500 font-oblique w-fit px-10 py-3 radius-5 absolute s:l-18 l-20 s:b--20 b--18'>
        {displayStockUnit(cartItem.variant.stockUnit)}{cartItem.quantity > 1 && "s"}
      </div>
      <div className='text-black bg-rgba(245,245,245,0.9) flex a-items-center relative w-fit s:p-4 p-3 gap-10 radius-999'>
        <button
          onClick={() => { if (!disabled) decrement() }}
          disabled={disabled}
          className='bg-#FACE33 active:bg-#e8b915! border-none shadow-0-4-8-0-#00000033 hover:shadow-0-5-8-0-#00000033 hover:scale-1.03 g|transition:0.5s g|will-change:transform focus:outline-none pointer s:p-8 p-6 flex a-items-center j-items-center gap-10 round disabled:opacity-60 disabled:cursor-not-allowed'
          data-action='minus'
          type='button'
        >
          {cartItem?.quantity ===
            cartItem?.variant?.minPurchaseQuantity ? (
            <PiTrashSimple className='s:w-24 w-22 s:h-24 h-22' />
          ) : (
            <PiMinus className='s:w-24 w-22 s:h-24 h-22' />
          )}
        </button>
        <p className='w-fit inline-block text-center weight-500 bg-transparent s:text-18 text-16 @lo:border-none inline-block h-full focus:outline-none no-arrows'>{cartItem.quantity}</p>

        <button
          onClick={() => { if (!disabled) increment() }}
          disabled={disabled}
          className='bg-#FACE33 active:bg-#e8b915! border-none shadow-0-4-8-0-#00000033 hover:shadow-0-5-8-0-#00000033 hover:scale-1.03 g|transition:0.5s g|will-change:transform focus:outline-none pointer s:p-8 p-6 flex a-items-center j-items-center gap-10 round disabled:opacity-60 disabled:cursor-not-allowed'
          data-action='add'
          type='button'
        >
          <PiPlus className='s:w-24 w-22 s:h-24 h-22' />
        </button>
      </div>
    </div>
  )
}

export default QuantitySelector
