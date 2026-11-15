import { useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useProducts } from "../use-products";
import { useCategories } from "../use-categories";
import { useFilterStore } from "../../store/filter.store";

export const useProductListView = () => {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px 0px",
  });
  const limit = 20;

  const pathname = usePathname();
  const type = pathname.includes("wears") ? "wears" : "fabrics";

  const { selectedCategory, setSelectedCategory } = useCategories({
    type,
    storeId: "",
    label: "GLOBAL",
  });
  const { allFilters } = useFilterStore();

  const {
    products,
    setPagination,
    setSearch,
    setCollection,
    query,
    updateHomePageFilter,
    loading,
    loadingMore,
    fetchingError,
    loadMoreError,
    refetch,
    retryLoadMore,
    fetchNextPage,
    hasMore,
  } = useProducts({
    filters: {
      type,
      status: { In: "ACTIVE,OUT_OF_STOCK" },
      channel: "LEGACY_MARKETPLACE_STORE",
    },
    order: {
      priorityScore: "DESC",
      createdAt: "DESC",
    },
  });

  useEffect(() => {
    const categoryName = selectedCategory?.name ?? "";
    const tags =
      categoryName && categoryName !== "All"
        ? categoryName
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
            .map((t) => t.toLowerCase())
        : [];

    const updatedFilters = { ...allFilters, tags: tags.length ? tags : "" };

    updateHomePageFilter(updatedFilters);
    setPagination({ page: 1, limit });
  }, [
    allFilters,
    JSON.stringify(query.allFilters),
    JSON.stringify(query.filters),
    selectedCategory.name,
  ]);

  const loadMore = useCallback(() => {
    if (loading) return;
    if (loadMoreError) {
      retryLoadMore();
      return;
    }
    if (!hasMore) return;
    fetchNextPage();
  }, [loading, loadMoreError, hasMore, retryLoadMore, fetchNextPage]);

  useEffect(() => {
    if (!inView) return;
    if (loading) return;
    if (!hasMore) return;
    if (loadMoreError) return;

    fetchNextPage();
  }, [inView, loading, hasMore, loadMoreError, fetchNextPage]);

  const isInitialFetchError =
    Boolean(fetchingError) && products.length === 0;

  return {
    type,
    products,
    loading,
    loadingMore,
    fetchingError,
    loadMoreError,
    isInitialFetchError,
    hasMore,
    setSelectedCategory,
    selectedCategory,
    setSearch,
    search: query.search,
    setCollection,
    ref,
    refetch,
    retryLoadMore,
    loadMore,
  };
};
