import React from "react";
import BaseCategoryNav from "./BaseCategoryNav";

const FabricsCategoryNav = ({ categories, setSelectedCategory, page }: any) => {
  return (
    <div
      className={` ${
        page === "home"
          ? "l:mt-100 mt-94 pb-20 app-width test-header"
          : "mx-24 sm:mx-40 md:mx-60 l:mx-100 xl:mx-200 "
      } t-75 bg-white z-1`}
    >
      <BaseCategoryNav
        categories={categories}
        setSelectedCategory={setSelectedCategory}
        page={page}
      />
    </div>
  );
};

export default FabricsCategoryNav;
