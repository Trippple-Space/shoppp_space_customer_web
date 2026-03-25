import { useEffect, useState } from "react";
import { useProducts } from "../use-products";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useCategories } from "../use-categories";
import { useFilterStore } from "../../store/filter.store";


export const useStoreProductsView = (storeId: string) => {
  const { slug } = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryType = pathname.includes("wears") ? "wears" : "fabrics";

  const [page, setPage] = useState(1);
  const limit = 20;
  const { allFilters } = useFilterStore();
  const { selectedCategory } = useCategories({
    type: categoryType,
    storeId,
    label: "STORE",
  });

  const searchFromPath = (searchParams.get("search") ?? "").trim();

  const { products, setPagination, setSearch, setCollection, updateHomePageFilter, query, loading, fetchingError, refetch, meta } = useProducts({
    filters: { store: { slug }, status: { In: "ACTIVE,OUT_OF_STOCK" } }, order: {
      priorityScore: "DESC",
      createdAt: "DESC"
    },
    pagination: { page, limit },
    search: searchFromPath || undefined,
  }, 'buttons');

  useEffect(() => {
    setPagination({ page, limit });
  }, [page]);

  useEffect(() => {
    const nextSearch = (searchParams.get("search") ?? "").trim();
    const collectionFromUrl = (searchParams.get("collection") ?? "").trim();
    setSearch(nextSearch || undefined);
    setCollection(collectionFromUrl || undefined);
    setPage(1);
    setPagination({ page: 1, limit });
  }, [searchParams.toString()]);

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
  }, [allFilters, JSON.stringify(query.allFilters), JSON.stringify(query.filters), selectedCategory?.name]);

  return {
    products,
    loading,
    slug,
    fetchingError,
    refetch,
    page,
    setPage,
    totalPages: meta?.totalPages ?? 1
  };
};