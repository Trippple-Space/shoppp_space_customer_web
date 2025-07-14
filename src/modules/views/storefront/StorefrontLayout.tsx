"use client";

import React, { FC, ReactNode, useEffect, useRef, useState } from "react";
import FabricsCategoryNav from "@/modules/lib/components/nav-bar/category-nav/FabricsCategoryNav";
import ProductTile from "@/modules/lib/components/product-tile/ProductTile";
import { useStoreProductsView } from "@/modules/lib/utility/hooks/views/use-store-products-view";
import { useStoreCategoryNavView } from "@/modules/lib/utility/hooks/views/use-category-nav-view";
import {
  Product,
  ProductCategory,
} from "@/modules/lib/utility/types/product.interface";
import { useCategoryFilter } from "@/modules/lib/utility/hooks/use-category-filter";
import { MdChevronRight } from "react-icons/md";
import { GoArrowRight } from "react-icons/go";
import Link from "next/link";
import ScrollButtons from "@/modules/lib/components/scroll-buttons/scrollButtons";
import { Store } from "@/modules/lib/utility/types/store.interface";
import Footer from "@/modules/lib/components/footer/Footer";
import useUserStore from "@/modules/lib/utility/store/user.store";
import { useGetIPAddress } from "@/modules/lib/utility/hooks/use-get-ip-address";
import { useLogVisit } from "@/modules/lib/utility/hooks/use-log-visit";
import useReviews from "@/modules/lib/utility/hooks/use-reviews";

