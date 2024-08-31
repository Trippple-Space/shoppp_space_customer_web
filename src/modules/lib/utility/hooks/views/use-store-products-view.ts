import { useState, useEffect } from "react";
import { ProductCategory } from "../../types/product.interface";
import { useProducts } from "../use-products";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { useCategoryFilter } from "../use-category-filter";

export const useStoreProductsView = (selectedCategory?: any) => {
  const { slug } = useParams();
  const { products, updateFilters } = useProducts({
    filters: { store: { slug }},
  });

  const { categories, categoryCount, handleCategoryChange } = useCategoryFilter(products, updateFilters);

  useEffect(() => {
    handleCategoryChange(selectedCategory as any);
  }, [selectedCategory, products])

  return {
    products,
    categories,
    handleCategoryChange,
    categoryCount
  }
}

