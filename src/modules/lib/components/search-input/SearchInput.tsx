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
  <div className={cx('animate-pulse bg-#E5E7EB radius-6', className)} />
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
    }, 1000);

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
      className={`flex gap-30 l:gap-50 weight-200 text-14 l:text-16 ${
        component === 'home' ? 'l:w-400 md:w-340' : 'l:w-400'
      } ${openSearchModal ? 'md:relative md:z-2' : 'md-relative z-0'}`}
    >
      <div
        className={`flex w-100p relative a-items-center ${openSearchModal ? 'md:z-2' : ''}`}
      >
        <div className="w-full hidden md:block">
          <input
            type="text"
            className={
              component === 'home'
                ? classNames(
                    'flex l:block md:border md:bg-#F3F3F3 md:border-none md:py-12 md:px-14 md:outline-none md:w-100p md:relative md:z-2 md:radius-99'
                  )
                : 'md:block hidden md:radius-99 md:border md:border-#D9D9D9 bg-none outline-none l:w-full md:w-320 text-16 md:py-11.2 md:pl-14 md:relative md:z-2 md:radius-99'
            }
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={() => setOpenSearchModal(true)}
          />
        </div>

        <div
          className={`md:absolute r-0 md:cursor-pointer md:z-2 md:radius-50 ${
            component === 'home'
              ? classNames(
                  'flex a-items-center j-content-center md:bg-#0B9378 md:w-30 md:h-30 w-100p md:m-5'
                )
              : 'md:z-2 md:radius-50'
          }`}
        >
          <BiSearch
            className={
              component === 'home'
                ? 'w-20 h-20 color-black md:color-white md:mr-0 mr-10'
                : 'md:w-16 w-24 md:h-16 h-24 md:mb--2 mb--5 md:mr-14'
            }
            onClick={handleOpenSearchModal}
          />
        </div>
        {openSearchModal && (
          <>
            <div
              className="fixed inset-0 bg-black opacity-70 z-1"
              onClick={handleOpenSearchModal}
            />

            <div
              className={classNames(
                `z-1 bg-white radius-30 md:radius-20 flex flex-col fixed l-50p md:l-auto t-70 md:t--12 md:pt-70 g|transform:translate(-50%); w-90p h-70p md:h-400 md:w-520 md:absolute md:transform-none md:g|box-shadow:0px|_|2px|_|5px|_|rgba(0,0,0,0.05);`
              )}
            >
              <div className="w-100p flex j-content-center md:hidden pb-20">
                <div className="flex j-content-center relative a-items-center mt-20 w-80p">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`block radius-99 py-12 px-14 outline-none w-100p ${component === 'home' ? 'bg-#F3F3F3 border-none' : 'border border-#D9D9D9'}`}
                    placeholder={`${component === 'home' ? 'Search asoebi.africa' : 'Search'}`}
                  />

                  <div
                    className={`flex j-content-center a-items-center absolute r-0 radius-50 m-5 w-30 h-30 ${component === 'home' ? 'bg-#0B9378 color-#fff' : ''}`}
                  >
                    <IoIosSearch className="w-25 h-20" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-42 sm:w-90p w-93p mx-auto flex-1 min-h-0 overflow-auto no-scrollbar py-20">
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
                      <div className="flex flex-col gap-22">
                        <h6 className="font-inter weight-700 text-14">
                          Stores
                        </h6>

                        <div className="flex gap-18">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div
                              key={i}
                              className="bg-#F3F3F3 h-33 px-16 py-8 radius-999 flex gap-8 a-items-center"
                            >
                              <Shimmer className="w-20 h-20 radius-50" />
                              <Shimmer className="w-70 h-12" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-22">
                        <h6 className="font-inter weight-700 text-14">
                          Stores
                        </h6>
                        <p className="text-13 color-#00000099 text-center">
                          No stores found
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col gap-22">
                      <h6 className="font-inter weight-700 text-14">Stores</h6>
                      <div className="flex gap-18 a-items-center overflow-auto no-scrollbar">
                        {storeResults?.slice(0, 5).map((store) => (
                          <Link
                            href={`/${store?.slug}`}
                            target="_blank"
                            key={store.id}
                            className="bg-#F3F3F3 hover:bg-#eee h-33 px-16 py-8 radius-999 flex gap-8 a-items-center j-content-center pointer"
                          >
                            <span className="text-14 weight-500 flex a-items-center j-content-center">
                              {store.logo ? (
                                <img
                                  src={store.logo}
                                  alt={store.name}
                                  className="w-100p h-100p object-cover"
                                />
                              ) : (
                                <BiStoreAlt className="w-20 h-21 min-w-20" />
                              )}
                            </span>

                            <span
                              className="text-14 weight-500"
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
                        <div className="flex flex-col gap-22">
                          <h6 className="font-inter weight-700 text-14">
                            Products
                          </h6>
                          <p className="text-13 color-#00000099 text-center">
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
        <div className="flex flex-col gap-22">
          <h6 className="font-inter weight-700 text-14">Recent Searches</h6>
          <div className="flex gap-18 a-items-center w-100p overflow-auto no-scrollbar">
            {recentSearched?.toReversed().map((searched, idx) => (
              <p
                key={searched.id + idx}
                onClick={() => {
                  handleFetchProduct(
                    searched?.productVariant?.product?.slug || ''
                  );
                }}
                className="bg-#F3F3F3 hover:bg-#eee h-33 px-16 py-8 radius-999 flex flex-col gap-8 a-items-center j-content-center pointer"
              >
                <span
                  className="text-14 weight-500"
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

      {/* <div className="flex flex-col gap-22">
                      <h6 className="font-inter weight-700 text-14">
                        Trending Now
                      </h6>
                      <div className="flex gap-18 a-items-center overflow-auto no-scrollbar">
                        <p className="bg-#F3F3F3 hover:bg-#eee h-33 px-16 py-8 radius-999 flex gap-8 a-items-center j-content-center pointer">
                          <span
                            className="text-14 weight-500"
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
    <div className="flex flex-col gap-15">
      <h6 className="font-inter weight-700 text-14">Products</h6>

      <div className="flex flex-col gap-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-8 p-10 radius-8">
            <Shimmer className="w-50 h-50 radius-6" />

            <div className="flex flex-col gap-6 flex-grow-1">
              <Shimmer className="h-12 w-70p" />
              <Shimmer className="h-10 w-40p" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
