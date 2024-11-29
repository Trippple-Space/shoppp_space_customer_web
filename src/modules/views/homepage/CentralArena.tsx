"use client";

import React from 'react'
import ProductTile from '@/modules/lib/components/product-tile/ProductTile'
import { useProductListView } from '@/modules/lib/utility/hooks/views/use-product-list-view'
import {
  ICategory,
} from '@/modules/lib/utility/types/product.interface'

interface ICentralArena {
  selectedCategory: ICategory
}

const CentralArena = ({ selectedCategory }: ICentralArena) => {
  const { products, type, ref } = useProductListView()

  return (
    <>
      <section className='l:mt-20 mt-40 w-100p l:mt-50 mb-150'>
        <div className='flex space-between text-20 weight-300 uppercase'>
          <h3 className='text-14 l:text-20 weight-300 '>
            Top selling
          </h3>
        </div>
        <div className='grid xl:grid-5-cols-1fr l:grid-4-cols-1fr s:grid-3-cols-1fr grid-2-cols-1fr flex-wrap gap-15 l:gap-10 w-full relative'>
          {products.length ? (
            products.map((product, i: number) => (
              <ProductTile product={product} key={product.id} />
            ))
          ) : (
            <div className='mt-60 bg-white grid-col-span-5 text-center'>
              No products found for the selected filters
            </div>
          )}
        </div>
        <div ref={ref}>
          <p></p>
        </div>
      </section>
    </>
  );
};

export default CentralArena;