const StorefrontLayout: FC<{ store: Store; children: ReactNode }> = ({
  store,
  children,
}) => {
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null);
  const { products } = useStoreProductsView(selectedCategory);
  const { allReviews } = useReviews()
  const { categories } = useStoreCategoryNavView({ storeId: store.id });
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [dealsForYou, setDealsForYou] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [openReviewId, setOpenReviewId] = useState<number | null>(null);

  const updateFilters = (filteredProducts: Product[]) => {
    setFilteredProducts(filteredProducts);
  };

  const { handleCategoryChange } = useCategoryFilter(products, updateFilters);

  const [hasScrolled, setHasScrolled] = useState(false);
  const { isAuthenticated } = useUserStore();
  const { ipAddress } = useGetIPAddress();
  const [hasPerformedAction, setHasPerformedAction] = useState(false);
  const { logVisit } = useLogVisit(store?.id, { ipAddress: ipAddress });

  useEffect(() => {
    const filterProducts = () => {
      if (selectedCategory) {
        handleCategoryChange(selectedCategory);
      } else {
        if (products.length > 0) {
          setFilteredProducts(products);
        }
      }
    }

    filterProducts()
  }, [selectedCategory, products]);

  useEffect(() => {
    const sectionCategories = () => {
      const deals: Product[] = [];
      const newDeals: Product[] = [];
      const remainingDeals: Product[] = [];

      filteredProducts.forEach((product) => {
        if (!product?.tags) return;

        let isCategorized = false;

        product.tags.forEach((tag) => {
          const label = tag.label.toLowerCase();

          if (label.includes("new arrivals")) {
            newDeals.push(product);
            isCategorized = true;
          } else if (label.includes("deals for you")) {
            deals.push(product);
            isCategorized = true;
          }
        });

        if (
          !isCategorized &&
          !remainingDeals.some((deal) => deal.id === product.id)
        ) {
          remainingDeals.push(product);
        }
      });

      setDealsForYou(deals);
      setNewArrivals(newDeals);
      setFeaturedProducts(remainingDeals);
    };

    sectionCategories();
  }, [filteredProducts]);

  useEffect(() => {
    // Define the function to be triggered after 1 minute
    const triggerFunction = () => {
      if (isAuthenticated && hasScrolled && hasPerformedAction) {
        logVisit();
      }
    };
    // Set up the timer
    const timer = setTimeout(triggerFunction, 10000);

    // Scroll event handler
    const handleScroll = () => {
      setHasScrolled(true);
    };
    // Click event handler
    const handleClick = () => {
      setHasPerformedAction(true);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    // Add click event listener
    window.addEventListener("click", handleClick);

    // Cleanup: remove event listener and clear timeout
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClick);
      clearTimeout(timer);
    };
  }, [isAuthenticated, hasScrolled, hasPerformedAction]);

  console.log(categories)

  return (
    <div>
      <div className="flex flex-col md:gap-36 sm:gap-28 gap-32 pb-100">
        <div className="">{children}</div>

        {
          !!categories?.length && (
            <div className="sm:py-20 py-16">
              <FabricsCategoryNav
                categories={categories}
                setSelectedCategory={setSelectedCategory}
                page={"store"}
                key={categories}
              />
            </div>
          )
        }

        {
          (!!newArrivals?.length || !!dealsForYou.length) && (
            <div className="px-24 sm:px-40 md:px-60 l:px-100 xl:px-200 flex flex-col gap-20">
              {!!newArrivals?.length && (
                <section
                  className={`bg-#FEFBE8 radius-16 sm:p-24 p-20 flex flex-col md:gap-24 sm:gap-20 gap-24 w-full relative`}
                  key={newArrivals[0]?.id}
                >
                  <div className="flex flex-row j-content-between a-items-center">
                    <h3 className="sm:text-24 text-20 weight-600 color-#000000E0">
                      New arrivals
                    </h3>

                    {newArrivals?.length > 4 && (
                      <Link
                        href={"/"}
                        className="bg-black text-white sm:py-8 py-6 px-14 flex flex-row a-items-center gap-6 radius-6"
                      >
                        <span className="sm:text-16 text-14 weight-600">
                          View more
                        </span>
                        <MdChevronRight className="w-16 h-16 sm:inline hidden" />
                      </Link>
                    )}
                  </div>
                  <div className="scroll-x no-scrollbar" ref={scrollRef1}>
                    <div
                      className={`flex h-fit ${newArrivals?.length && "w-fit"
                        } whitespace-nowrap gap-14`}
                    >
                      {newArrivals?.length ? (
                        newArrivals?.map((product, i) => (
                          <div
                            key={i}
                            className="l:w-238 md:w-230 sm:w-220 w-150 l:mt--20 mt--30"
                          >
                            <ProductTile
                              product={product}
                              key={i}
                              allReviews={allReviews}
                              id={product.id}
                              isOpen={openReviewId}
                              setIsOpen={setOpenReviewId} />
                          </div>
                        ))
                      ) : (
                        <div className="mt-60 text-center flex-grow-1">
                          No products found for new arrivals
                        </div>
                      )}
                    </div>
                  </div>
                  <ScrollButtons
                    scrollRef={scrollRef1}
                    page={"productScroll"}
                    scrollLength={newArrivals.length}
                    component={"products"}
                  />
                </section>
              )}

              {!!dealsForYou.length && (
                <section
                  className={`bg-#FFF3F1 radius-16 sm:p-24 p-20 flex flex-col md:gap-24 sm:gap-20 gap-24 w-full relative`}
                  key={dealsForYou[0]?.id}
                >
                  <div className="flex flex-row j-content-between a-items-center">
                    <h3 className="sm:text-24 text-20 weight-600 color-#000000E0">
                      Deals for you
                    </h3>
                    {dealsForYou?.length > 4 && (
                      <Link
                        href={"/"}
                        className="bg-black text-white sm:py-8 py-6 px-14 flex flex-row a-items-center gap-6 radius-6"
                      >
                        <span className="sm:text-16 text-14 weight-600">
                          View more
                        </span>
                        <MdChevronRight className="w-16 h-16 sm:inline hidden" />
                      </Link>
                    )}
                  </div>
                  <div className="scroll-x no-scrollbar" ref={scrollRef2}>
                    <div
                      className={`flex h-fit ${newArrivals?.length && "w-fit"
                        } whitespace-nowrap gap-14`}
                    >
                      {dealsForYou.length ? (
                        dealsForYou.map((product, i) => (
                          <div
                            key={i}
                            className="l:w-238 md:w-230 sm:w-220 w-150 l:mt--20 mt--30"
                          >
                            <ProductTile
                              product={product}
                              key={i}
                              allReviews={allReviews}
                              id={product.id}
                              isOpen={openReviewId}
                              setIsOpen={setOpenReviewId}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="mt-60 text-center flex-grow-1">
                          No products found for deals for you
                        </div>
                      )}
                    </div>
                  </div>
                  <ScrollButtons
                    scrollRef={scrollRef2}
                    page={"productScroll"}
                    scrollLength={dealsForYou.length}
                    component={"products"}
                  />
                </section>
              )}
            </div>
          )
        }

        <section className="flex flex-col sm:gap-24 gap-20 mx-24 sm:mx-40 md:mx-60 l:mx-100 xl:mx-200">
          <div className="flex flex-row j-content-between a-items-center">
            <h3 className="sm:text-24 text-16 weight-600">Featured products</h3>
            {featuredProducts?.length > 4 && (
              <Link
                href={"/"}
                className="text-16 flex flex-row a-items-center gap-3"
              >
                <span className="sm:inline-block hidden">
                  Browse all products
                </span>
                <GoArrowRight className="w-16 h-16 sm:mb--2" />
              </Link>
            )}
          </div>
          <div className="grid l:grid-4-cols-1fr sm:grid-3-cols-1fr grid-2-cols-1fr l:gap-20 sm:gap-10 gap-20 w-full">
            {featuredProducts.length ? (
              featuredProducts.map((product, i) => (
                <div key={i} className="l:mt--20 mt--30 w-full overflow-hidden">
                  <ProductTile
                    product={product}
                    key={i}
                    allReviews={allReviews}
                    id={product.id}
                    isOpen={openReviewId}
                    setIsOpen={setOpenReviewId}
                  />
                </div>
              ))
            ) : (
              <div className="mt-60 grid-col-span-5 text-center bg-white">
                No products found for the selected filters
              </div>
            )}
          </div>
        </section>
      </div>
      {/* <div className="h-screen"></div> */}
      <Footer />
    </div>
  );
};

export default StorefrontLayout;
