import { useState, useEffect } from "react";
import { ProductCategory } from "../../types/product.interface";
import { useCategoryFilter } from "../use-category-filter";
import { useProducts } from "../use-products";
import { usePathname } from "next/navigation";

export const useTopSalesView = (selectedCategory?: any) => {
  const pathname = usePathname();
  const type = pathname.includes("wears")
    ? "wear"
    : pathname.includes("fabrics")
    ? "fabric"
    : "";
  const { products, updateFilters } = type
    ? useProducts({ filters: { type } })
    : useProducts({});

  const { categories, categoryCount, handleCategoryChange } = useCategoryFilter(
    products,
    updateFilters
  );

  useEffect(() => {
    handleCategoryChange(selectedCategory as any);
  }, [selectedCategory, products])

  return {
    type,
    products,
    categories,
    handleCategoryChange,
    categoryCount
  };
};
