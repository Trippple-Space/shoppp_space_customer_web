"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import BaseNavBar from "./BaseNavBar";
import { usePathname } from "next/navigation";
import { IoIosSearch } from "react-icons/io";

import Image from "../image/Image";
import { productService } from "../../utility/services/product.service";
import { Product } from "../../utility/types/product.interface";
import { formatNumberAsPrice } from "../../utility/utility";
import Link from "next/link";
import SearchModal from "../search-modal/SearchModal";
import classNames from "classnames";
import SearchInput from "../search-input/SearchInput";

const HomepageNavBar = () => {
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const [openSearchModal, setOpenSearchModal] = useState<boolean>(false);

  const handleOpenSearchModal = () => {
    setOpenSearchModal((prev) => !prev);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await productService.fetchProductBySearch(searchTerm);
        setSearchResults(result);
        console.log({ result });
      } catch (err) {
        console.error(err);
      }
    };
    if (searchTerm) {
      fetchProducts();
    }
  }, [searchTerm]);

  return (
    <BaseNavBar
      links={
        <div className="sm:mx-auto flex a-items-end gap-30 l:gap-50 sm:gap-40 weight-200 text-14 l:text-16 l:w-440 md:w-340 sm:w-260 w-full">
          <SearchInput
            mainSearchClass={
              "flex relative w-100p sm:l-30 sm:j-content-start j-content-end mr-20"
            }
            inputClassname={classNames(
              "hidden flex sm:block sm:border sm:bg-#F3F3F3 sm:border-none sm:pb-12 sm:pt-12 sm:pl-14 sm:pr-14 sm:outline-none sm:w-100p",
              {
                "sm:radius-99": !openSearchModal,
                "sm:radius-t-r-9": openSearchModal,
                "sm:radius-t-l-9": openSearchModal,
              }
            )}
            searchTerm={searchTerm}
            searchClassname={classNames(
              "flex sm:bg-#0B9378 sm:absolute sm:r-0 sm:radius-50 sm:t-4 sm:p-6 sm:pl-4 sm:pr-4 sm:mr-3 sm:cursor-pointer color-black sm:color-#fff",
              {
                "sm:radius-8": openSearchModal,
              }
            )}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={() => setOpenSearchModal(true)}
            onSearchClick={handleOpenSearchModal}
          >
            {openSearchModal && (
              <div
                className={classNames(
                  "hidden sm:block sm:absolute sm:bg-#f3f3f3 sm:w-100p sm:h-400 sm:bg-#F3F3F3 sm:t-35 z-10",
                  {
                    "sm:radius-b-r-9": openSearchModal,
                    "sm:radius-b-l-9": openSearchModal,
                  }
                )}
              >
                <SearchModal searchResults={searchResults} />
              </div>
            )}
          </SearchInput>

          {openSearchModal && (
            <>
              <div
                className="fixed inset-0 bg-black opacity-70 z-1 sm:opacity-0"
                onClick={handleOpenSearchModal}
              />
              <div className="fixed l-50p g|transform:translate(-50%) w-90p h-70 sm:w-50p h-60p t-70 mt-30 bg-white z-10 radius-8 pb-20 relative sm:mt-0 sm:t-60 sm:hidden">
                <SearchInput
                  inputClassname={
                    "block radius-99 border bg-#F3F3F3 border-none pb-12 pt-12 pl-14 pr-14 outline-none w-80p"
                  }
                  mainSearchClass={
                    "flex fixed w-100p j-content-center mt-20 border-b pb-20 border-b-#00000014 l:hidden"
                  }
                  searchClassname={
                    "flex bg-#0B9378 absolute radius-50 r-10p t-4 p-6 mr-4 color-#fff"
                  }
                  searchTerm={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onSearchClick={handleOpenSearchModal}
                  onClick={() => console.log("h")}
                >
                  {""}
                </SearchInput>
                {searchResults.length > 0 && (
                  <SearchModal searchResults={searchResults} />
                )}
              </div>
            </>
          )}
        </div>
      }
    />
  );
};

export default HomepageNavBar;
