import { AxiosResponse } from "axios";
import { Product, ProductCategory } from "../types/product.interface";
import endpoints from "../endpoints";
import http from "../http";
import { IProductFilters, IQueryParams } from "../hooks/use-products";
import { buildEndpoint } from "../utility";
import config from "env";

class ProductService {
     CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour

     async fetchProductCategories(
          type: "fabrics" | "wears" | null,
          label = "GLOBAL",
          storeId = 0
     ) {
          const cacheKey = `product/categories_${type}_${label}_${storeId}`;
          const cachedData = this.getCachedCategories(cacheKey);

          if (cachedData) {
               return cachedData;
          }

          return new Promise((resolve) => {
               http.get(endpoints.PRODUCT_CATEGORIES, {
                    params: {
                         filters: {
                              type,
                              label: "GLOBAL",
                              storeId,
                         },
                    },
               }).then((response: AxiosResponse) => {
                    const fetchedCategories: ProductCategory =
                         response.data?.[0];
                    this.cacheCategories(cacheKey, fetchedCategories);
                    resolve(fetchedCategories);
               });
          });
     }

     getCachedCategories(key: string) {
          const cached = localStorage.getItem(key);
          if (!cached) return null;

          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp > this.CACHE_EXPIRY) {
               localStorage.removeItem(key);
               return null;
          }

          return parsed.data;
     }

     cacheCategories(key: string, data: any) {
          const toCache = {
               data,
               timestamp: Date.now(),
          };
          localStorage.setItem(key, JSON.stringify(toCache));
     }

     fetchProducts(query: IQueryParams): Promise<Product[]> {
          return new Promise((resolve) => {
               http.get(endpoints.PRODUCTS, {
                    params: query,
               }).then((response: AxiosResponse) => {
                    resolve(response.data);
               });
          });
     }

     fetchProductBySlug(
          slug: string,
          query: IQueryParams | any
     ): Promise<Product> {
          return new Promise((resolve, reject) => {
               const url = new URL(
                    buildEndpoint(config.API_HOST + "/" + endpoints.PRODUCT, {
                         slug,
                    })
               );
               Object.keys(query).forEach((key) =>
                    url.searchParams.append(key, query[key])
               );

               fetch(url.toString())
                    .then((res) => {
                         if (!res.ok) {
                              throw new Error(
                                   `HTTP error! Status: ${res.status}`
                              );
                         }
                         return res.json();
                    })
                    .then((response: any) => {
                         resolve(response);
                    })
                    .catch((err) => {
                         console.error("Error fetching product by slug:", err);
                         reject(err);
                    });
          });
     }

     fetchProductBySearch(
          searchTerm: string,
          query: IQueryParams | any
     ): Promise<Product[]> {
          return new Promise((resolve, reject) => {
               const url = new URL(
                    buildEndpoint(
                         config.API_HOST + "/" + endpoints.SEARCH_PRODUCTS,
                         {}
                    )
               );

               Object.keys(query).forEach((key) => {
                    const value = query[key];
                    if (key === "filters" && typeof value === "object") {
                         Object.keys(value).forEach((filterKey) => {
                              url.searchParams.append(
                                   `filters[${filterKey}]`,
                                   value[filterKey]
                              );
                         });
                    } else {
                         url.searchParams.append(key, value);
                    }
               });

               url.searchParams.append("search", searchTerm);

               fetch(url.toString())
                    .then((res) => {
                         if (!res.ok) {
                              throw new Error(
                                   `HTTP error! Status: ${res.status}`
                              );
                         }
                         return res.json();
                    })
                    .then((data) => {
                         resolve(data);
                    })
                    .catch((err) => {
                         console.error(
                              "Error fetching products by search:",
                              err
                         );
                         reject(err);
                    });
          });
     }

     fetchProductBySlugSearch(
          storeSlug: string,
          searchTerm: string
     ): Promise<Product[]> {
          return new Promise((resolve, reject) => {
               const url = new URL(
                    buildEndpoint(
                         config.API_HOST + "/" + endpoints.SEARCH_PRODUCTS,
                         {}
                    )
               );
               url.searchParams.append("filters[store][slug]", storeSlug);
               url.searchParams.append("search", searchTerm);

               fetch(url.toString())
                    .then((res) => {
                         if (!res.ok) {
                              throw new Error(
                                   `HTTP error! Status: ${res.status}`
                              );
                         }
                         return res.json();
                    })
                    .then((data) => {
                         resolve(data);
                         data;
                    })
                    .catch((err) => {
                         console.error(
                              "Error fetching products by search:",
                              err
                         );
                         reject(err);
                    });
          });
     }
}

export const productService = new ProductService();
