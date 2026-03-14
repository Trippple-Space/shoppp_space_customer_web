import {
  useProducts,
} from '@/modules/lib/utility/hooks/use-products';
import ProductTile from '@/modules/lib/components/product-tile/ProductTile';
import ScrollButtons from '@/modules/lib/components/scroll-buttons/scrollButtons';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ICollection } from '@/modules/lib/utility/types/collection.interface';
import { useFilterStore } from '@/modules/lib/utility/store/filter.store';
import { useCategories } from '@/modules/lib/utility/hooks/use-categories';
import { usePathname, useRouter } from 'next/navigation';
import { LuArrowRight } from 'react-icons/lu';
import { filtersToSearchParams } from '@/modules/lib/utility/utility';

const sectionThemes = [
  { bg: "#FEFBE8", button: "#FACE33", text: 'black' }, // yellow
  { bg: "#FFF3F1", button: "#D4280C", text: 'white' }, // red
  { bg: "#EDF8FF", button: "#1677FF", text: 'white' }, // blue
  { bg: "#F4F0FF", button: "#7B61FF", text: 'white' }, // purple
  { bg: "#ECFFF6", button: "#00B96B", text: 'white' }, // green
];

interface Props {
  collection: ICollection;
  index: number;
  setSelectedCollection: (coll: string) => void
  selectedCollection: string | null
}

const CollectionSection = ({ collection, index, selectedCollection, setSelectedCollection }: Props) => {
  const scrollRef1 = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  const theme = sectionThemes[index % sectionThemes.length];
  const type = pathname.includes('wears') ? 'wears' : 'fabrics';

  const { selectedCategory, setSelectedCategory } = useCategories({
    type,
    storeId: '',
    label: 'GLOBAL',
  });
  const { allFilters } = useFilterStore();

  const { products, loading, query, updateHomePageFilter } = useProducts(
    {
      filters: { type, status: { In: "ACTIVE,OUT_OF_STOCK" }, channel: "ASOEBI_STORE" }, order: {
        priorityScore: "DESC"
      },
      pagination: { page: 1, limit: 11 },
    },
    'infinite',
    collection.slug,
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

  const handleShowMore = (collection?: string) => {
    const params = filtersToSearchParams(allFilters, selectedCategory);

    if (collection) {
      params.set('collection', collection);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  if (loading || !products.length) return null;

  return (
    <section
      style={{ background: theme.bg }}
      className={`radius-16 sm:p-24 p-20 flex flex-col md:gap-24 sm:gap-20 gap-24 w-full relative`}
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

        {products?.length > 10 && (
          <p
            onClick={() => {
              handleShowMore(collection.slug)
            }}
            className="pointer"
          >
            <span style={{ background: theme.button, color: theme.text }} className='w-36 h-36 radius-999 flex flex-col a-items-center j-content-center'>
              <LuArrowRight className='w-20 h-20' />
            </span>

          </p>
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
