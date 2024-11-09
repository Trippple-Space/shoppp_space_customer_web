import { useEffect, useState } from "react";
import { productService } from "../services/product.service";
import { Product } from "../types/product.interface";

export interface IProductFilters {
  page?: string;
  index?: string;
  type?: string;
  tags?: any[];
  category?:
    | { [key: string | number]: string | number }
    | { [key: string | number]: string | number }[];
  keywords?: string[];
  [key: string]: any;
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

const placeholderProduct: Product = {
  longDescription: "",
  keywords: [],
  id: 0,
  slug: "",
  category: {
    type: "",
    id: 0,
    name: "",
    images: [],
    description: null,
  },
  price: 0,
  name: "",
  type: "",
  stockUnit: "",
  status: 0,
  dateCreated: "",
  lastUpdated: "",
  reviewRating: 0,
  reviews: undefined,
  comments: undefined,
  variants: [
    {
      id: 0,
      media: [
        {
          url: "",
          type: "image",
        },
      ],
      stock: 0,
      price: 0,
      minPurchaseQuantity: 0,
      incrementBy: 0,
      product: {
        longDescription: "",
        keywords: [],
        id: 0,
        slug: "",
        type: "",
        category: {
          type: "",
          id: 0,
          name: "",
          images: [],
          description: null,
        },
        price: 0,
        name: "",
        stockUnit: "",
        status: 0,
        dateCreated: "",
        lastUpdated: "",
        reviewRating: 0,
        reviews: undefined,
        comments: undefined,
        variants: [],
        store: {
          name: "",
          slug: "",
          id: 0,
          description: "",
          status: false,
          type: "",
        },
        availableUnit: [],
        finalPrice: 0
      },
      meta: undefined,
      properties: undefined,
      stockUnit: "",
      dateCreated: "",
      lastUpdated: "",
      finalPrice: 0
    },
  ],
  store: {
    name: "",
    slug: "",
    id: 0,
    description: "",
    status: false,
    type: "",
  },
  availableUnit: [],
  finalPrice: 0
};

export const useProducts = (initialQuery: IQueryParams) => {
  const [query, setQuery] = useState<IQueryParams>(initialQuery);
  const [products, setProducts] = useState<Product[]>(
    Array.from({ length: 10 }).map(() => placeholderProduct)
  );
  const [cachedProducts, setCachedProducts] = useState<{
    [key: string]: Product[];
  }>({});

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
      productService.fetchProducts(query).then((fetchedProducts) => {
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
