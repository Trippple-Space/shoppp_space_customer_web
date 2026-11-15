"use client";

import React from "react";
import BaseNavBar from "./BaseNavBar";

import SearchInput from "../search-input/SearchInput";

const HomepageNavBar = ({ parent }: { parent?: any }) => {
  return (
    <BaseNavBar
      links={
        parent !== "checkout" && (
          <SearchInput
            placeholder={"Search Shoppp Space"}
            component={"home"}
          ></SearchInput>
        )
      }
      parent={parent}
    />
  );
};

export default HomepageNavBar;
