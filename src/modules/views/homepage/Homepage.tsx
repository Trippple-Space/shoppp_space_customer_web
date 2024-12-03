"use client";

import React, { useState } from "react";
import FabricsCategoryNav from "@/modules/lib/components/nav-bar/category-nav/FabricsCategoryNav";
import Footer from "@/modules/lib/components/footer/Footer";
import HomepageNavBar from "@/modules/lib/components/nav-bar/HomepageNavBar";
import CentralArena from "./CentralArena";
import { useCategoryNavView } from "@/modules/lib/utility/hooks/views/use-category-nav-view";

const Homepage = () => {
  const { categories, setSelectedCategory, selectedCategory } =
    useCategoryNavView();

  return (
    <>
      <div className="border-b border-whitesmoke">
        <HomepageNavBar />
        <FabricsCategoryNav
          categories={categories}
          setSelectedCategory={setSelectedCategory}
          page={"home"}
          key={categories}
        />
      </div>
      <div className="app-width">
        <CentralArena selectedCategory={selectedCategory} />
      </div>
      <Footer />
    </>
  );
};

export default Homepage;
