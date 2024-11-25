"use client";

import React, { useState } from "react";
import FabricsCategoryNav from "@/modules/lib/components/nav-bar/category-nav/FabricsCategoryNav";
import Footer from "@/modules/lib/components/footer/Footer";
import HomepageNavBar from "@/modules/lib/components/nav-bar/HomepageNavBar";
import CentralArena from "./CentralArena";
import { useCategoryNavView } from "@/modules/lib/utility/hooks/views/use-category-nav-view";

const Homepage = () => {
  const { categories } = useCategoryNavView();
  const [selectedCategory, setSelectedCategory] = useState();

  return (
    <>
      <HomepageNavBar />
      <FabricsCategoryNav
        categories={categories}
        setSelectedCategory={setSelectedCategory}
        page={"home"}
      />
      <div className="app-width">
        <CentralArena selectedCategory={selectedCategory} />
      </div>
      <Footer />
    </>
  );
};

export default Homepage;
