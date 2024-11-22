"use client";

import React from "react";
import BaseNavBar from "./BaseNavBar";

import SearchInput from "../search-input/SearchInput";

const HomepageNavBar = () => {
  return (
    <BaseNavBar
      links={
        <SearchInput
          placeholder={"Search asoebi.africa"}
          svgSize={"w-25 h-20 color-black l:color-white"}
          component={"home"}
        ></SearchInput>
      }
    />
  );
};

export default HomepageNavBar;
