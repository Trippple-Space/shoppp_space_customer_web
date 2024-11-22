"use client";

import React, { useEffect, useState } from "react";
import ProductTile from "@/modules/lib/components/product-tile/ProductTile";
import { useTopSalesView } from "@/modules/lib/utility/hooks/views/use-top-sales-view";
import ImageAlt from "@/modules/lib/components/image-alt/ImageAlt";
import {
  Product,
  ProductCategory,
} from "@/modules/lib/utility/types/product.interface";
import { useCategoryFilter } from "@/modules/lib/utility/hooks/use-category-filter";

interface ICentralArena {
  selectedCategory?: ProductCategory;
}

const CentralArena = ({ selectedCategory }: ICentralArena) => {
  const { products, type } = useTopSalesView(selectedCategory);
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  const updateFilters = (filteredProducts: Product[]) => {
    setFilteredProducts(filteredProducts);
  };

  const { handleCategoryChange } = useCategoryFilter(
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
    <>
      <section className="l:mt-20 mt-40 w-100p l:mt-50 mb-150">
        <div className="flex space-between text-20 weight-300 uppercase">
          <h3 className="text-14 l:text-20 weight-300 ">
            Top selling {type ? type : "product"}s ({filteredProducts?.length})
          </h3>
          {/* <p className="text-14 l:text-16 sentence-case">View All</p> */}
        </div>
        <div className="grid l:grid-5-cols-1fr s:grid-3-cols-1fr grid-2-cols-1fr flex-wrap gap-15 l:gap-10 w-full relative">
          {filteredProducts.length ? (
            filteredProducts.map((product, i) => (
              <>
                <ProductTile product={product} key={i} />
              </>
            ))
          ) : (
            <div className="mt-60 bg-white grid-col-span-5 text-center">
              No products found for the selected filters
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CentralArena;