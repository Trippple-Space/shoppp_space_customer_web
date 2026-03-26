import {
  useProducts,
} from '@/modules/lib/utility/hooks/use-products';
import ProductTile from '@/modules/lib/components/product-tile/ProductTile';
import ProductTileShimmer from '@/modules/lib/components/product-tile/ProductTileShimmer';
import ScrollButtons from '@/modules/lib/components/scroll-buttons/scrollButtons';
import { useEffect, useRef } from 'react';
import { ICollection } from '@/modules/lib/utility/types/collection.interface';
import { useFilterStore } from '@/modules/lib/utility/store/filter.store';
import { useCategories } from '@/modules/lib/utility/hooks/use-categories';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LuArrowRight } from 'react-icons/lu';
import { TbAlertCircle, TbRefresh } from 'react-icons/tb';
import { filtersToSearchParams } from '@/modules/lib/utility/utility';
import Button from '@/modules/lib/components/button/Button';
import cx from 'classnames';

const redTheme = { bg: "#FFF3F1", button: "#D4280C", text: 'white' as const };
const otherThemes = [
  { bg: "#FEFBE8", button: "#FACE33", text: 'black' as const }, // yellow
  { bg: "#EDF8FF", button: "#1677FF", text: 'white' as const }, // blue
  { bg: "#F4F0FF", button: "#7B61FF", text: 'white' as const }, // purple
  { bg: "#ECFFF6", button: "#00B96B", text: 'white' as const }, // green
];

interface Props {
  collection: ICollection;
  index: number;
  setSelectedCollection: (coll: string) => void
  selectedCollection: string | null
  isStoreBased?: boolean
  storeId?: string
  headingClassName?: string
  subHeadingClassName?: string
  onCollectionEmptyStateChange?: (collectionId: string, isEmpty: boolean) => void
}

