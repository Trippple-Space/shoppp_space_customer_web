"use client";

import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { Store } from "../../utility/types/store.interface";
import SearchInput from "../search-input/SearchInput";
import MiniCart from "../minicart/MiniCart";
import { HiMenuAlt3 } from "react-icons/hi";
import { productService } from "../../utility/services/product.service";
import { Product } from "../../utility/types/product.interface";

const StorefrontNavBar = ({ store }: { store?: Store }) => {
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
    <nav className="flex flex-row j-content-between a-items-center border border-0 border-b-1 border-b-#00000014 py-14 px-80">
      <h1 className="font-robotoMono font-500 text-28 text-center">Amitex</h1>
      <SearchInput
        inputClassname={
          "hidden flex l:block border-none bg-none outline-none l:w-100p text-16 l:py-12"
        }
        searchClassname={""}
        svgSize={"w-16 h-16"}
        mainSearchClass={classNames(
          "flex flex-row a-items-center border border-faint-grey l:px-14",
          {
            "l:radius-99": !openSearchModal,
            "l:radius-t-r-9": openSearchModal,
            "l:radius-t-l-9": openSearchModal,
          }
        )}
        children={""}
        searchTerm={""}
        placeholder={"Search"}
        onChange={() => {}}
        onClick={() => {}}
        onSearchClick={() => {}}
      />
      <div className="flex flex-row gap-24 a-items-center">
        <MiniCart />
        <div className="flex flex-row a-items-center gap-8 p-4 pl-12 border border-#00000014 radius-999">
          <HiMenuAlt3 className="w-24 h-24" />
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.50uZrI8ZshDl7RCBSo3vDwHaLH%26pid%3DApi&f=1&ipt=66bd43b9ebc1bff46a070e65bf39249b9fea914bd3766c1844a13dbebd14e6b7&ipo=images"
            alt="user"
            className="w-42 h-42 object-fit round border border-#00000014"
          />
        </div>
      </div>
    </nav>
  );
};

export default StorefrontNavBar;
