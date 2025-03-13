import { useEffect, useState } from "react";
import { productService } from "../services/product.service";
import { useProductStore } from "../store/products.store";
import { IFilters } from "../types/product.interface";

export interface IProductFilters {
  page?: string;
  index?: string;
  type?: string | null;
  tags?: any[];
  category?:
    | { [key: string | number]: string | number }
    | { [key: string | number]: string | number }[];
  keywords?: string[];
  [key: string]: any;
  status?: { In: string[] };
}

export interface IOrderBy {
  [key: string]: "asc" | "desc";
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
  const [loading, setLoading] = useState(true);

  const {
    productsCache,
    setProductsCache,
    setProductsCacheIdempotencyTracker,
    productCacheIdempotencyTracker
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

  const cacheKey =
    "products_" +
    JSON.stringify(query.filters ?? {}) +
    JSON.stringify(query.order ?? {}) +
    JSON.stringify(query.allFilters ?? {});

  useEffect(() => {
    if (!productsCache[cacheKey] || productsCache[cacheKey].length === 0) {
      setLoading(true);
      productService
        .fetchProducts(query, query.allFilters)
        .then((fetchedProducts) => {
          setProductsCache(cacheKey, fetchedProducts);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [
    cacheKey,
    productsCache[cacheKey]?.length,
    JSON.stringify(query.allFilters)
  ]);

  useEffect(() => {
    if (
      (productsCache[cacheKey]?.length ?? 0) <
      (query.pagination?.limit ?? 0) * (query.pagination?.page ?? 0)
    ) {
      setLoading(true);
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
        }).finally(() => {
          setLoading(false);
        })
    }
  }, [
    JSON.stringify(query.pagination ?? {}),
    JSON.stringify(query.allFilters)
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
    // paginationLoading
  };
};
