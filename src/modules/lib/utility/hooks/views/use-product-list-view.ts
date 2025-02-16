import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useProducts } from "../use-products";
import { useCategories } from "../use-categories";
import { useFilter } from "../use-filter";

export const useProductListView = () => {
  const { ref, inView } = useInView();
  const [page, setPage] = useState(1);
  const limit = 20;

  const pathname = usePathname();
  const type = pathname.includes("wears") ? "wears" : "fabrics";

  const { selectedCategory, setSelectedCategory } = useCategories({
    type,
    storeId: 0,
    label: "GLOBAL"
  });
  const { allFilters } = useFilter();

  const { products, setPagination, updateFilters, query, updateHomePageFilter, loading } = useProducts({
    filters: { type, status: { In: ["ACTIVE", "OUT_OF_STOCK"] } }
  });

  useEffect(() => {
    updateFilters(selectedCategory.filters);
  }, [selectedCategory?.name]);

  useEffect(() => {
    updateHomePageFilter(allFilters)
    setPagination({ page: 0, limit });
  }, [allFilters, JSON.stringify(query.allFilters), JSON.stringify(query.filters)])

  useEffect(() => {
    if (inView) {
      setPage((prev) => prev + 1);
      setPagination({ page, limit });
    }
  }, [inView]);

  return {
    type,
    products,
    loading,
    setSelectedCategory,
    selectedCategory,
    ref
  };
};
