import Link from 'next/link'
import React from 'react'
import { Product } from '../../utility/types/product.interface'
import { formatNumberAsPrice } from '../../utility/utility'
import Image from '../image/Image'

const SearchModal = ({ searchResults }: { searchResults: Product[] }) => {
  return (
    <>
      {searchResults && (
        <div className='mt-100 sm:mt-0 p-10 flex flex-col a-items-start w-100p h-80p sm:h-100p gap-10'>
          <p className='color-#00000099 text-left text-12'>Results</p>
          <div className='overflow-auto w-100p flex flex-col gap-15'>
            {searchResults.map(product => (
              <>
                <Link
                  href={`/products/${product.slug}`}
                  className='flex j-content-start gap-20'
                >
                  <Image
                    src={product?.variants?.[0]?.media?.[0]?.url}
                    alt={product.name}
                    className='w-50 h-50 radius-8 object-fit-cover'
                  />
                  <div className='flex flex-col a-items-start gap-10'>
                    <p className='color-#000000 text-left text-15 weight-500'>
                      {product.name}
                    </p>
                    <p className='weight-500 flex gap-10 a-items-center text-12'>
                      {formatNumberAsPrice(product?.variants?.[0]?.price)}
                      <span className='color-#00000099 font-inter weight-400 text-10'>
                        {product.stockUnit}
                      </span>
                    </p>
                  </div>
                </Link>
              </>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default SearchModal
