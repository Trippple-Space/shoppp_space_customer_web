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

  const { products, setPagination, setSearch, setCollection, query, updateHomePageFilter, loading, fetchingError, loadMoreError, refetch, retryLoadMore, meta } = useProducts({
    filters: { type, status: { In: "ACTIVE,OUT_OF_STOCK" }, channel: "ASOEBI_STORE" }, order: {
      priorityScore: "DESC",
      createdAt: "DESC"
    },
    /* pagination: { page: 1, limit }, */
  });

  useEffect(() => {
    const categoryName = selectedCategory?.name ?? "";
    const tags = categoryName && categoryName !== "All"
      ? categoryName
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .map((t) => t.toLowerCase())
      : [];

    const updatedFilters = { ...allFilters, tags: tags.length ? tags : "" };

    updateHomePageFilter(updatedFilters);
    setPage(1);
    setPagination({ page: 1, limit });
  }, [allFilters, JSON.stringify(query.allFilters), JSON.stringify(query.filters), selectedCategory.name])

  useEffect(() => {
    if (!inView) return;
    if (loading) return;
    if (loadMoreError) return;

    const totalPages = meta?.totalPages ?? 1;
    const currentPage = meta?.currentPage ?? page;
    if (currentPage < totalPages) {
      setPage((prev) => prev + 1);
    }
  }, [inView, loading, loadMoreError, meta?.currentPage, meta?.totalPages, page]);

  useEffect(() => {
    setPagination({ page, limit });
  }, [page]);

  return {
    type,
    products,
    loading,
    fetchingError,
    loadMoreError,
    setSelectedCategory,
    selectedCategory,
    setSearch,
    search: query.search,  
    setCollection, 
    ref,
    refetch,
    retryLoadMore,
  };
};
