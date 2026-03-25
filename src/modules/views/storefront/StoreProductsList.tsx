import React, { FC } from 'react';
import { DotsLoader } from '@/modules/lib/components/dots-loader/DotsLoader';
import ProductTile from '@/modules/lib/components/product-tile/ProductTile';
import {
  ICategory,
  Product,
} from '@/modules/lib/utility/types/product.interface';
import { Store } from '@/modules/lib/utility/types/store.interface';
import StorePagination from '@/modules/lib/components/pagination/StorePagination';
import NoResultMessage from '@/modules/lib/components/error-messages/no-result-found';
import { useSavedVariant } from '@/modules/lib/utility/hooks/use-saved-variants';

const StoreProductsList: FC<{
  products: Product[];
  store: Store;
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  selectedCategory?: ICategory;
  setSelectedCategory?: (category: ICategory) => void;
}> = ({
  products,
  store,
  loading,
  page,
  totalPages,
  onPageChange,
  selectedCategory,
  setSelectedCategory,
}) => {
  const { saveVariant, savedVariants, removeSavedVariant } = useSavedVariant();

  return (
    <>
      {loading ? (
        <div className="w-100p flex j-content-center mt-10">
          <DotsLoader />
        </div>
      ) : products.length ? (
        <div className="grid xxlgrid-5-cols xl:grid-4-cols-1fr s:grid-3-cols-1fr grid-2-cols-1fr gap-18 s:gap-20 md:gap-24 w-full">
          {products.map((product, i) => (
            <div key={i} className="l:mt--20 mt--30 w-full overflow-hidden">
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
      ) : (
        <div className="mt-60 grid-col-span-5 text-center bg-white">
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
