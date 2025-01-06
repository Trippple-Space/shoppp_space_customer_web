import { formatNumberAsPrice } from '@/modules/lib/utility/utility'
import React from 'react'
import Image from '../image/Image'

function orderedProductCard ({ orderedProducts }: any) {
  return (
    <>
      <div className='flex flex-col gap-10'>
        {orderedProducts?.cart.cartItems.map((item: any) => (
          <>
            <div className='bg-whitesmoke radius-5 p-10 l:flex space-between a-items-start'>
              <div className='flex gap-10 l:w-60p w-90p'>
                <Image
                  src={item?.variant.media[0].url}
                  alt={item.variant?.product?.name || ''}
                  className='w-60 h-60 radius-8 object-fit-cover'
                />
                <div className='flex flex-col gap-10 pb-10 l:pb-0'>
                  <div className='flex flex-col gap-3'>
                    <p className='weight-600 text-14 w-fit'>
                      {item.variant.product?.name}
                    </p>
                    <p className='color-#0000008C text-12'>
                      {item.variant.product?.store.name}
                    </p>
                  </div>
                  <div className='flex flex-col gap-5'>
                    {' '}
                    <p className='color-#0000008C text-14 w-fit'>
                      Size: {item.variant.product?.stockUnit}
                    </p>
                    <p className='color-#0000008C text-14'>
                      Color: {item.variant.properties.color}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className='flex space-between flex-row-reverse
 l:grid gap-5 pt-5 border-t border-t-#00000014 l:border-none'
              >
                <p className='text-14 weight-500'>
                  {formatNumberAsPrice(item.totalPrice)}
                </p>
                <p className='text-12 text-right'> X {item.quantity}</p>
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  )
}

export default orderedProductCard