import { useState, useEffect } from "react";
import { ProductCategory } from "../../types/product.interface";
import { useProducts } from "../use-products";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { useCategoryFilter } from "../use-category-filter";


export const useStoreProductsView = (selectedCategory?: any) => {
  const { slug } = useParams();

  const { products, updateFilters } = useProducts({
    filters: { store: { slug } },
  });

  return {
    products,
    slug,
  };
};
