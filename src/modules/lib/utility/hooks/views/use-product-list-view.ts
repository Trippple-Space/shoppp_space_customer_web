import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useProducts } from "../use-products";
import { useCategories } from "../use-categories";
import { useFilterStore } from "../../store/filter.store";

export const useProductListView = () => {
  const { ref, inView } = useInView();
  const [page, setPage] = useState(0);
  const limit = 20;

  const pathname = usePathname();
  const type = pathname.includes("wears") ? "wears" : "fabrics";

  const { selectedCategory, setSelectedCategory } = useCategories({
    type,
    storeId: 0,
    label: "GLOBAL"
  });
  const { allFilters } = useFilterStore();

  const { products, setPagination, query, updateHomePageFilter, loading } = useProducts({
    filters: { type, status: { In: ["ACTIVE", "OUT_OF_STOCK"] }, channel: "ASOEBI_STORE"}
  });

  useEffect(() => {
    const updatedFilters = { ...allFilters, tags: selectedCategory.name === "All" ? "" : selectedCategory.name.toLowerCase() };

    updateHomePageFilter(updatedFilters);
    setPagination({ page: 0, limit});
  }, [allFilters, JSON.stringify(query.allFilters), JSON.stringify(query.filters), selectedCategory.name])

  useEffect(() => {
    if (inView) {
      if (products.length > 20 && products.length % 20 === 0) {
        setPage((prev) => prev + 1);
      }
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
