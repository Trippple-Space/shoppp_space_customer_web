"use client";

import BaseNavBar from "@/modules/lib/components/nav-bar/BaseNavBar";
import StorefrontNavBar from "@/modules/lib/components/nav-bar/StorefrontNavBar";
import { BsBasket3 } from "react-icons/bs";
import { LiaCommentsDollarSolid } from "react-icons/lia";
import React, { FC, useEffect, useState } from "react";
import cx from "classnames";
import FabricsCategoryNav from "@/modules/lib/components/nav-bar/category-nav/FabricsCategoryNav";
import ProductTile from "@/modules/lib/components/product-tile/ProductTile";
import Footer from "@/modules/lib/components/footer/Footer";
import { ILayout } from "@/app/layout";
import StorefrontReviews from "./StorefrontReviews";
import { useStoreProductsView } from "@/modules/lib/utility/hooks/views/use-store-products-view";
import { useCategoryNavView } from "@/modules/lib/utility/hooks/views/use-category-nav-view";
import {
  Product,
  ProductCategory,
} from "@/modules/lib/utility/types/product.interface";
import { useCategoryFilter } from "@/modules/lib/utility/hooks/use-category-filter";

const tabs = [
  // {
  //     icon: BsBasket3,
  //     text: "Products",
  //     component: <></>
  // },
  // {
  //     icon: LiaCommentsDollarSolid,
  //     text: "Customer reviews (12,000)",
  //     component: <StorefrontReviews />
  // },
];

const StorefrontLayout: FC<ILayout> = ({ children }) => {
  // const [activeTab, setActiveTab] = useState(tabs[0]);
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null);
  const { products } = useStoreProductsView(selectedCategory);
  const { categories } = useCategoryNavView();
  const [filteredProducts, setFilteredProducts] = useState(products);

  const updateFilters = (filteredProducts: Product[]) => {
    setFilteredProducts(filteredProducts);
  };

  const { handleCategoryChange, categoryCount } = useCategoryFilter(
    products,
    updateFilters
  );

  useEffect(() => {
    if (selectedCategory) {
      handleCategoryChange(selectedCategory);
    } else {
      setFilteredProducts(products);
    }
  }, [selectedCategory, products]);

  return (
    <div>
      <div className="pb-100">
        <div className="relative l:pb-20 pb-10">{children}</div>

        <div className="app-width">
          <div className="flex gap-70 l:text-20 text-14">
            {/* {tabs.map((tab) => (
                            <div
                                onClick={() => setActiveTab(tab)}
                                className={cx(
                                    "flex weight-400 w-fit white-space-nowrap hover:text-green pointer gap-15",
                                    {
                                        "text-green": tab.text == activeTab.text,
                                    }
                                )}
                            >
                                <tab.icon /> <span>{tab.text}</span>
                            </div>
                        ))} */}
          </div>
        </div>

        <div className="border-b border-t border-whitesmoke l:pt-0 pt-20 pb-20 mt-10 mb-50">
          <div className="l:mt--78 mt--70">
            <FabricsCategoryNav
              categories={categories}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
        </div>

        <div className="app-width">
          {/* <div>
                        {activeTab.component}
                    </div> */}
          <section className="l:mt-55 ">
            <h3 className="l:text-20 text-16 weight-300 uppercase">
              New Arrivals
            </h3>
            <div className="grid l:grid-5-cols-1fr grid-2-cols-1fr gap-10 gap-30 w-full">
              {filteredProducts.length ? (
                filteredProducts.map((product, i) => (
                  <>
                    <ProductTile product={product} key={i} />
                  </>
                ))
              ) : (
                <div className="mt-60 grid-col-span-5 text-center bg-white">
                  No products found for the selected filters
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StorefrontLayout;
