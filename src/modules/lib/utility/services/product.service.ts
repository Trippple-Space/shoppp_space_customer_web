import { AxiosResponse } from "axios";
import { Product, ProductCategory, ProductsResponse, RecentlyViewed, RecentlyViewedResponse } from "../types/product.interface";
import endpoints from "../endpoints";
import http from "../http";
import { IProductFilters, IQueryParams } from "../hooks/use-products";
import { buildEndpoint, buildFilterParams } from "../utility";
import config from "env";
import { SavedVariant } from "../types/SavedVariant.interface";



class ProductService {
     CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour

     async fetchProductCategories(
          type: "fabrics" | "wears" | null,
          label = "GLOBAL",
          storeId = ""
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

     fetchProducts(query: IQueryParams, filters = {}, collectionSlug?: string): Promise<Product[]> {
          return new Promise((resolve, reject) => {
               const filterParams = buildFilterParams(filters);
               const { allFilters, ...queryWithoutAllFilters } = query;

               const endpoint = collectionSlug
                    ? endpoints.COLLECTION_PRODUCTS.replace(":collectionSlug", collectionSlug)
                    : endpoints.PRODUCTS;

               http
                    .get<ProductsResponse>(endpoint, {
                         params: { ...queryWithoutAllFilters, ...filterParams },
                    })
                    .then((response) => {
                         resolve(response.data.data);
                    })
                    .catch(reject);
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
                         resolve(data.data);
                    })
                    .catch((err) => {
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
                         resolve(data.data);
                    })
                    .catch((err) => {
                         reject(err);
                    });
          });
     }

     fetchSavedVariants(): Promise<SavedVariant[]> {
          return new Promise((resolve, reject) => {
               http.get(endpoints.SAVED_VARIANT).then((response: AxiosResponse) => {
                    resolve(response.data.data);
               }).catch((err) => {
                    if (err.response && err.response.data.message === "No saved variants found for this user") {
                         return resolve([] as SavedVariant[]);
                    } else {
                         reject(err);
                    }
               });
          });
     }

     saveVariant(productVariantId: string): Promise<SavedVariant> {
          return new Promise((resolve, reject) => {
               http.post(`${endpoints.SAVED_VARIANT}/${productVariantId}`).then((response: AxiosResponse) => {
                    resolve(response.data);
               })
          })
     }
     removeSavedVariant(productVariantId: string) {
          return new Promise((resolve, reject) => {
               http.delete(`${endpoints.SAVED_VARIANT}/${productVariantId}`).then((response: AxiosResponse) => {
                    resolve(response.data);
               })
          })
     }

     clearSavedVariants(): Promise<SavedVariant[]> {
          return new Promise((resolve) => {
               http.delete(endpoints.SAVED_VARIANT).then((response: AxiosResponse) => {
                    resolve(response.data);
               })
          })
     }


     getRecentlyViewedVariants(type?: string): Promise<RecentlyViewed[]> {
          const params: any = {};
          params["filters[type]"] = type;

          return new Promise((resolve, reject) => {
               http.get(endpoints.GET_RECENTLY_VIEWED, {
                    params
               }).then((response: AxiosResponse<RecentlyViewedResponse>) => resolve(response.data.data))
          })
     }

     getAllRecentlyViewedVariants(): Promise<RecentlyViewed[]> {
          const params: any = {};
          params["filters[type]"] = "view";

          return new Promise((resolve, reject) => {
               http.get(endpoints.ALL_RECENTLY_VIEWED, {
                    params
               }).then((response: AxiosResponse<RecentlyViewedResponse>) => resolve(response.data.data))
          })
     }

     addRecentlyViewedVariants(payload: { productVariantId: string, type?: string }) {
          return new Promise((resolve, reject) => {
               http.post(endpoints.RECENTLY_VIEWED, payload).then((response) => resolve(response.data))
          })
     }

     clearRecentlyViewedVariants(payload: { type?: string }) {
          return http.delete(endpoints.RECENTLY_VIEWED, {
               data: payload,
          }).then((response: AxiosResponse) => response.data);
     }

     createProductReview(payload:
          { productVariantId: string, rating: number, comment: string }) {
          return new Promise((resolve, reject) => {
               http.post(`${endpoints.PRODUCT_REVIEW}/create`, payload).then((response) =>
                    resolve(response.data)
               )
          })
     }
}

export const productService = new ProductService();
