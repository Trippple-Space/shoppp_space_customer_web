import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useProducts } from "../use-products";
import { useCategories } from "../use-categories";
import { useFilterStore } from "../../store/filter.store";

export const useProductListView = () => {
  const { ref, inView } = useInView({
    threshold: 0.9,
  });
  const [page, setPage] = useState(1);
  const limit = 20;

  const pathname = usePathname();
  const type = pathname.includes("wears") ? "wears" : "fabrics";

  const { selectedCategory, setSelectedCategory } = useCategories({
    type,
    storeId: '',
    label: "GLOBAL"
  });
  const { allFilters } = useFilterStore();

  const { products, setPagination, setSearch, setCollection, query, updateHomePageFilter, loading, fetchingError, refetch } = useProducts({
    filters: { type, status: { In: "ACTIVE,OUT_OF_STOCK" }, channel: "ASOEBI_STORE" }, order: {
      priorityScore: "DESC",
      createdAt: "DESC"
    },
  });

  useEffect(() => {
    const updatedFilters = { ...allFilters, tags: selectedCategory.name === "All" ? "" : selectedCategory.name.toLowerCase() };

    updateHomePageFilter(updatedFilters);
    setPage(1);
    setPagination({ page: 1, limit });
  }, [allFilters, JSON.stringify(query.allFilters), JSON.stringify(query.filters), selectedCategory.name])

  useEffect(() => {
    if (!inView) return;
    if (loading) return;

    if (products.length >= limit && products.length % limit === 0) {
      setPage((prev) => prev + 1);
    }
  }, [inView, loading, products.length]);

  useEffect(() => {
    setPagination({ page, limit });
  }, [page]);

  return {
    type,
    products,
    loading,
    fetchingError,
    setSelectedCategory,
    selectedCategory,
    setSearch,
    search: query.search,  
    setCollection, 
    ref,
    refetch
  };
};
