"use client";

import React from "react";
import { Store } from "../../utility/types/store.interface";
import SearchInput from "../search-input/SearchInput";
import MiniCart from "../minicart/MiniCart";
import { HiMenuAlt3 } from "react-icons/hi";
import { useNavbarView } from "../../utility/hooks/views/use-navbar-view";
import MobileNav from "./mobile-nav/MobileNav";

const StorefrontNavBar = ({ store }: { store?: Store }) => {
  const { user } = useNavbarView();

  return (
    <nav className="flex flex-row j-content-between a-items-center border border-0 border-b-1 border-b-#00000014 sm:py-14 py-12 l:px-80 md:px-60 sm:px-40 px-24">
      <div className="md:flex-grow-0 flex-grow-1">
        <h1 className="font-robotoMono weight-500 md:text-28 sm:text-26 text-22 w-fit">
          {store?.name}
        </h1>
      </div>

      <SearchInput
        svgSize={"md:w-16 w-24 md:h-16 h-24 md:mb-0 mb--5 md:mr-14"}
        placeholder={"Search"}
        component={"store"}
      />
      <div className="flex flex-row md:gap-24 gap-20 a-items-center">
        <MiniCart />
        <div className="sm:flex hidden flex-row a-items-center gap-8 p-4 pl-12 border border-#00000014 radius-999 pointer">
          <HiMenuAlt3 className="w-24 h-24" />
          <img
            src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user?.username}`}
            alt="user"
            className="w-42 h-42 object-fit round border border-#00000014"
          />
        </div>
        <div className="sm:hidden block">
          <MobileNav />
        </div>
      </div>
    </nav>
  );
};

export default StorefrontNavBar;
