import {
  useProducts,
} from '@/modules/lib/utility/hooks/use-products';
import ProductTile from '@/modules/lib/components/product-tile/ProductTile';
import ProductTileShimmer from '@/modules/lib/components/product-tile/ProductTileShimmer';
import { ProductTileGalleryProvider } from '@/modules/lib/components/product-tile/ProductTileGalleryContext';
import ScrollButtons from '@/modules/lib/components/scroll-buttons/scrollButtons';
import { useEffect, useMemo, useRef } from 'react';
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
const DEFAULT_PRODUCTS_TO_SHOW = 10;
const MAX_PRODUCTS_TO_SHOW = 30;
const MAX_LAYOUT_ROWS = 5;

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
  const scrollRefs = useRef<Array<HTMLDivElement | null>>([]);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const nameLower = (collection.name ?? '').toLowerCase();
  const isLimited = /limited|limit/.test(nameLower);
  const fallbackTheme = isLimited ? redTheme : otherThemes[index % otherThemes.length];
  const layoutConfig = collection.meta?.simpleLayoutView ?? {};
  const configuredProductsToShow = layoutConfig.productsToShow;
  const hasExplicitProductsToShow = configuredProductsToShow != null;
  const theme = {
    bg: layoutConfig.bgColor || fallbackTheme.bg,
    button: layoutConfig.buttonColor || fallbackTheme.button,
    text: layoutConfig.buttonTextColor || fallbackTheme.text,
  };
  const productsToShow = Math.min(
    Math.max(configuredProductsToShow ?? DEFAULT_PRODUCTS_TO_SHOW, 1),
    MAX_PRODUCTS_TO_SHOW
  );
  const productFetchLimit = hasExplicitProductsToShow
    ? productsToShow + 1
    : 11;
  const showMoreThreshold = hasExplicitProductsToShow
    ? productsToShow
    : DEFAULT_PRODUCTS_TO_SHOW;
  const horizontalScroll = layoutConfig.horizontalScroll !== false;
  const shouldSpan = layoutConfig.shouldSpanFullWidth === true;
  const layoutRows = Math.min(
    Math.max(layoutConfig.layoutRows ?? 1, 1),
    MAX_LAYOUT_ROWS
  );
  const effectiveLayoutRows = horizontalScroll ? layoutRows : 1;
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
      filters: { ...(isStoreBased ? {} : { type }), status: { In: "ACTIVE,OUT_OF_STOCK" }, channel: "LEGACY_MARKETPLACE_STORE" },
      order: { priorityScore: "DESC", createdAt: "DESC" },
      pagination: { page: 1, limit: productFetchLimit },
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

  const shimmerCount = Math.min(collection.productCount ?? productsToShow, productsToShow);
  const hasError = !!fetchingError;
  const productsLoading = loading;
  const showShimmers = productsLoading;
  const showEmptyState = !productsLoading && !hasError && products.length === 0;
  const showProducts = !productsLoading && !hasError && products.length > 0;
  const displayedProducts = useMemo(
    () => products?.slice(0, productsToShow) ?? [],
    [products, productsToShow]
  );
  const productsPerRow = Math.max(1, Math.ceil(displayedProducts.length / effectiveLayoutRows));
  const productRows = useMemo(
    () =>
      Array.from({ length: effectiveLayoutRows }, (_, rowIndex) =>
        displayedProducts.slice(rowIndex * productsPerRow, (rowIndex + 1) * productsPerRow)
      ).filter((row) => row.length > 0),
    [displayedProducts, effectiveLayoutRows, productsPerRow]
  );
  const shimmerPerRow = Math.max(1, Math.ceil(shimmerCount / effectiveLayoutRows));
   const isCollectionEmpty = collection.productCount === 0 || showEmptyState;
  const headingHasWeightClass = /\bfont-\S+/.test(headingClassName);
  const subHeadingHasWeightClass = /\bfont-\S+/.test(subHeadingClassName);

   useEffect(() => {
     onCollectionEmptyStateChange?.(collection.id, isCollectionEmpty);
   }, [collection.id, isCollectionEmpty, onCollectionEmptyStateChange]);

  if (collection.productCount === 0) return null;
  if (showEmptyState) return null;

  return (
    <section
      style={{ background: theme.bg }}
      className={`rounded-[16px] sm:p-[24px] p-[20px] flex flex-col md:gap-[24px] sm:gap-[20px] gap-[24px] w-full relative`}
    >
      <div className="flex flex-row justify-between items-center gap-[24px]">
        <div className='flex flex-col gap-[2px]'>
          <h3
            className={cx(
              "text-[16px] md:text-[20px] md:leading-[28px] leading-[24px] text-[#000000E0]",
              !headingHasWeightClass && "font-semibold",
              headingClassName
            )}
          >
            {collection.name}
          </h3>
          <p
            className={cx(
              "text-[#00000099] text-[14px]",
              !subHeadingHasWeightClass && "font-normal",
              subHeadingClassName
            )}
          >
            {collection.description}
          </p>
        </div>

        {!loading && !hasError && products?.length > showMoreThreshold && (
          <p
            onClick={() => {
              handleShowMore(collection.slug)
            }}
            className="cursor-pointer"
          >
            <span style={{ background: theme.button, color: theme.text }} className='w-[36px] h-[36px] rounded-[999px] flex flex-col items-center justify-center'>
              <LuArrowRight className='w-[20px] h-[20px]' />
            </span>

          </p>
        )}

      </div>
      {hasError ? (
        <div
          className="flex flex-col items-center justify-center gap-[20px] py-[40px] px-[24px] rounded-[12px] border border-[#E8E8E8] bg-[#FAFAFA] min-w-[280px] max-w-[100%]"
          role="alert"
          aria-live="polite"
        >
          <span className="flex items-center justify-center w-[48px] h-[48px] rounded-[999px] bg-[#FFF3F1] text-[#D4280C]">
            <TbAlertCircle className="w-[28px] h-[28px]" aria-hidden />
          </span>
          <div className="flex flex-col items-center gap-[8px] text-center">
            <h4 className="text-[16px] font-semibold text-[#000000E0]">
              Couldn’t load products
            </h4>
            <p className="text-[14px] font-normal text-[#00000099]">
              Something went wrong loading this collection. Try again.
            </p>
          </div>

          <Button onClick={() => refetch()} className="px-[24px] py-[8px] min-w-[120px] flex items-center justify-center gap-[8px]">
            <TbRefresh className="w-[18px] h-[18px]" aria-hidden />
            Try again
          </Button>
        </div>
      ) : (
        <ProductTileGalleryProvider products={displayedProducts}>
          <div className="flex flex-col gap-[38px] sm:gap-[40px] md:gap-[44px]">
          {(showShimmers ? Array.from({ length: effectiveLayoutRows }, (_, idx) => idx) : productRows.map((_, idx) => idx)).map((rowIndex) => {
            const rowProducts = showShimmers
              ? []
              : productRows[rowIndex] ?? [];
            return (
              <div key={`${collection.id}-row-${rowIndex}`} className="relative">
                <div className={horizontalScroll ? "scroll-x no-scrollbar" : ""} ref={(el) => {
                  scrollRefs.current[rowIndex] = el;
                }}>
                  <div
                    className={`h-fit ${horizontalScroll
                      ? 'flex'
                      : shouldSpan
                        ? 'grid xxlgrid-5-cols xl:grid-cols-4 sm:grid-cols-3 grid-cols-2 flex-wrap'
                        : 'grid xxlgrid-3-cols-1fr grid-cols-2 flex-wrap'} ${showShimmers ? (horizontalScroll ? 'w-fit' : 'w-full') : showProducts ? (horizontalScroll ? 'w-fit' : 'w-full') : showEmptyState ? 'w-full items-center justify-center' : ''
                      } ${horizontalScroll ? 'whitespace-nowrap' : ''} gap-[18px] sm:gap-[20px] md:gap-[24px]`}
                  >
                    {showShimmers
                      ? Array.from({ length: shimmerPerRow }, (_, i) => (
                        <ProductTileShimmer
                          key={`shimmer-${collection.id}-${rowIndex}-${i}`}
                          isStoreBased={isStoreBased}
                          horizontalScroll={horizontalScroll}
                        />
                      ))
                      : rowProducts.map((product, i) => (
                        <div
                          key={`${product.id}-${i}`}
                          className={`${horizontalScroll ? "lg:w-[290px] md:w-[250px] sm:w-[220px] w-[150px]" : "min-w-0"} lg:-mt-[20px] -mt-[30px]`}
                        >
                          <ProductTile
                            product={product}
                            key={product.id}
                            id={product.id}
                            addToCartVariant="icon"
                            isStoreBased={isStoreBased}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                          />
                        </div>
                      ))}
                  </div>
                </div>
                {horizontalScroll && (showShimmers || rowProducts.length > 0) && (
                  <ScrollButtons
                    scrollRef={{ current: scrollRefs.current[rowIndex] }}
                    page={`productScroll-${rowIndex}`}
                    scrollLength={showShimmers ? shimmerPerRow : rowProducts.length}
                    component={'products'}
                  />
                )}
              </div>
            );
          })}
          </div>
        </ProductTileGalleryProvider>
      )}
    </section>
  );
};

export default CollectionSection;
