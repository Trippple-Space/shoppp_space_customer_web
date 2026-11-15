import React, { FC } from 'react';
import { DotsLoader } from '@/modules/lib/components/dots-loader/DotsLoader';
import ProductTile from '@/modules/lib/components/product-tile/ProductTile';
import { ProductTileGalleryProvider } from '@/modules/lib/components/product-tile/ProductTileGalleryContext';
import {
  ICategory,
  Product,
} from '@/modules/lib/utility/types/product.interface';
import { Store } from '@/modules/lib/utility/types/store.interface';
import StorePagination from '@/modules/lib/components/pagination/StorePagination';
import NoResultMessage from '@/modules/lib/components/error-messages/no-result-found';
import { useSavedVariant } from '@/modules/lib/utility/hooks/use-saved-variants';
import DataFetchErrorPanel from '@/modules/lib/components/data-fetch-error/DataFetchErrorPanel';
import {
  classifyFetchError,
  getProductFetchErrorCopy,
} from '@/modules/lib/utility/fetch-error';

const StoreProductsList: FC<{
  products: Product[];
  store: Store;
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  selectedCategory?: ICategory;
  setSelectedCategory?: (category: ICategory) => void;
  fetchingError?: Error | null;
  onRetry?: () => void;
}> = ({
  products,
  store,
  loading,
  page,
  totalPages,
  onPageChange,
  selectedCategory,
  setSelectedCategory,
  fetchingError,
  onRetry,
}) => {
  const { saveVariant, savedVariants, removeSavedVariant } = useSavedVariant();

  const showInitialLoader = loading && products.length === 0;
  const showFatalError = !!fetchingError && !loading && products.length === 0;
  const errorKind = fetchingError ? classifyFetchError(fetchingError) : 'unknown';
  const errorCopy = getProductFetchErrorCopy(errorKind);

  return (
    <>
      {showInitialLoader ? (
        <div className="w-full flex justify-center mt-[10px]">
          <DotsLoader />
        </div>
      ) : showFatalError ? (
        <div className="mt-[24px] w-full">
          <DataFetchErrorPanel
            title={errorCopy.title}
            description={errorCopy.description}
            onRetry={onRetry}
          />
        </div>
      ) : products.length ? (
        <ProductTileGalleryProvider products={products}>
          <div className="grid xxlgrid-5-cols xl:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-[18px] sm:gap-[20px] md:gap-[24px] w-full">
            {products.map((product, i) => (
              <div key={i} className="lg:-mt-[20px] -mt-[30px] w-full overflow-hidden">
                <ProductTile
                  product={product}
                  key={i}
                  id={product.id}
                  addToCartVariant="icon"
                  savedVariants={savedVariants}
                  saveVariant={saveVariant}
                  removeSavedVariant={removeSavedVariant}
                  isStoreBased={true}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              </div>
            ))}
          </div>
        </ProductTileGalleryProvider>
      ) : (
        <div className="mt-[60px] col-span-5 text-center bg-white">
          <NoResultMessage
            textContent={`It seems we can’t find any results based on your filters.`}
            contentTitle="No results found"
          />
        </div>
      )}

      {!loading && totalPages > 1 && (
        <StorePagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          loading={loading}
        />
      )}
    </>
  );
};

export default StoreProductsList;
