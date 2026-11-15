import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
import VideoSrc from '../video-src/VideoSrc';

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
  const searchParams = useSearchParams();

  const handleShowMore = () => {
    const params = filtersToSearchParams(allFilters, selectedCategory, searchParams);

    if (searchTerm) {
      params.set('search', searchTerm);
    }

    router.replace(`${pathname}?${params.toString()}`);
    setOpenSearchModal?.(false);
  };

  return (
    <>
      <div className="h-full w-full">
        {searchResults && (
          <div className=" lg:mt-0  flex flex-col items-start w-full h-full gap-[15px]">
            {/*  <p className='text-[#00000099] text-left text-[12px] p-[10px]'>Results</p> */}
            <h6 className="font-inter font-bold text-[14px]">Products</h6>
            <div className="overflow-auto w-full flex flex-col gap-[3px] no-scrollbar">
              {searchResults.slice(0, 5).map((product) => (
                <div
                  key={product.slug}
                  className="flex justify-start gap-[8px] p-[10px] cursor-pointer hover:bg-[#eee] rounded-[8px]"
                  onClick={() => {
                    if (isAuthenticated) {
                      addVariant(product.variants[0].id, 'search');
                      fetchRecentSearched();
                    }
                    handleFetchProduct(product.slug);
                  }}
                >

                  <div className="w-[50px] min-w-[50px] h-[50px] rounded-[6px] object-fit-cover relative">
                    {
                      product?.variants?.[product?.variants?.length - 1 || 0]
                        ?.media?.[0]?.type === 'image' ? (
                        <Image
                          src={
                            product?.variants?.[product?.variants?.length - 1 || 0]
                              ?.media?.[0]?.url
                          }
                          className="w-[50px] min-w-[50px] h-[50px] rounded-[6px] object-fit-cover"
                          alt={product.name}
                        />
                      ) : (
                        <VideoSrc
                          src={
                            product?.variants?.[product?.variants?.length - 1 || 0]
                              ?.media?.[0]?.url
                          }
                          className="w-[50px] min-w-[50px] h-[50px] rounded-[6px] object-fit-cover"
                          hasLoader={true}
                        />
                      )
                    }
                  </div>
                  <div className="flex flex-col items-start gap-[4px]">
                    <p className="text-[#000000] text-left text-[14px] font-medium">
                      {product.name}
                    </p>
                    <p className="font-medium flex gap-[6px] items-center text-[12px]">
                      {formatNumberAsPrice(
                        product?.variants?.[product?.variants?.length - 1 || 0]
                          ?.finalPrice
                      )}
                      <span className="text-[#00000099] font-inter font-normal text-[10px]">
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
                className="bg-[#F3F3F3] hover:bg-[#eee] h-[34px] w-fit mx-auto px-[20px] py-[8px] rounded-[999px] flex flex-col gap-[8px] items-center justify-center cursor-pointer"
              >
                <span className="text-[14px] font-medium">Show more</span>
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchModal;
