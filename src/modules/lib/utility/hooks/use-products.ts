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
  search?: string;
  collection?: string;
}

export type PaginationType = "infinite" | "buttons";

export const useProducts = (initialQuery: IQueryParams, paginationType: PaginationType = "infinite", collectionSlug?: string) => {
  const [query, setQuery] = useState<IQueryParams>(initialQuery);
  const [loading, setLoading] = useState(true);
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

  const setSearch = (search?: string) => {
    setQuery((prev) => ({
      ...prev,
      search,
      pagination: {
        page: 1,
        limit: prev.pagination?.limit ?? 20,
      },
    }));
  };

  const setCollection = (collection?: string) => {
    setQuery((prev) => ({
      ...prev,
      collection,
      pagination: {
        page: 1,
        limit: prev.pagination?.limit ?? 20,
      },
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

  const baseCacheKey =
    (collectionSlug ? `collection_${collectionSlug}_` : "products_") +
    JSON.stringify(query.filters ?? {}) +
    JSON.stringify(query.order ?? {}) +
    JSON.stringify(query.allFilters ?? {}) +
    (query.search ?? "") +
    (query.collection ?? "");

  const cacheKey =
    paginationType === "infinite"
      ? baseCacheKey
      : baseCacheKey +
      `_page_${query.pagination?.page ?? 1}` +
      `_limit_${query.pagination?.limit ?? 0}`;

  useEffect(() => {
    if (!query.pagination) return;

    //buttons scroll
    if (paginationType === "buttons") {
      if (productsCache[cacheKey]) return;

      setLoading(true);
      setFetchingError(null);

      productService
        .fetchProducts(query, query.allFilters, collectionSlug = query.collection ? query.collection : collectionSlug)
        .then((fetchedProducts) => {
          setProductsCache(cacheKey, {
            data: fetchedProducts.data,
            meta: fetchedProducts.meta
          });
        })
        .catch(setFetchingError)
        .finally(() => setLoading(false));

      return;
    }

    //infinite scroll
    const cached = productsCache[cacheKey];
    const hasCachedData = cached?.data?.length > 0;

    if (hasCachedData) {
      setLoading(false);
      setFetchingError(null);
      return;
    }

    if (!cached || cached.data.length === 0) {
      setLoading(true);
      setFetchingError(null);
      productService
        .fetchProducts(query, query.allFilters, collectionSlug = query.collection ? query.collection : collectionSlug)
        .then((fetchedProducts) => {
          setProductsCache(cacheKey, {
            data: fetchedProducts.data,
            meta: fetchedProducts.meta
          });
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
    productsCache[cacheKey]?.data?.length,
    JSON.stringify(query.allFilters),
    query.pagination,
    query.search,
    query.collection
  ]);

  useEffect(() => {
    if (paginationType !== "infinite") return;
    if (!query.pagination) return;
    if (collectionSlug) return;

    if (
      (productsCache[cacheKey]?.data?.length ?? 0) <
      (query.pagination?.limit ?? 0) * (query.pagination?.page ?? 1)
    ) {
      setLoading(true);
      setFetchingError(null);
      productService
        .fetchProducts(query, query.allFilters, collectionSlug = query.collection ? query.collection : collectionSlug)
        .then((fetchedProducts) => {
          const previous = productsCache[cacheKey];

          setProductsCache(cacheKey, {
            data: [
              ...(previous?.data ?? []),
              ...fetchedProducts.data.filter(
                (product) =>
                  !productCacheIdempotencyTracker?.[cacheKey]?.[product.id]
              ),
            ],
            meta: fetchedProducts.meta
          });

          setProductsCacheIdempotencyTracker(
            cacheKey,
            fetchedProducts.data.reduce(
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
    JSON.stringify(query.search ?? ''),
    JSON.stringify(query.collection ?? ''),
    refetchToken
  ]);

  return {
    products: productsCache[cacheKey]?.data ?? [],
    setFilters,
    updateFilters,
    updateHomePageFilter,
    setOrdering,
    setPagination,
    setSearch,
    setCollection,
    query,
    loading,
    fetchingError,
    refetch,
    meta: productsCache[cacheKey]?.meta
    // paginationLoading
  };
};
