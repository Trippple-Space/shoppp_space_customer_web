import { useEffect, useState } from "react";
import { productService } from "../services/product.service";
import { useProductStore } from "../store/products.store";
import { IFilters } from "../types/product.interface";

export interface IProductFilters {
  page?: string;
  index?: string;
  type?: string | null;
  tags?: any[];
  category?: string;
  keywords?: string[];
  [key: string]: any;
  status?: { In: string };
}

export interface IOrderBy {
  [key: string]: "ASC" | "DESC" | 'asc' | 'desc';
}

export interface IPagination {
  page: number;
  limit: number;
}

export interface IQueryParams {
  filters?: IProductFilters;
  order?: IOrderBy;
  pagination?: IPagination;
  // key: any
  allFilters?: IFilters;
}

export const useProducts = (initialQuery: IQueryParams) => {
  const [query, setQuery] = useState<IQueryParams>(initialQuery);
  const [loading, setLoading] = useState(false);
  const [fetchingError, setFetchingError] = useState<Error | null>(null);
  const [refetchToken, setRefetchToken] = useState(0);

  const {
    productsCache,
    setProductsCache,
    setProductsCacheIdempotencyTracker,
    productCacheIdempotencyTracker,
    clearProductsCacheByKey,
  } = useProductStore();

  const setFilters = (filters: IProductFilters) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      filters
    }));
  };

  const updateFilters = (filters: IProductFilters) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      filters: { ...prevQuery.filters, ...filters }
    }));
  };

  const updateHomePageFilter = (allFilters: IFilters) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      allFilters: { ...allFilters }
    }));
  };

  const setOrdering = (ordering: IOrderBy) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      order: ordering
    }));
  };

  const setPagination = (pagination: IPagination) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      pagination
    }));
  };

  const refetch = () => {
    clearProductsCacheByKey(cacheKey);
    setRefetchToken((t) => t + 1);
    setQuery((prev) => ({
      ...prev,
      pagination: {
        page: 1,
        limit: prev.pagination?.limit ?? 20,
      },
    }));
  };

  const cacheKey =
    "products_" +
    JSON.stringify(query.filters ?? {}) +
    JSON.stringify(query.order ?? {}) +
    JSON.stringify(query.allFilters ?? {});

  useEffect(() => {
    if (!productsCache[cacheKey] || productsCache[cacheKey].length === 0) {
      setLoading(true);
      setFetchingError(null);
      productService
        .fetchProducts(query, query.allFilters)
        .then((fetchedProducts) => {
          setProductsCache(cacheKey, fetchedProducts);
        })
        .catch((error) => {
          setFetchingError(error);
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [
    cacheKey,
    refetchToken,
    productsCache[cacheKey]?.length,
    JSON.stringify(query.allFilters)
  ]);

  useEffect(() => {
    if (
      (productsCache[cacheKey]?.length ?? 0) <
      (query.pagination?.limit ?? 0) * (query.pagination?.page ?? 1)
    ) {
      setLoading(true);
      setFetchingError(null);
      productService
        .fetchProducts(query, query.allFilters)
        .then((fetchedProducts) => {
          setProductsCache(cacheKey, [
            ...(productsCache[cacheKey] ?? []),
            ...fetchedProducts.filter(
              (product) =>
                !productCacheIdempotencyTracker?.[cacheKey]?.[product.id]
            )
          ]);
          setProductsCacheIdempotencyTracker(
            cacheKey,
            fetchedProducts.reduce(
              (cumm, curr) => ({ ...cumm, [curr.id]: true }),
              {}
            )
          );
        }).catch((error) => {
          setFetchingError(error);
          setLoading(false);
        }).finally(() => {
          setLoading(false);
        })
    }
  }, [
    JSON.stringify(query.pagination ?? {}),
    JSON.stringify(query.allFilters),
    refetchToken
  ]);

  return {
    products: productsCache[cacheKey] ?? [],
    setFilters,
    updateFilters,
    updateHomePageFilter,
    setOrdering,
    setPagination,
    query,
    loading,
    fetchingError,
    refetch,
    // paginationLoading
  };
};
