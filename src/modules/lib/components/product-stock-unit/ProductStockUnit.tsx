import React, { useState } from 'react'
import { Product } from '../../utility/types/product.interface'
import { cx } from '../../utility/utility'

function ProductStockUnit({ product }: { product: Product }) {
    
    const [selectedSize, setSelectedSize] = useState('')

  function getStockUnitLabel (stockType: string) {
    switch (stockType) {
      case 'fabric':
        return 'Yards'
      case 'wears':
        return 'Unit'
      default:
        return false
    }
  }

  return (
    <>
      {product.availableUnit && (
        <div className='l:mt-40 mt-30 border-b border-green-100 pb-30'>
          <div className='text-grey-500 l:text-16 text-14 weight-500'>
            Select {getStockUnitLabel(product.type) || product.stockUnit}
          </div>
          <div className='mt-20 l:flex grid grid-3-cols-1fr gap-12'>
            {product.availableUnit.map((text, i) => (
              <label
                className={cx(
                  'flex gap-8 text-14 bg-#F3F3F3 color-#726C6C px-10 py-7 radius-8',
                  {
                    'bg-green-100! text-green!': text === selectedSize
                  }
                )}
              >
                <input
                  type='radio'
                  name='size'
                  onClick={() => setSelectedSize(text)}
                  className={cx('accent-green')}
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
