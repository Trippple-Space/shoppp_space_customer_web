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
              className="h-[42px] w-full px-[3px] outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={() => setOpenSearchModal(true)}
            />
            <TbSearch
              className="w-[24px] h-[24px] min-w-[24px] mr-[10px] cursor-pointer"
              onClick={handleOpenSearchModal}
            />
          </div>
        );

      case 'modernLuxe':
        return (
          <div className="modernLuxe__search-box relative">
            <label htmlFor="search" className="flex">
              <FaSearch
                className="w-[16px] h-[16px] cursor-pointer"
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
          <div className="flex flex-col gap-[22px]">
            <h6 className="font-inter font-bold text-[14px]">Products</h6>
            <p className="text-[13px] text-[#00000099] text-center">
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

  const hasDesktopContainer = variant !== 'simple';

  return (
    <>
      {renderTrigger()}
      {openSearchModal && variant === 'modernEarth' && (
        <div className="absolute hidden md:block min-w-[250px] max-w-[400px] h-[300px] bg-white border border-[#00000014] rounded-[4px] top-[50px] -mt-[3px] z-[8px] overflow-auto no-scrollbar">
          <div className="flex flex-col gap-[42px] w-[95%] mx-auto py-[12px]">
            {renderResultContent()}
          </div>
        </div>
      )}
      {openSearchModal && variant === 'modernLuxe' && (
        <div className="modernLuxe__searchContent md:absolute hidden md:block md:w-[100%] min-w-[200px] md:h-[200px] md:bg-white md:h-[400px] overflow-auto no-scrollbar rounded-[4px] top-[65px] z-[8px]">
          <div className="flex flex-col gap-[42px] w-[95%] mx-auto py-[12px]">
            {renderResultContent()}
          </div>
        </div>
      )}
      {openSearchModal && variant === 'furniture' && (
        <div className="search-box-input hidden md:block md:absolute min-w-[200px] md:h-[200px] overflow-auto no-scrollbar md:bg-white md:border md:border-[#00000014] rounded-[4px] top-[65px] mt-[3px] z-[8px]">
          <div className="flex flex-col gap-[42px] w-[95%] mx-auto py-[12px]">
            {renderResultContent()}
          </div>
        </div>
      )}
      {openSearchModal && (
        <>
          <div
            className={`fixed inset-0 bg-black opacity-70 z-[7px] ${hasDesktopContainer ? 'md:opacity-0' : ''}`}
            onClick={handleOpenSearchModal}
          />

          <div
            className={`fixed left-[50%] -translate-x-1/2 w-[90%] h-[70px] md:w-[50%] h-[60%] top-[70px] mt-[30px] bg-white z-[8px] flex flex-col rounded-[30px] pb-[20px] relative ${hasDesktopContainer ? 'md:hidden md:rounded-[20px]' : ''}`}
          >
            <div
              className={` w-full flex justify-center pb-[20px] ${hasDesktopContainer ? 'md:hidden' : ''}`}
            >
              <div className="flex justify-center relative items-center mt-[20px] w-[80%]">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block rounded-[99px] border bg-[#F3F3F3] border-none py-[12px] px-[14px] outline-none w-full"
                  placeholder="Search"
                />

                <div className="flex justify-center items-center absolute right-0 rounded-[50px] m-[5px]">
                  <IoIosSearch
                    className="w-[25px] h-[20px]"
                    onClick={handleOpenSearchModal}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[42px] sm:w-[90%] w-[93%] mx-auto flex-1 min-h-0 overflow-auto no-scrollbar sm:py-[20px] py-[12px]">
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
