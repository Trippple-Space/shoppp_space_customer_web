"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import FabricsCategoryNav from "@/modules/lib/components/nav-bar/category-nav/FabricsCategoryNav";
import ProductTile from "@/modules/lib/components/product-tile/ProductTile";
import Footer from "@/modules/lib/components/footer/Footer";
import { ILayout } from "@/app/layout";
import { useStoreProductsView } from "@/modules/lib/utility/hooks/views/use-store-products-view";
import { useCategoryNavView } from "@/modules/lib/utility/hooks/views/use-category-nav-view";
import {
  Product,
  ProductCategory,
} from "@/modules/lib/utility/types/product.interface";
import { useCategoryFilter } from "@/modules/lib/utility/hooks/use-category-filter";
import { MdChevronRight } from "react-icons/md";
import { GoArrowRight } from "react-icons/go";
import Link from "next/link";
import ScrollButtons from "@/modules/lib/components/scroll-buttons/scrollButtons";

const StorefrontLayout: FC<ILayout> = ({ children }) => {
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null);
  const { products } = useStoreProductsView(selectedCategory);
  const { categories } = useCategoryNavView();
  const [filteredProducts, setFilteredProducts] = useState(products);

  const updateFilters = (filteredProducts: Product[]) => {
    setFilteredProducts(filteredProducts);
  };

  const { handleCategoryChange } = useCategoryFilter(products, updateFilters);

  useEffect(() => {
    if (selectedCategory) {
      handleCategoryChange(selectedCategory);
    } else {
      setFilteredProducts(products);
    }
  }, [selectedCategory, products]);

  return (
    <div>
      <div className="flex flex-col md:gap-36 sm:gap-28 gap-32 pb-100">
        <div className="">{children}</div>

        <div className="sm:py-20 py-16">
          <FabricsCategoryNav
            categories={categories}
            setSelectedCategory={setSelectedCategory}
            page={"store"}
          />
        </div>

        <div className="px-24 sm:px-40 md:px-60 l:px-100 xl:px-200 flex flex-col gap-20">
          <section className="bg-#FEFBE8 radius-16 sm:p-24 p-20 flex flex-col md:gap-24 sm:gap-20 gap-24 w-full relative">
            <div className="flex flex-row j-content-between a-items-center">
              <h3 className="sm:text-24 text-20 weight-600 color-#000000E0">
                New arrivals
              </h3>
              <Link
                href={"/"}
                className="bg-black text-white sm:py-8 py-6 px-14 flex flex-row a-items-center gap-6 radius-6"
              >
                <span className="sm:text-16 text-14 weight-600">View more</span>
                <MdChevronRight className="w-16 h-16 sm:inline hidden" />
              </Link>
            </div>
            <div className="scroll-x no-scrollbar" ref={scrollRef1}>
              <div className="flex h-fit w-fit whitespace-nowrap gap-14 arrivals">
                {filteredProducts.length ? (
                  filteredProducts.map((product, i) => (
                    <>
                      <div className="l:w-238 md:w-230 sm:w-220 w-150 l:mt--20 mt--30">
                        <ProductTile product={product} key={i} />
                      </div>
                    </>
                  ))
                ) : (
                  <div className="mt-60 text-center">
                    No products found for the selected filters
                  </div>
                )}
              </div>
            </div>
            <ScrollButtons
              scrollRef={scrollRef1}
              page={"productScroll"}
              scrollLength={filteredProducts.length}
              component={"products"}
            />
          </section>

          <section className="bg-#FFF3F1 radius-16 sm:p-24 p-20 flex flex-col md:gap-24 sm:gap-20 gap-24 w-full relative">
            <div className="flex flex-row j-content-between a-items-center">
              <h3 className="sm:text-24 text-20 weight-600 color-#000000E0">
                Deals for you
              </h3>
              <Link
                href={"/"}
                className="bg-black text-white sm:py-8 py-6 px-14 flex flex-row a-items-center gap-6 radius-6"
              >
                <span className="sm:text-16 text-14 weight-600">View more</span>
                <MdChevronRight className="w-16 h-16 sm:inline hidden" />
              </Link>
            </div>
            <div className="scroll-x no-scrollbar" ref={scrollRef2}>
              <div className="flex h-fit w-fit whitespace-nowrap gap-14">
                {filteredProducts.length ? (
                  filteredProducts.map((product, i) => (
                    <>
                      <div className="l:w-238 md:w-230 sm:w-220 w-150 l:mt--20 mt--30">
                        <ProductTile product={product} key={i} />
                      </div>
                    </>
                  ))
                ) : (
                  <div className="mt-60 text-center">
                    No products found for the selected filters
                  </div>
                )}
              </div>
            </div>
            <ScrollButtons
              scrollRef={scrollRef2}
              page={"productScroll"}
              scrollLength={filteredProducts.length}
              component={"products"}
            />
          </section>
        </div>

        <section className="flex flex-col sm:gap-24 gap-20 mx-24 sm:mx-40 md:mx-60 l:mx-100 xl:mx-200">
          <div className="flex flex-row j-content-between a-items-center">
            <h3 className="sm:text-24 text-16 weight-600">Featured products</h3>
            <Link
              href={"/"}
              className="text-16 flex flex-row a-items-center gap-3"
            >
              <span className="sm:inline-block hidden">Browse all products</span>
              <GoArrowRight className="w-16 h-16 sm:mb--2" />
            </Link>
          </div>
          <div className="grid l:grid-4-cols-1fr sm:grid-3-cols-1fr grid-2-cols-1fr l:gap-20 sm:gap-10 gap-20 w-full">
            {filteredProducts.length ? (
              filteredProducts.map((product, i) => (
                <>
                  <div className="l:mt--20 mt--30">
                    <ProductTile product={product} key={i} />
                  </div>
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
      <Footer />
    </div>
  );
};

export default StorefrontLayout;
