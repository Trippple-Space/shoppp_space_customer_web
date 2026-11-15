import React, { FC } from 'react'
import { ProductVariant } from '../../utility/types/product.interface'
import { CartItem } from '../../utility/types/cart.interface'
import { QuantitySelectorProps } from './QuantitySelector'

const QuantitySelector2: FC<QuantitySelectorProps> = ({
  cartItem,
  increment,
  decrement
}) => {
  return (
    <div className='flex bg-[#F5F3F1] w-fit px-[27px] py-[17px] rounded-[30px] gap-[40px] text-brand'>
      <button
        onClick={() => decrement()}
        className='text-[18px] bg-transparent border-none text-brand font-semibold'
      >
        -
      </button>
      <input
        type='number'
        className='w-[40px] border-none bg-transparent text-center font-bold lg:text-[22px] text-[18px] text-brand outline-none no-arrows'
        value={cartItem.quantity}
        readOnly
      />
      <button
        onClick={() => increment()}
        className='text-[18px] bg-transparent border-none text-brand font-semibold'
      >
        +
      </button>
    </div>
  )
}

export default QuantitySelector2
