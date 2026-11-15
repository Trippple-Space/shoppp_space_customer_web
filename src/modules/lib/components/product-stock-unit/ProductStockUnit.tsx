import React, { useState } from 'react'
import { Product } from '../../utility/types/product.interface'
import { cx } from '../../utility/utility'

function ProductStockUnit ({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState('')

  function getStockUnitLabel (stockType: string) {
    const stockUnits: { [key: string]: string } = {
      fabric: 'Yards',
      wears: 'Unit'
    }

    return stockUnits[stockType] ?? 'Pieces'
  }

  return (
    <>
      {product.availableUnit && (
        <div className='lg:mt-[40px] mt-[30px] border-b border-brand-tint pb-[30px]'>
          <div className='text-[#A39F9C] lg:text-[16px] text-[14px] font-medium'>
            Select {product.stockUnit ?? getStockUnitLabel(product.type)}
          </div>
          <div className='mt-[20px] lg:flex grid grid-cols-3 gap-[12px]'>
            {product.availableUnit.map((text, i) => (
              <label
                className={cx(
                  'flex gap-[8px] text-[14px] bg-[#F3F3F3] text-[#726C6C] px-[10px] py-[7px] rounded-[8px]',
                  {
                    '!bg-brand-tint !text-brand': text === selectedSize
                  }
                )}
              >
                <input
                  type='radio'
                  name='size'
                  onClick={() => setSelectedSize(text)}
                  className={cx('accent-brand')}
                />
                <span className='whitespace-nowrap'>{text}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default ProductStockUnit
