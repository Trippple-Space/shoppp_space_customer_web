"use client";

import BaseNavBar from "@/modules/lib/components/nav-bar/BaseNavBar";
import StorefrontNavBar from "@/modules/lib/components/nav-bar/StorefrontNavBar";
import { BsBasket3 } from "react-icons/bs";
import { LiaCommentsDollarSolid } from "react-icons/lia";
import React, { useState } from "react";
import cx from "classnames";
import FabricsCategoryNav from "@/modules/lib/components/nav-bar/category-nav/FabricsCategoryNav";
import ProductTile from "@/modules/lib/components/product-tile/ProductTile";
import Footer from "@/modules/lib/components/footer/Footer";
import HomepageNavBar from "@/modules/lib/components/nav-bar/HomepageNavBar";
import Filters from "../../lib/components/nav-bar/category-nav/FiltersComponent";
import { TbShoppingBag } from "react-icons/tb";
import MiniCart from "../../lib/components/minicart/MiniCart";
import AsoebiHomepage from "./AsoebiPage";
import { usePathname } from "next/navigation";
import CentralArena from "./CentralArena";
import NoResultMessage from "@/modules/lib/components/error-messages/no-result-found";
import { useCategoryNavView } from "@/modules/lib/utility/hooks/views/use-category-nav-view";

const Homepage = () => {
  const { categories } = useCategoryNavView();
  const [selectedCategory, setSelectedCategory] = useState();
  const pathname = usePathname();

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
