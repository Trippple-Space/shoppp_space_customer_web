import React, { FC } from 'react'
import { CartItem } from '../../utility/types/cart.interface'
import { displayStockUnit } from '../../utility/utility'
import { PiMinus, PiPlus, PiTrashSimple } from 'react-icons/pi'
import SpinLoader from '../spin-loader/SpinLoader'

export interface QuantitySelectorProps {
  cartItem: CartItem
  increment: () => void
  decrement: () => void
  disabled?: boolean
  busy?: boolean
}

const QuantitySelector: FC<QuantitySelectorProps> = ({
  cartItem,
  increment,
  decrement,
  disabled = false,
  busy = false,
}) => {
  const isLocked = disabled || busy

  return (
    <div className='relative mb-[10px]'>
      <div className='bg-[#FACE33] text-black text-[10px] border border-rgba(245,245,245,0.9) font-medium font-oblique w-fit px-[10px] py-[3px] rounded-[5px] absolute sm:left-[18px] left-[20px] sm:-bottom-[20px] -bottom-[18px]'>
        {displayStockUnit(cartItem.variant.stockUnit)}{cartItem.quantity > 1 && "s"}
      </div>
      <div className='text-black bg-rgba(245,245,245,0.9) flex items-center relative w-fit sm:p-[4px] p-[3px] gap-[10px] rounded-[999px]'>
        <button
          onClick={() => { if (!isLocked) decrement() }}
          disabled={isLocked}
          className='bg-[#FACE33] active:!bg-[#e8b915] border-none shadow-0-4-8-0-#00000033 hover:shadow-0-5-8-0-#00000033 hover:scale-1.03 transition-all duration-500 will-change-transform focus:outline-none cursor-pointer sm:p-[8px] p-[6px] flex items-center justify-items-center gap-[10px] rounded-full disabled:opacity-60 disabled:cursor-not-allowed'
          data-action='minus'
          type='button'
        >
          {cartItem?.quantity ===
            cartItem?.variant?.minPurchaseQuantity ? (
            <PiTrashSimple className='sm:w-[24px] w-[22px] sm:h-[24px] h-[22px]' />
          ) : (
            <PiMinus className='sm:w-[24px] w-[22px] sm:h-[24px] h-[22px]' />
          )}
        </button>
        <p className='w-[20px] sm:w-[24px] inline-flex items-center justify-center text-center font-medium bg-transparent sm:text-[18px] text-[16px] border-none h-full focus:outline-none no-arrows'>
          {busy ? (
            <SpinLoader size={16} color="#111111" trackColor="rgba(0,0,0,0.2)" thickness={3} />
          ) : (
            cartItem.quantity
          )}
        </p>

        <button
          onClick={() => { if (!isLocked) increment() }}
          disabled={isLocked}
          className='bg-[#FACE33] active:!bg-[#e8b915] border-none shadow-0-4-8-0-#00000033 hover:shadow-0-5-8-0-#00000033 hover:scale-1.03 transition-all duration-500 will-change-transform focus:outline-none cursor-pointer sm:p-[8px] p-[6px] flex items-center justify-items-center gap-[10px] rounded-full disabled:opacity-60 disabled:cursor-not-allowed'
          data-action='add'
          type='button'
        >
          <PiPlus className='sm:w-[24px] w-[22px] sm:h-[24px] h-[22px]' />
        </button>
      </div>
    </div>
  )
}

export default QuantitySelector
