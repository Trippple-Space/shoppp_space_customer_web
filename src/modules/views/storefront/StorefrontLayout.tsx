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
}) => {
    return (
      <div className='h-full flex flex-col justify-end'>
        <div className="flex flex-col md:gap-36 sm:gap-28 gap-32 pb-100 flex-grow-1">
          <div className="">{children}</div>

          {!!categories?.length && (
            <div className="sm:py-20 py-16 max-w-1440 mx-auto">
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

          <section className="flex flex-col sm:gap-24 gap-20 app-width max-w-1440 mx-auto">
            <div className="flex flex-row j-content-between a-items-center">
              <h3 className="sm:text-24 text-16 weight-600">Featured products</h3>
              {products?.length > 4 && (
                <Link
                  href={'/'}
                  className="text-16 flex flex-row a-items-center gap-3"
                >
                  <span className="sm:inline-block hidden">
                    Browse all products
                  </span>
                  <GoArrowRight className="w-16 h-16 sm:mb--2" />
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
            />
          </section>
        </div>
        <StorefrontFooter store={store} />
      </div>
    );
  };

export default StorefrontLayout;