const CollectionSection = ({
  collection,
  index,
  selectedCollection,
  setSelectedCollection,
  isStoreBased = false,
  storeId = '',
  headingClassName = '',
  subHeadingClassName = '',
  onCollectionEmptyStateChange,
}: Props) => {
  const scrollRef1 = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const nameLower = (collection.name ?? '').toLowerCase();
  const isLimited = /limited|limit/.test(nameLower);
  const theme = isLimited ? redTheme : otherThemes[index % otherThemes.length];
  const type = pathname.includes('wears') ? 'wears' : 'fabrics';
  const categoryLabel = isStoreBased ? 'STORE' : 'GLOBAL';

  const { selectedCategory, setSelectedCategory } = useCategories({
    type,
    storeId: isStoreBased ? storeId : '',
    label: categoryLabel,
  });
  const { allFilters } = useFilterStore();

  const selectedTags = (() => {
    const categoryName = selectedCategory?.name ?? '';
    if (!categoryName || categoryName === 'All') return [];
    return categoryName
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => t.toLowerCase());
  })();

  const tagsFilter = selectedTags.length ? selectedTags.join(',') : '';
  const searchFromPath = (searchParams.get('search') ?? '').trim();

  const initialFiltersForCollection = {
    ...allFilters,
    tags: tagsFilter,
  };

  const { products, loading, query, updateHomePageFilter, setSearch, fetchingError, refetch } = useProducts(
    {
      filters: { ...(isStoreBased ? {} : { type }), status: { In: "ACTIVE,OUT_OF_STOCK" }, channel: "ASOEBI_STORE" },
      order: { priorityScore: "DESC", createdAt: "DESC" },
      pagination: { page: 1, limit: 11 },
      allFilters: initialFiltersForCollection,
      search: searchFromPath || undefined,
    },
    'infinite',
    collection.slug,
    tagsFilter,
  );

  useEffect(() => {
    const updatedFilters = {
      ...allFilters,
      tags: tagsFilter,
    };

    updateHomePageFilter(updatedFilters);
  }, [
    allFilters,
    JSON.stringify(query.allFilters),
    JSON.stringify(query.filters),
    selectedCategory?.name,
  ]);

  useEffect(() => {
    const nextSearch = (searchParams.get('search') ?? '').trim();
    setSearch(nextSearch || undefined);
  }, [searchParams.toString()]);

  const handleShowMore = (collection?: string) => {
    const params = filtersToSearchParams(allFilters, selectedCategory);

    if (collection) {
      params.set('collection', collection);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const shimmerCount = Math.min(collection.productCount ?? 10, 10);
  const hasError = !!fetchingError;
  const productsLoading = loading;
  const showShimmers = productsLoading;
  const showEmptyState = !productsLoading && !hasError && products.length === 0;
  const showProducts = !productsLoading && !hasError && products.length > 0;
   const isCollectionEmpty = collection.productCount === 0 || showEmptyState;
  const headingHasWeightClass = /\bweight-\S+/.test(headingClassName);
  const subHeadingHasWeightClass = /\bweight-\S+/.test(subHeadingClassName);

   useEffect(() => {
     onCollectionEmptyStateChange?.(collection.id, isCollectionEmpty);
   }, [collection.id, isCollectionEmpty, onCollectionEmptyStateChange]);

  if (collection.productCount === 0) return null;
  if (showEmptyState) return null;

  return (
    <section
      style={{ background: theme.bg }}
      className={`radius-16 sm:p-24 p-20 flex flex-col md:gap-24 sm:gap-20 gap-24 w-full relative`}
    >
      <div className="flex flex-row j-content-between a-items-center gap-24">
        <div className='flex flex-col gap-2'>
          <h3
            className={cx(
              "text-16 md:text-20 md:line-height-28 line-height-24 color-#000000E0",
              !headingHasWeightClass && "weight-600",
              headingClassName
            )}
          >
            {collection.name}
          </h3>
          <p
            className={cx(
              "color-#00000099 text-14",
              !subHeadingHasWeightClass && "weight-400",
              subHeadingClassName
            )}
          >
            {collection.description}
          </p>
        </div>

        {!loading && !hasError && products?.length > 10 && (
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
          className={`flex h-fit ${showShimmers && shimmerCount > 0 ? 'w-fit' : showProducts ? 'w-fit' : showEmptyState ? 'w-100p a-items-center j-content-center' : ''
            } whitespace-nowrap sm:gap-20 gap-14`}
        >
          {hasError ? (
            <div
              className="flex flex-col a-items-center j-content-center gap-20 py-40 px-24 radius-12 border border-#E8E8E8 bg-#FAFAFA min-w-280 max-w-100p"
              role="alert"
              aria-live="polite"
            >
              <span className="flex a-items-center j-content-center w-48 h-48 radius-999 bg-#FFF3F1 color-#D4280C">
                <TbAlertCircle className="w-28 h-28" aria-hidden />
              </span>
              <div className="flex flex-col a-items-center gap-8 text-center">
                <h4 className="text-16 weight-600 color-#000000E0">
                  Couldn’t load products
                </h4>
                <p className="text-14 weight-400 color-#00000099">
                  Something went wrong loading this collection. Try again.
                </p>
              </div>

              <Button onClick={() => refetch()} className="px-24 py-8 min-w-120 flex items-center justify-center gap-8">
                <TbRefresh className="w-18 h-18" aria-hidden />
                Try again
              </Button>
            </div>
          ) : showShimmers ? (
            Array.from({ length: shimmerCount }, (_, i) => (
              <ProductTileShimmer key={`shimmer-${collection.id}-${i}`} isStoreBased={isStoreBased} />
            ))
          ) : showProducts ? (
            products?.slice(0, 10).map((product, i) => (
              <div
                key={i}
                className="l:w-290 md:w-250 sm:w-220 w-150 l:mt--20 mt--30"
              >
                <ProductTile
                  product={product}
                  key={i}
                  id={product.id}
                  addToCartVariant="icon"
                  isStoreBased={isStoreBased}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              </div>
            ))
          ) : null}
        </div>
      </div>
      {
        products.length > 0 && (
          <ScrollButtons
            scrollRef={scrollRef1}
            page={'productScroll'}
            scrollLength={hasError ? 0 : showShimmers ? shimmerCount : showEmptyState ? 0 : products.length}
            component={'products'}
          />
        )
      }
    </section>
  );
};

export default CollectionSection;
