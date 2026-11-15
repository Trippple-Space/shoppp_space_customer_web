import { Product } from '@/modules/lib/utility/types/product.interface'
import React, { FC } from 'react'

interface IBuyBox {
    product: Product
}

const BuyBox: FC<IBuyBox> = ({product}) => {
  return (
    <div className=''>
        <div className='text-[20px] font-medium'>{product.name}</div>
    </div>
  )
}

export default BuyBox