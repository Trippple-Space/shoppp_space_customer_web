'use client'

import React, { useEffect, useState } from 'react'
import ProductTile from '@/modules/lib/components/product-tile/ProductTile'
import { useProductListView } from '@/modules/lib/utility/hooks/views/use-product-list-view'
import { DotsLoader } from '@/modules/lib/components/dots-loader/DotsLoader';
import PuffLoader from '@/modules/lib/components/puff-loader/PuffLoader'
import { useSavedVariant } from '@/modules/lib/utility/hooks/use-saved-variants';
import useReviews from '@/modules/lib/utility/hooks/use-reviews';


const CentralArena = () => {
  const { products, type, ref, loading } = useProductListView()
  const { allReviews, allLoading: reviewsLoading } = useReviews()
  const { saveVariant, savedVariants, removeSavedVariant } = useSavedVariant();
  const [openReviewId, setOpenReviewId] = useState<number | null>(null);
  const renderedIds = new Set<number>();

  return (
    <>
      <section className='md:mt-32 mt-24 w-100p mb-150 pb-90'>
        <div className='flex space-between text-20 weight-300 capitalize'>
          <h3 className='text-16 md:text-20 weight-600 md:line-height-28 line-height-24 color-#000000E0'>
            Top selling
          </h3>
        </div>
        {/* {
          products.length ?
            <PuffLoader /> :
          <div className='grid xxlgrid-5-cols xl:grid-4-cols-1fr s:grid-3-cols-1fr grid-2-cols-1fr flex-wrap gap-18 s:gap-20 md:gap-24 w-full relative'>
            {products.length ? (
              products.map((product) => {
                if (renderedIds.has(product.id)) {
                  return null;
                }
                renderedIds.add(product.id);
                return <ProductTile product={product} key={product.id} />;
              })
            ) : (
              <div className='mt-60 bg-white grid-col-span-5 text-center'>
                No products found for the selected filters
              </div>
            )}
          </div>
        } */}

        {
          <>
            {
              (!products.length && loading && reviewsLoading) ?
                <div className='w-100p flex j-content-center mt-10'>
                  <DotsLoader />
                </div>
                :
                products.length ?
                  <div className='grid xxlgrid-5-cols xl:grid-4-cols-1fr s:grid-3-cols-1fr grid-2-cols-1fr flex-wrap gap-18 s:gap-20 md:gap-24 w-full relative'>
                    {
                      products.map((product) => {
                        if (renderedIds.has(product.id)) {
                          return null;
                        }
                        renderedIds.add(product.id);
                        return <ProductTile
                          product={product}
                          key={product.id}
                          savedVariants={savedVariants}
                          saveVariant={saveVariant}
                          removeSavedVariant={removeSavedVariant}
                          reviews={allReviews.filter((review) => review.productVariantId === product.id)}
                          id={product.id}
                          isOpen={openReviewId}
                          setIsOpen={setOpenReviewId}
                        />;
                      })
                    }
                  </div>
                  :
                  <div className='mt-60 bg-white grid-col-span-5 text-center'>
                    No products found for the selected filters
                  </div>
            }
          </>
        }


        <div ref={ref}>
          <p className='w-100p flex j-content-center mt-10'>
            {(products.length && loading) ? <PuffLoader /> : ""}
          </p>
        </div>
      </section>
    </>
  )
}

export default CentralArena
