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

function normalizeFetchError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(typeof error === "string" ? error : "Request failed");
}

export const useProducts = (
  initialQuery: IQueryParams,
  paginationType: PaginationType = "infinite",
  collectionSlug?: string,
  currentTags?: string | string[]
) => {
  const [query, setQuery] = useState<IQueryParams>(initialQuery);
  const [loading, setLoading] = useState(true);
  const [fetchingError, setFetchingError] = useState<Error | null>(null);
  const [loadMoreError, setLoadMoreError] = useState<Error | null>(null);
  const [refetchToken, setRefetchToken] = useState(0);
  const [loadMoreRetryToken, setLoadMoreRetryToken] = useState(0);

  const {
    productsCache,
    setProductsCache,
    setProductsCacheIdempotencyTracker,
    productCacheIdempotencyTracker,
    clearProductsCacheByKey,
  } = useProductStore();

  useEffect(() => {
    if (currentTags === undefined) return;
    setQuery((prev) => ({
      ...prev,
      allFilters: { ...prev.allFilters, tags: currentTags } as IFilters,
    }));
  }, [currentTags]);

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
      collection: collection?.trim() ? collection : undefined,
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

  const effectiveCollectionSlug = query.collection
    ? query.collection
    : collectionSlug;

  const refetch = () => {
    setFetchingError(null);
    setLoadMoreError(null);
    clearProductsCacheByKey(cacheKey);
    setRefetchToken((t) => t + 1);
    setLoadMoreRetryToken(0);
    setQuery((prev) => ({
      ...prev,
      pagination: {
        page: 1,
        limit: prev.pagination?.limit ?? 20,
      },
    }));
  };

  const retryLoadMore = () => {
    setLoadMoreError(null);
    setLoadMoreRetryToken((t) => t + 1);
  };

  useEffect(() => {
    if (!query.pagination) return;

    //buttons scroll
    if (paginationType === "buttons") {
      if (productsCache[cacheKey]) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setFetchingError(null);
      setLoadMoreError(null);

      productService
        .fetchProducts(query, query.allFilters, effectiveCollectionSlug)
        .then((fetchedProducts) => {
          setLoadMoreError(null);
          setProductsCache(cacheKey, {
            data: fetchedProducts.data,
            meta: fetchedProducts.meta
          });
        })
        .catch((e) => setFetchingError(normalizeFetchError(e)))
        .finally(() => setLoading(false));

      return;
    }

    //infinite scroll
    const cached = productsCache[cacheKey];
    const hasCachedData = cached?.data?.length > 0;

    if (hasCachedData) {
      setLoading(false);
      setFetchingError(null);
      setLoadMoreError(null);
      return;
    }

    if (!cached || cached.data.length === 0) {
      setLoading(true);
      setFetchingError(null);
      setLoadMoreError(null);
      productService
        .fetchProducts(query, query.allFilters, effectiveCollectionSlug)
        .then((fetchedProducts) => {
          setLoadMoreError(null);
          setProductsCache(cacheKey, {
            data: fetchedProducts.data,
            meta: fetchedProducts.meta
          });
        })
        .catch((error) => {
          setFetchingError(normalizeFetchError(error));
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
      setLoadMoreError(null);
      productService
        .fetchProducts(query, query.allFilters, effectiveCollectionSlug)
        .then((fetchedProducts) => {
          const { productsCache: latestCache, productCacheIdempotencyTracker: latestTracker } =
            useProductStore.getState();
          const previous = latestCache[cacheKey];
          const seenIds = latestTracker[cacheKey] ?? {};

          setLoadMoreError(null);
          setProductsCache(cacheKey, {
            data: [
              ...(previous?.data ?? []),
              ...fetchedProducts.data.filter((product) => !seenIds[product.id]),
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
          setLoadMoreError(normalizeFetchError(error));
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
    refetchToken,
    loadMoreRetryToken
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
    loadMoreError,
    refetch,
    retryLoadMore,
    meta: productsCache[cacheKey]?.meta
    // paginationLoading
  };
};
