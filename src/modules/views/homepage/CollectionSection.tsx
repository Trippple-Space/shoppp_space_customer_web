import {
  IQueryParams,
  useProducts,
} from '@/modules/lib/utility/hooks/use-products';
import ProductTile from '@/modules/lib/components/product-tile/ProductTile';
import ScrollButtons from '@/modules/lib/components/scroll-buttons/scrollButtons';
import Link from 'next/link';
import { MdChevronRight } from 'react-icons/md';
import { useEffect, useRef } from 'react';
import { ICollection } from '@/modules/lib/utility/types/collection.interface';
import { useFilterStore } from '@/modules/lib/utility/store/filter.store';
import { useCategories } from '@/modules/lib/utility/hooks/use-categories';
import { usePathname } from 'next/navigation';

interface Props {
  collection: ICollection;
}

const CollectionSection = ({ collection }: Props) => {
  const scrollRef1 = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const type = pathname.includes('wears') ? 'wears' : 'fabrics';

  const { selectedCategory, setSelectedCategory } = useCategories({
    type,
    storeId: '',
    label: 'GLOBAL',
  });
  const { allFilters } = useFilterStore();
  const { products, loading, query, updateHomePageFilter } = useProducts(
    {
      pagination: { page: 1, limit: 10 },
    },
    collection.slug
  );

  useEffect(() => {
    const updatedFilters = {
      ...allFilters,
      tags:
        selectedCategory.name === 'All'
          ? ''
          : selectedCategory.name.toLowerCase(),
    };

    updateHomePageFilter(updatedFilters);
  }, [
    allFilters,
    JSON.stringify(query.allFilters),
    JSON.stringify(query.filters),
    selectedCategory.name,
  ]);

  if (loading || !products.length) return null;

  return (
    <section
      className={`bg-#FEFBE8 radius-16 sm:p-24 p-20 flex flex-col md:gap-24 sm:gap-20 gap-24 w-full relative`}
    >
      <div className="flex flex-row j-content-between a-items-center">
        <h3 className="sm:text-24 text-20 weight-600 color-#000000E0">
          {collection.name}
        </h3>

        {products?.length > 4 && (
          <Link
            href={'/'}
            className="bg-black text-white sm:py-8 py-6 px-14 flex flex-row a-items-center gap-6 radius-6"
          >
            <span className="sm:text-16 text-14 weight-600">View more</span>
            <MdChevronRight className="w-16 h-16 sm:inline hidden" />
          </Link>
        )}
      </div>
      <div className="scroll-x no-scrollbar" ref={scrollRef1}>
        <div
          className={`flex h-fit ${
            products?.length && 'w-fit'
          } whitespace-nowrap gap-14`}
        >
          {products?.length ? (
            products?.map((product, i) => (
              <div
                key={i}
                className="l:w-238 md:w-230 sm:w-220 w-150 l:mt--20 mt--30"
              >
                <ProductTile product={product} key={i} id={product.id} />
              </div>
            ))
          ) : (
            <div className="mt-60 text-center flex-grow-1">
              No products found for {collection.name}
            </div>
          )}
        </div>
      </div>
      <ScrollButtons
        scrollRef={scrollRef1}
        page={'productScroll'}
        scrollLength={products.length}
        component={'products'}
      />
    </section>
  );
};

export default CollectionSection;
