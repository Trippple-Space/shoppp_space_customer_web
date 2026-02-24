import { useEffect, useState } from "react";
import { useProducts } from "../use-products";
import { useParams } from "next/navigation";


export const useStoreProductsView = (selectedCategory?: any) => {
  const { slug } = useParams();

  const [page, setPage] = useState(1);
  const limit = 20;

  const { products, updateFilters, setPagination, loading, fetchingError, refetch, meta } = useProducts({
    filters: { store: { slug }, status: { In: "ACTIVE,OUT_OF_STOCK" } }, order: {
      priorityScore: "DESC"
    },
    pagination: { page, limit }
  }, 'buttons');

  useEffect(() => {
    setPagination({ page, limit });
  }, [page]);

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
