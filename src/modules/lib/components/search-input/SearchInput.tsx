import React, { FC, useEffect, useRef, useState } from 'react';
import { BiSearch, BiStoreAlt } from 'react-icons/bi';
import { IoIosSearch } from 'react-icons/io';
import { productService } from '../../utility/services/product.service';
import { Product, RecentlyViewed } from '../../utility/types/product.interface';
import SearchModal from '../search-modal/SearchModal';
import classNames from 'classnames';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { storeService } from '../../utility/services/store.service';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { useRecentlyViewedVariant } from '../../utility/hooks/use-recently-viewed';
import { toast } from 'sonner';
import ProductDetailModal from '../product-detail-modal/ProductDetailModal';
import Link from 'next/link';
import { cx } from '../../utility/utility';

interface ISearchInput {
  component?: any;
  placeholder?: any;
  storeSlug?: any;
}

const Shimmer = ({ className }: { className: string }) => (
  <div className={cx('animate-pulse bg-[#E5E7EB] rounded-[6px]', className)} />
);

const SearchInput: FC<ISearchInput> = ({
  component,
  placeholder,
  storeSlug,
}) => {
  const { recentSearched } = useRecentlyViewedVariant();

  const typePath = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [storeResults, setStoreResults] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingStores, setLoadingStores] = useState(true);

  const [openSearchModal, setOpenSearchModal] = useState<boolean>(false);
  const [openSingleProductModal, setOpenSingleProductModal] = useState(false);

  const [product, setProduct] = useState<Product | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const handleOpenSearchModal = () => {
    setOpenSearchModal((prev) => !prev);
  };

  const handleFetchProduct = async (slug: string) => {
    if (window.innerWidth >= 768) {
      setOpenSingleProductModal(true);
      /*  if (searcedProduct) {
        setProduct(searcedProduct);
      } */
      try {
        const singleSearchProduct = await productService.fetchProductBySlug(
          slug,
          {}
        );
        setProduct(singleSearchProduct);
      } catch (err) {
        toast.error('Failed to fetch product details');
      }
    } else {
      router.push(`/products/${slug}`);
    }
  };

  function handleCloseProductModal() {
    setOpenSingleProductModal(false);
    setProduct(null);
  }

  useEffect(() => {
    if (!searchTerm || !openSearchModal) {
      setSearchResults([]);
      setStoreResults([]);
      setLoadingProducts(false);
      setLoadingStores(false);
      return;
    }

    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;
   
    setLoadingProducts(true);
    setLoadingStores(true);

    const timeoutId = setTimeout(() => {
      const fetchProducts = async () => {
        try {
          const result =
            component === 'home'
              ? await productService.fetchProductBySearch(
                  searchTerm,
                  {
                    filters: {
                      type: typePath === '/fabrics' ? 'fabrics' : 'wears',
                    },
                    pagination: {
                      page: 1,
                      limit: 10,
                    },
                  },
                  controller.signal
                )
              : await productService.fetchProductBySlugSearch(
                  storeSlug,
                  searchTerm,
                  {
                    pagination: {
                      page: 1,
                      limit: 10,
                    },
                  },
                  controller.signal
                );

          if (controller.signal.aborted) return;

          setSearchResults(result);

          if (component === 'home') {
            try {
              const storeSearchResults = await storeService.fetchStores(
                {},
                searchTerm
              );

              if (!controller.signal.aborted) {
                setStoreResults(storeSearchResults || []);
              }
            } finally {
              if (!controller.signal.aborted) {
                setLoadingStores(false);
              }
            }
          } else {
            setStoreResults([]);
            setLoadingStores(false);
          }
        } catch (err: any) {
          if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') {
            return;
          }
        } finally {
          if (!controller.signal.aborted) {
            setLoadingProducts(false);
          }
        }
      };

      fetchProducts();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchTerm, openSearchModal]);

  useEffect(() => {
    const search = searchParams.get('search') || '';
    setSearchTerm(search);
  }, [searchParams]);

  return (
    <div
      className={`flex gap-[30px] lg:gap-[50px] font-extralight text-[14px] lg:text-[16px] ${
        component === 'home' ? 'lg:w-[400px] md:w-[340px]' : 'lg:w-[400px]'
      } ${openSearchModal ? 'md:relative md:z-[8px]' : 'md:relative z-0'}`}
    >
      <div
        className={`flex w-full relative items-center ${openSearchModal ? 'md:z-[2px]' : ''}`}
      >
        <div className="w-full hidden md:block">
          <input
            type="text"
            className={
              component === 'home'
                ? classNames(
                    'flex lg:block md:border md:bg-[#F3F3F3] md:border-none md:py-[12px] md:px-[14px] md:outline-none md:w-[100%] md:relative md:z-[2px] md:rounded-[99px]'
                  )
                : 'md:block hidden md:rounded-[99px] md:border md:border-[#D9D9D9] bg-transparent outline-none lg:w-full md:w-[320px] text-[16px] md:py-[11.2px] md:pl-[14px] md:relative md:z-[2px] md:rounded-[99px]'
            }
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={() => setOpenSearchModal(true)}
          />
        </div>

        <div
          className={`md:absolute right-0 md:cursor-pointer md:z-[2px] md:rounded-[50px] ${
            component === 'home'
              ? classNames(
                  'flex items-center justify-center md:bg-[#0357EE] md:w-[30px] md:h-[30px] w-full md:m-[5px]'
                )
              : 'md:z-[2px] md:rounded-[50px]'
          }`}
        >
          <BiSearch
            className={
              component === 'home'
                ? 'w-[20px] h-[20px] text-black md:color-white md:mr-0 mr-[10px]'
                : 'md:w-[16px] w-[24px] md:h-[16px] h-[24px] md:-mb-[2px] -mb-[5px] md:mr-[14px]'
            }
            onClick={handleOpenSearchModal}
          />
        </div>
        {openSearchModal && (
          <>
            <div
              className="fixed inset-0 bg-black opacity-70 z-[1px]"
              onClick={handleOpenSearchModal}
            />

            <div
              className={classNames(
                `z-[1px] bg-white rounded-[30px] md:rounded-[20px] flex flex-col fixed left-[50%] md:l-auto top-[70px] md:-top-[12px] md:pt-[70px] -translate-x-1/2 w-[90%] h-[70%] md:h-[400px] md:w-[520px] md:absolute md:transform-none md:shadow-[0px_2px_5px_rgba(0,0,0,0.05)]`
              )}
            >
              <div className="w-full flex justify-center md:hidden pb-[20px]">
                <div className="flex justify-center relative items-center mt-[20px] w-[80%]">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`block rounded-[99px] py-[12px] px-[14px] outline-none w-full ${component === 'home' ? 'bg-[#F3F3F3] border-none' : 'border border-[#D9D9D9]'}`}
                    placeholder={`${component === 'home' ? 'Search Shoppp Space' : 'Search'}`}
                  />

                  <div
                    className={`flex justify-center items-center absolute right-0 rounded-[50px] m-[5px] w-[30px] h-[30px] ${component === 'home' ? 'bg-[#0357EE] text-[#fff]' : ''}`}
                  >
                    <IoIosSearch className="w-[25px] h-[20px]" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-[42px] sm:w-[90%] w-[93%] mx-auto flex-1 min-h-0 overflow-auto no-scrollbar py-[20px]">
                {searchTerm.length === 0 ? (
                  <MiniRecentlySearched
                    recentSearched={recentSearched}
                    handleFetchProduct={handleFetchProduct}
                  />
                ) : (
                  ''
                )}

                {searchTerm.length > 0 &&
                  component === 'home' &&
                  (storeResults.length === 0 ? (
                    loadingStores ? (
                      <div className="flex flex-col gap-[22px]">
                        <h6 className="font-inter font-bold text-[14px]">
                          Stores
                        </h6>

                        <div className="flex gap-[18px]">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div
                              key={i}
                              className="bg-[#F3F3F3] h-[33px] px-[16px] py-[8px] rounded-[999px] flex gap-[8px] items-center"
                            >
                              <Shimmer className="w-[20px] h-[20px] rounded-[50px]" />
                              <Shimmer className="w-[70px] h-[12px]" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-[22px]">
                        <h6 className="font-inter font-bold text-[14px]">
                          Stores
                        </h6>
                        <p className="text-[13px] text-[#00000099] text-center">
                          No stores found
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col gap-[22px]">
                      <h6 className="font-inter font-bold text-[14px]">Stores</h6>
                      <div className="flex gap-[18px] items-center overflow-auto no-scrollbar">
                        {storeResults?.slice(0, 5).map((store) => (
                          <Link
                            href={`/${store?.slug}`}
                            target="_blank"
                            key={store.id}
                            className="bg-[#F3F3F3] hover:bg-[#eee] h-[33px] px-[16px] py-[8px] rounded-[999px] flex gap-[8px] items-center justify-center cursor-pointer"
                          >
                            <span className="text-[14px] font-medium flex items-center justify-center">
                              {store.logo ? (
                                <img
                                  src={store.logo}
                                  alt={store.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <BiStoreAlt className="w-[20px] h-[21px] min-w-[20px]" />
                              )}
                            </span>

                            <span
                              className="text-[14px] font-medium"
                              style={{ textWrap: 'nowrap' }}
                            >
                              {store.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}

                <div>
                  {searchTerm.length > 0 &&
                    (searchResults.length === 0 ? (
                      loadingProducts ? (
                        <ProductLoadingSkeleton />
                      ) : (
                        <div className="flex flex-col gap-[22px]">
                          <h6 className="font-inter font-bold text-[14px]">
                            Products
                          </h6>
                          <p className="text-[13px] text-[#00000099] text-center">
                            No products found
                          </p>
                        </div>
                      )
                    ) : (
                      <SearchModal
                        searchResults={searchResults}
                        position={'homepage'}
                        searchTerm={searchTerm}
                        setOpenSearchModal={setOpenSearchModal}
                        handleFetchProduct={handleFetchProduct}
                      />
                    ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {product && (
        <ProductDetailModal
          openSingleProductModal={openSingleProductModal}
          handleCloseProductModal={handleCloseProductModal}
          position="homepage"
          product={product}
          variant={undefined}
        />
      )}
    </div>
  );
};

export default SearchInput;

export const MiniRecentlySearched = ({
  recentSearched,
  handleFetchProduct,
}: {
  recentSearched: RecentlyViewed[];
  handleFetchProduct: (slug: string) => void;
}) => {
  return (
    <>
      {recentSearched?.length !== 0 ? (
        <div className="flex flex-col gap-[22px]">
          <h6 className="font-inter font-bold text-[14px]">Recent Searches</h6>
          <div className="flex gap-[18px] items-center w-full overflow-auto no-scrollbar">
            {recentSearched?.toReversed().map((searched, idx) => (
              <p
                key={searched.id + idx}
                onClick={() => {
                  handleFetchProduct(
                    searched?.productVariant?.product?.slug || ''
                  );
                }}
                className="bg-[#F3F3F3] hover:bg-[#eee] h-[33px] px-[16px] py-[8px] rounded-[999px] flex flex-col gap-[8px] items-center justify-center cursor-pointer"
              >
                <span
                  className="text-[14px] font-medium"
                  style={{ textWrap: 'nowrap' }}
                >
                  {searched?.productVariant?.product?.name}
                </span>
              </p>
            ))}
          </div>
        </div>
      ) : (
        ''
      )}

      {/* <div className="flex flex-col gap-[22px]">
                      <h6 className="font-inter font-bold text-[14px]">
                        Trending Now
                      </h6>
                      <div className="flex gap-[18px] items-center overflow-auto no-scrollbar">
                        <p className="bg-[#F3F3F3] hover:bg-[#eee] h-[33px] px-[16px] py-[8px] rounded-[999px] flex gap-[8px] items-center justify-center cursor-pointer">
                          <span
                            className="text-[14px] font-medium"
                            style={{ textWrap: 'nowrap' }}
                          >
                            Flowery Lace
                          </span>
                          <FaArrowTrendUp size={21} />
                        </p>
                      </div>
                    </div> */}
    </>
  );
};

export const ProductLoadingSkeleton = () => {
  return (
    <div className="flex flex-col gap-[15px]">
      <h6 className="font-inter font-bold text-[14px]">Products</h6>

      <div className="flex flex-col gap-[10px]">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-[8px] p-[10px] rounded-[8px]">
            <Shimmer className="w-[50px] h-[50px] rounded-[6px]" />

            <div className="flex flex-col gap-[6px] grow">
              <Shimmer className="h-[12px] w-[70%]" />
              <Shimmer className="h-[10px] w-[40%]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
