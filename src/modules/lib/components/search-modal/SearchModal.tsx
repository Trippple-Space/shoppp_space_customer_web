import { usePathname, useRouter } from 'next/navigation';
import {
  formatNumberAsPrice,
  cx,
  displayStockUnit,
  filtersToSearchParams,
} from '../../utility/utility';
import { Product } from '../../utility/types/product.interface';
import Image from '../image/Image';
import { useCart } from '../../utility/hooks/use-cart';
import { useRecentlyViewedActions } from '../../utility/hooks/use-recently-viewed';
import { useRecentVariantStore } from '../../utility/store/recentVariant.store';
import { useFilterStore } from '../../utility/store/filter.store';
import { useCategoryStore } from '../../utility/store/categories.store';

const SearchModal = ({
  searchResults,
  position,
  searchTerm,
  setOpenSearchModal,
  handleFetchProduct,
}: {
  searchResults: Product[];
  position: string;
  searchTerm?: string;
  setOpenSearchModal?: (v: boolean) => void;
  handleFetchProduct: (slug: string) => void;
}) => {
  const { isAuthenticated } = useCart();
  const { addVariant } = useRecentlyViewedActions();
  const { fetchRecentSearched } = useRecentVariantStore();
  const { allFilters } = useFilterStore();
  const { selectedCategory } = useCategoryStore();

  const router = useRouter();
  const pathname = usePathname();

  const handleShowMore = () => {
    const params = filtersToSearchParams(allFilters, selectedCategory);

    if (searchTerm) {
      params.set('search', searchTerm);
    }

    router.replace(`${pathname}?${params.toString()}`);
    setOpenSearchModal?.(false);
  };

  return (
    <>
      <div className="h-100p w-100p">
        {searchResults && (
          <div className=" l:mt-0  flex flex-col a-items-start w-100p h-100p gap-15">
            {/*  <p className='color-#00000099 text-left text-12 p-10'>Results</p> */}
            <h6 className="font-inter weight-700 text-14">Products</h6>
            <div className="overflow-auto w-100p flex flex-col gap-3 no-scrollbar">
              {searchResults.slice(0, 5).map((product) => (
                <div
                  key={product.slug}
                  className="flex j-content-start gap-8 p-10 cursor-pointer hover:bg-#eee radius-8"
                  onClick={() => {
                    if (isAuthenticated) {
                      addVariant(product.variants[0].id, 'search');
                      fetchRecentSearched();
                    }
                    handleFetchProduct(product.slug);
                  }}
                >
                  <Image
                    src={
                      product?.variants?.[product?.variants?.length - 1 || 0]
                        ?.media?.[0]?.url
                    }
                    alt={product.name}
                    className="w-50 min-w-50 h-50 radius-6 object-fit-cover"
                  />
                  <div className="flex flex-col a-items-start gap-4">
                    <p className="color-#000000 text-left text-14 weight-500">
                      {product.name}
                    </p>
                    <p className="weight-500 flex gap-6 a-items-center text-12">
                      {formatNumberAsPrice(
                        product?.variants?.[product?.variants?.length - 1 || 0]
                          ?.finalPrice
                      )}
                      <span className="color-#00000099 font-inter weight-400 text-10">
                        per {displayStockUnit(product.stockUnit)}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {searchResults.length > 5 && (
              <p
                onClick={handleShowMore}
                className="bg-#F3F3F3 hover:bg-#eee h-34 w-fit mx-auto px-20 py-8 radius-999 flex flex-col gap-8 a-items-center j-content-center pointer"
              >
                <span className="text-14 weight-500">Show more</span>
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchModal;
