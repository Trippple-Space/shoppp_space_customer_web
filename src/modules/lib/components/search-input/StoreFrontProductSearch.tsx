'use client';

import ProductDetailModal from '@/modules/lib/components/product-detail-modal/ProductDetailModal';
import {
  MiniRecentlySearched,
  ProductLoadingSkeleton,
} from '@/modules/lib/components/search-input/SearchInput';
import SearchModal from '@/modules/lib/components/search-modal/SearchModal';
import { useRecentlyViewedVariant } from '@/modules/lib/utility/hooks/use-recently-viewed';
import { productService } from '@/modules/lib/utility/services/product.service';
import { Product } from '@/modules/lib/utility/types/product.interface';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { toast } from 'sonner';
import { BiSearch } from 'react-icons/bi';
import { TbSearch } from 'react-icons/tb';
import { FaSearch } from 'react-icons/fa';

export type ProductSearchVariant =
  | 'furniture'
  | 'simple'
  | 'modernEarth'
  | 'modernLuxe';

interface ProductSearchProps {
  storeSlug: string;
  variant?: ProductSearchVariant;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  storeSlug,
  variant = 'furniture',
}) => {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [openSingleProductModal, setOpenSingleProductModal] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  const { recentSearched } = useRecentlyViewedVariant();

  const handleOpenSearchModal = () => {
    setOpenSearchModal((prev) => !prev);
  };

  useEffect(() => {
    if (!searchTerm || !openSearchModal) {
      setSearchResults([]);
      setLoadingProducts(false);
      return;
    }

    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setLoadingProducts(true);

    const timeoutId = setTimeout(() => {
      const fetchProducts = async () => {
        try {
          const result = await productService.fetchProductBySlugSearch(
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

          setSearchResults(result);
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
  }, [searchTerm, openSearchModal, storeSlug]);

  const handleFetchProduct = async (slug: string) => {
    if (window.innerWidth >= 768) {
      setOpenSingleProductModal(true);
      try {
        const single = await productService.fetchProductBySlug(slug, {});
        setProduct(single);
      } catch {
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

  const renderTrigger = () => {
    switch (variant) {
      case 'simple':
        return (
          <button
            className="simpleFlow__iconButton"
            onClick={handleOpenSearchModal}
          >
            <BiSearch className="simpleFlow__icon" />
          </button>
        );

      case 'modernEarth':
        return (
          <div className="modernEarth__search bg-white flex items-center w-full">
            <input
              type="text"
              placeholder="Search product..."
              className="h-42 w-full px-3 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={() => setOpenSearchModal(true)}
            />
            <TbSearch
              className="w-24 h-24 min-w-24 mr-10 cursor-pointer"
              onClick={handleOpenSearchModal}
            />
          </div>
        );

      case 'modernLuxe':
        return (
          <div className="modernLuxe__search-box relative">
            <label htmlFor="search" className="flex">
              <FaSearch
                className="w-16 h-16 cursor-pointer"
                onClick={handleOpenSearchModal}
              />
            </label>
            <input
              type="text"
              name="search"
              placeholder="Product Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={() => setOpenSearchModal(true)}
            />
          </div>
        );

      default:
        return (
          <div className="furniture-flex relative search-box">
            <img
              className="img"
              src="/images/templates/minimal-template/icons/search.png"
              alt="search"
              onClick={handleOpenSearchModal}
            />
            <img
              className="img"
              src="/images/templates/minimal-template/icons/search-black.svg"
              alt="search"
              onClick={handleOpenSearchModal}
            />
            <input
              type="text"
              placeholder="Product Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={() => setOpenSearchModal(true)}
            />
          </div>
        );
    }
  };

  const renderResultContent = () => {
    if (searchTerm.length > 0) {
      if (searchResults.length === 0) {
        if (loadingProducts) return <ProductLoadingSkeleton />;

        return (
          <div className="flex flex-col gap-22">
            <h6 className="font-inter weight-700 text-14">Products</h6>
            <p className="text-13 color-#00000099 text-center">
              No products found
            </p>
          </div>
        );
      }

      return (
        <SearchModal
          searchResults={searchResults}
          position=""
          searchTerm={searchTerm}
          setOpenSearchModal={setOpenSearchModal}
          handleFetchProduct={handleFetchProduct}
        />
      );
    }

    return (
      <MiniRecentlySearched
        recentSearched={recentSearched}
        handleFetchProduct={handleFetchProduct}
      />
    );
  };

  const desktopContainerClass: string = (() => {
    switch (variant) {
      case 'modernEarth':
        return 'absolute hidden md:block min-w-200 max-w-400 h-300 bg-white border border-#00000014 radius-4 t-44 z-8';

      case 'modernLuxe':
        return 'modernLuxe__searchContent md:absolute hidden md:block md:w-100p min-w-200 md:h-200 md:bg-white md:h-400 overflow-auto no-scrollbar radius-4 t-65 z-8';

      case 'simple':
        return '';

      default:
        return 'search-box-input hidden md:block md:absolute min-w-200 md:h-200 overflow-auto no-scrollbar md:bg-white md:border md:border-#00000014 radius-4 t-65 mt-3 z-8';
    }
  })();

  return (
    <>
      {renderTrigger()}
      {openSearchModal && desktopContainerClass && (
        <div className={desktopContainerClass}>
          <div className="flex flex-col gap-42 w-95p mx-auto py-12">
            {renderResultContent()}
          </div>
        </div>
      )}
      {openSearchModal && (
        <>
          <div
            className={`fixed inset-0 bg-black opacity-70 z-7 ${desktopContainerClass ? 'md:opacity-0' : ''}`}
            onClick={handleOpenSearchModal}
          />

          <div
            className={`fixed l-50p g|transform:translate(-50%); w-90p h-70 md:w-50p h-60p t-70 mt-30 bg-white z-8 flex flex-col radius-30 pb-20 relative ${desktopContainerClass ? 'md:hidden md:radius-20' : ''}`}
          >
            <div
              className={` w-100p flex j-content-center pb-20 ${desktopContainerClass ? 'md:hidden' : ''}`}
            >
              <div className="flex j-content-center relative a-items-center mt-20 w-80p">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block radius-99 border bg-#F3F3F3 border-none py-12 px-14 outline-none w-100p"
                  placeholder="Search"
                />

                <div className="flex j-content-center a-items-center absolute r-0 radius-50 m-5">
                  <IoIosSearch
                    className="w-25 h-20"
                    onClick={handleOpenSearchModal}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-42 sm:w-90p w-93p mx-auto flex-1 min-h-0 overflow-auto no-scrollbar sm:py-20 py-12">
              {renderResultContent()}
            </div>
          </div>
        </>
      )}
      {product && (
        <ProductDetailModal
          openSingleProductModal={openSingleProductModal}
          handleCloseProductModal={handleCloseProductModal}
          position="homepage"
          product={product}
          variant={undefined}
        />
      )}
    </>
  );
};
