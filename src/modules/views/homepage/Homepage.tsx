"use client";

import React, { useState } from "react";
import FabricsCategoryNav from "@/modules/lib/components/nav-bar/category-nav/FabricsCategoryNav";
import Footer from "@/modules/lib/components/footer/Footer";
import HomepageNavBar from "@/modules/lib/components/nav-bar/HomepageNavBar";
import CentralArena from "./CentralArena";
import { useStoreCategoryNavView } from "@/modules/lib/utility/hooks/views/use-category-nav-view";
import Filters from "@/modules/lib/components/nav-bar/FiltersNav/FiltersComponent";

const Homepage = () => {
  const { categories, setSelectedCategory, selectedCategory } =
    useStoreCategoryNavView();

  return (
    <>
      <div className="border-b border-whitesmoke">
        <HomepageNavBar parent='' />
        <FabricsCategoryNav
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          page={"home"}
          key={categories}
        />
        <Filters />
      </div>
      <div className="app-width">
        <CentralArena />
      </div>
      <Footer />
    </>
  );
};

export default Homepage;
