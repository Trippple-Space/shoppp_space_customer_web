'use client';
import StorefrontFooter from '@/modules/lib/components/footer/StorefrontFooter';
import FabricsCategoryNav from '@/modules/lib/components/nav-bar/category-nav/FabricsCategoryNav';
import {
  ICategory,
  Product,
} from '@/modules/lib/utility/types/product.interface';
import { Store } from '@/modules/lib/utility/types/store.interface';
import { ICollection } from '@/modules/lib/utility/types/collection.interface';
import { FC, ReactNode } from 'react';
import StoreProductsList from './StoreProductsList';
import Link from 'next/link';
import { GoArrowRight } from 'react-icons/go';
import Collections from '../homepage/Collections';

const StorefrontLayout: FC<{
  store: Store;
  children: ReactNode;
  loading: boolean;
  products: Product[];
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  initialCollections?: ICollection[];
  initialCategories?: ICategory[];
  showCollectionsSection?: boolean;
  categories: ICategory[];
  selectedCategory: ICategory;
  setSelectedCategory: (category: ICategory) => void;
  fetchingError?: Error | null;
  onProductsRetry?: () => void;
}> = ({
  store,
  children,
  products,
  loading,
  page,
  setPage,
  totalPages,
  initialCollections = [],
  initialCategories = [],
  showCollectionsSection = true,
  categories,
  selectedCategory,
  setSelectedCategory,
  fetchingError,
  onProductsRetry,
}) => {
    return (
      <div className='h-full flex flex-col justify-end'>
        <div className="flex flex-col md:gap-[36px] sm:gap-[28px] gap-[32px] pb-[100px] grow">
          <div className="">{children}</div>

          {!!categories?.length && (
            <div className="sm:py-[20px] py-[16px] max-w-[1440px] w-full mx-auto">
              <FabricsCategoryNav
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                page={'store'}
                key={categories}
              />
            </div>
          )}

          {showCollectionsSection && (
            <Collections
              storeId={store.id}
              initialCollections={initialCollections}
              isStoreBased={true}
            />
          )}

          <section className="flex flex-col sm:gap-[24px] gap-[20px] app-width max-w-[1440px] mx-auto">
            <div className="flex flex-row justify-between items-center">
              <h3 className="sm:text-[24px] text-[16px] font-semibold">Featured products</h3>
              {products?.length > 4 && (
                <Link
                  href={'/'}
                  className="text-[16px] flex flex-row items-center gap-[3px]"
                >
                  <span className="sm:inline-block hidden">
                    Browse all products
                  </span>
                  <GoArrowRight className="w-[16px] h-[16px] sm:-mb-[2px]" />
                </Link>
              )}
            </div>

            <StoreProductsList
              products={products}
              store={store}
              loading={loading}
              page={page}
              onPageChange={setPage}
              totalPages={totalPages}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              fetchingError={fetchingError}
              onRetry={onProductsRetry}
            />
          </section>
        </div>
        <StorefrontFooter store={store} />
      </div>
    );
  };

export default StorefrontLayout;