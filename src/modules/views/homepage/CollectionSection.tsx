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
import { LuArrowRight } from 'react-icons/lu';

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
    'infinite',
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

  //yelow shades: #FEFBE8, #FACE33, red shades: #FFF3F1, #D4280C, blue shades: #EDF8FF, #1677FF

  return (
    <section
      className={`bg-#FEFBE8 radius-16 sm:p-24 p-20 flex flex-col md:gap-24 sm:gap-20 gap-24 w-full relative`}
    >
      <div className="flex flex-row j-content-between a-items-center gap-24">
        <div className='flex flex-col gap-2'>
          <h3 className="text-16 md:text-20 weight-600 md:line-height-28 line-height-24 color-#000000E0">
            {collection.name}
          </h3>
          <p className="color-#00000099 text-14 weight-400">
            {collection.description}
          </p>
        </div>

        {products?.length > 4 && (
          <Link
            href={'/'}
            className=""
          >
            <span className='w-36 h-36 bg-#FACE33 radius-999 flex flex-col a-items-center j-content-center'>
              <LuArrowRight className='w-20 h-20' />
            </span>

          </Link>
        )}

      </div>
      <div className="scroll-x no-scrollbar" ref={scrollRef1}>
        <div
          className={`flex h-fit ${products?.length && 'w-fit'
            } whitespace-nowrap gap-14`}
        >
          {products?.length ? (
            products?.map((product, i) => (
              <div
                key={i}
                className="l:w-290 md:w-250 sm:w-220 w-150 l:mt--20 mt--30"
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
