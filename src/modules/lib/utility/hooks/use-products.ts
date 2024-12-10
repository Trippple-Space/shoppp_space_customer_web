import { useEffect, useState } from "react";
import { productService } from "../services/product.service";
import { Product } from "../types/product.interface";
import { useProductStore } from "../store/products.store";

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
}

export const useProducts = (initialQuery: IQueryParams) => {
  const [query, setQuery] = useState<IQueryParams>(initialQuery);
  const {
    productsCache,
    setProductsCache,
    setProductsCacheIdempotencyTracker,
    productCacheIdempotencyTracker,
  } = useProductStore();

  const setFilters = (filters: IProductFilters) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      filters,
    }));
  };

  const updateFilters = (filters: IProductFilters) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      filters: { ...prevQuery.filters, ...filters },
    }));
  };

  const setOrdering = (ordering: IOrderBy) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      order: ordering,
    }));
  };

  const setPagination = (pagination: IPagination) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      pagination,
    }));
  };

  const cacheKey =
    "products_" +
    JSON.stringify(query.filters ?? {}) +
    JSON.stringify(query.order ?? {});
  useEffect(() => {
    if (!productsCache[cacheKey]) {
      productService.fetchProducts(query).then((fetchedProducts) => {
        setProductsCache(cacheKey, fetchedProducts);
      });
    }
  }, [cacheKey, productsCache[cacheKey]?.length]);

  useEffect(() => {
    // console.log('Pagination changed', { pagination: query.pagination, productCacheIdempotencyTracker})
    if (
      (productsCache[cacheKey]?.length ?? 0) <
      (query.pagination?.limit ?? 0) * (query.pagination?.page ?? 1)
    ) {
      productService.fetchProducts(query).then((fetchedProducts) => {
        setProductsCache(cacheKey, [
          ...(productsCache[cacheKey] ?? []),
          ...fetchedProducts.filter(
            (product) =>
              !productCacheIdempotencyTracker?.[cacheKey]?.[product.id]
          ),
        ]);
        setProductsCacheIdempotencyTracker(
          cacheKey,
          fetchedProducts.reduce(
            (cumm, curr) => ({ ...cumm, [curr.id]: true }),
            {}
          )
        );
      });
    }
  }, [JSON.stringify(query.pagination ?? {})]);

  return {
    products: productsCache[cacheKey] ?? [],
    setFilters,
    updateFilters,
    setOrdering,
    setPagination,
    query,
  };
};
