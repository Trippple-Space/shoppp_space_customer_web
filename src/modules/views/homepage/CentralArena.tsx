'use client'

import React from 'react'
import ProductTile from '@/modules/lib/components/product-tile/ProductTile'
import { useProductListView } from '@/modules/lib/utility/hooks/views/use-product-list-view'
import PuffLoader from '@/modules/lib/components/puff-loader/PuffLoader'

const CentralArena = () => {
  const { products, type, ref } = useProductListView()
  const renderedIds = new Set<number>()

  return (
    <>
      <section className='md:mt-32 mt-24 w-100p l:mt-50 mb-150 pb-90'>
        <div className='flex space-between text-20 weight-300 uppercase'>
          <h3 className='text-14 l:text-20 weight-300 '>Top selling</h3>
        </div>
        <div className='grid xl:grid-5-cols-1fr l:grid-4-cols-1fr s:grid-3-cols-1fr grid-2-cols-1fr flex-wrap gap-15 l:gap-10 w-full relative'>
          {products.length ? (
            products.map(product => {
              if (renderedIds.has(product.id)) {
                return null
              }
              renderedIds.add(product.id)
              return <ProductTile product={product} key={product.id} />
            })
          ) : (
            <div className='mt-60 bg-white grid-col-span-5 text-center'>
              No products found for the selected filters
            </div>
          )}
        </div>

        <div ref={ref}>
          <p className='w-100p flex j-content-center mt-10'>
            {products.length > 0 && <PuffLoader />}
          </p>
        </div>
      </section>
    </>
  )
}

export default CentralArena
