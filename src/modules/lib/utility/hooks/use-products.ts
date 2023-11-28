import { useEffect, useState } from "react"
import { productService } from "../services/product.service"
import { Product } from "../types/product.interface"

export interface IProductFilters {
  page?: string,
  index?: string,
  type?: string[],
  tags?: any[],
  category?: { [key: (string | number)]: (string | number) } | { [key: (string | number)]: (string | number) }[],
  keywords?: string[],
  [key: string]: any
}

export interface IOrderBy {
  [key: string]: 'asc' | 'desc'
}

export interface IPagination {
  page: number,
  limit: number
}

export interface IQueryParams {
  filters?: IProductFilters,
  order?: IOrderBy,
  pagination?: IPagination
}

export const useProducts = (initialQuery: IQueryParams) => {
  const [query, setQuery] = useState<IQueryParams>(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [cachedProducts, setCachedProducts] = useState<{ [key: string]: Product[] }>({});

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

  useEffect(() => {
    const cacheKey = JSON.stringify(query);

    if (cachedProducts[cacheKey]) {
      setProducts(cachedProducts[cacheKey]);
    } else {
      productService.fetchProducts(query)
        .then((fetchedProducts) => {
          setProducts(fetchedProducts);
          setCachedProducts((prevCachedProducts) => ({
            ...prevCachedProducts,
            [cacheKey]: fetchedProducts,
          }));
        });
    }
  }, [query, cachedProducts]);

  return { products, setFilters, updateFilters, setOrdering, setPagination };
};
