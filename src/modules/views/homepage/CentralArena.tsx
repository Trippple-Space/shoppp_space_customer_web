'use client';

import React, { useEffect, useState } from 'react';
import ProductTile from '@/modules/lib/components/product-tile/ProductTile';
import { useProductListView } from '@/modules/lib/utility/hooks/views/use-product-list-view';
import { DotsLoader } from '@/modules/lib/components/dots-loader/DotsLoader';
import PuffLoader from '@/modules/lib/components/puff-loader/PuffLoader';
import { useSavedVariant } from '@/modules/lib/utility/hooks/use-saved-variants';
import { toast } from 'sonner';
import Button from '@/modules/lib/components/button/Button';
import { useSearchParams } from 'next/navigation';
import NoResultMessage from '@/modules/lib/components/error-messages/no-result-found';

const CentralArena = ({ selectedCategory, setSelectedCategory, hasCollections, collectionsLoaded }: any) => {
  const searchParams = useSearchParams();

  const {
    products,
    type,
    ref,
    loading,
    fetchingError,
    refetch,
    setSearch,
    search,
    setCollection,
  } = useProductListView();
  const { saveVariant, savedVariants, removeSavedVariant } = useSavedVariant();
  const [openReviewId, setOpenReviewId] = useState<string | null>(null);
  const renderedIds = new Set<string>();

  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    const collectionFromUrl = searchParams.get('collection');

    setSearch(searchFromUrl || '');
    setCollection(collectionFromUrl || '');
  }, [searchParams]);

  useEffect(() => {
    const handleGoogleLogin = () => {
      toast.success('Login Successful');
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('googleLoginSuccessful', handleGoogleLogin);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('googleLoginSuccessful', handleGoogleLogin);
      }
    };
  }, []);

  return (
    <>
      <section className="md:mt-32 mt-24 w-100p mb-150 pb-90">
        <div className="flex space-between text-20 weight-300 capitalize">
          <h3 className="text-16 md:text-20 weight-600 md:line-height-28 line-height-24 color-#000000E0">
            {hasCollections ? 'Products' : 'Products'}
          </h3>
        </div>

        {products.length === 0 && loading ? (
          <div className="w-100p flex j-content-center mt-10">
            <DotsLoader />
          </div>
        ) : products.length ? (
          <div className="grid xxlgrid-5-cols xl:grid-4-cols-1fr s:grid-3-cols-1fr grid-2-cols-1fr flex-wrap gap-18 s:gap-20 md:gap-24 w-full relative">
            {products.map((product, index) => {
              if (renderedIds.has(product.id)) return null;
              renderedIds.add(product.id);
              return (
                <ProductTile
                  product={product}
                  key={product.id}
                  savedVariants={savedVariants}
                  saveVariant={saveVariant}
                  removeSavedVariant={removeSavedVariant}
                  id={product.id}
                  isOpen={openReviewId}
                  setIsOpen={setOpenReviewId}
                  index={index}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              );
            })}
          </div>
        ) : fetchingError ? (
          <div className="mt-60 bg-white grid-col-span-5 text-center">
            <p className="mb-12">{fetchingError.message}</p>

            <Button onClick={refetch} className="px-16 py-8 w-100p! max-w-100">
              Retry
            </Button>
          </div>
        ) : (
          <div className="mt-60 bg-white grid-col-span-5 text-center">
            <NoResultMessage
              textContent={`It seems we can’t find any results based on your ${search ? 'search.' : 'filters.'}`}
              contentTitle="No results found"
            />
          </div>
        )}

        {products.length > 0 && !fetchingError && !loading && (
          <div ref={ref} className="h-20"></div>
        )}
        <div>
          <p className="w-100p flex j-content-center mt-10">
            {products.length >= 20 && loading ? <PuffLoader /> : ''}
          </p>
          {products.length >= 20 && !loading && fetchingError && (
            <div className="mt-60 bg-white grid-col-span-5 text-center">
              <p className="mb-12">{fetchingError.message}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CentralArena;
