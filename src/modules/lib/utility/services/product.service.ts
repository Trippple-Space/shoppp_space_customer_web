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
     inFlightCategoryRequests: Partial<Record<string, Promise<ProductCategory>>> = {};

     async fetchProductCategories(
          type: "fabrics" | "wears" | null,
          label = "GLOBAL",
          storeId = ""
     ) {
          const cacheKey = storeId
               ? `product/categories_storefront_both_${label}_${storeId}`
               : `product/categories_${type}_${label}_${storeId}`;
          const cachedData = this.getCachedCategories(cacheKey);

          if (cachedData) {
               return cachedData;
          }

          if (this.inFlightCategoryRequests[cacheKey]) {
               return this.inFlightCategoryRequests[cacheKey];
          }

          this.inFlightCategoryRequests[cacheKey] = (async () => {
               if (storeId) {
                    const baseFilters: Record<string, string> = { storeId };
                    if (label) baseFilters.label = label;

                    const [fabricsRes, wearsRes] = await Promise.all([
                         http.get(endpoints.PRODUCT_CATEGORIES, {
                              params: { filters: { ...baseFilters, type: "fabrics" } },
                         }),
                         http.get(endpoints.PRODUCT_CATEGORIES, {
                              params: { filters: { ...baseFilters, type: "wears" } },
                         }),
                    ]);

                    const fabricsCategory: ProductCategory | undefined = fabricsRes.data?.data?.[0];
                    const wearsCategory: ProductCategory | undefined = wearsRes.data?.data?.[0];
                    const mergedCategories = [
                         ...(fabricsCategory?.categories ?? []),
                         ...(wearsCategory?.categories ?? []),
                    ].filter(
                         (category, index, arr) =>
                              index ===
                              arr.findIndex(
                                   (item) =>
                                        item?.name?.toLowerCase?.().trim() ===
                                        category?.name?.toLowerCase?.().trim()
                              )
                    );

                    const mergedCategory: ProductCategory = {
                         ...(fabricsCategory ?? wearsCategory ?? {
                              id: "",
                              label,
                              type: null,
                              categories: [],
                              storeId,
                         }),
                         type: null,
                         categories: mergedCategories,
                    };

                    this.cacheCategories(cacheKey, mergedCategory);
                    return mergedCategory;
               }

               const categoryFilters: Record<string, string> = {};
               if (type) categoryFilters.type = type;
               if (label) categoryFilters.label = label;

               const response: AxiosResponse = await http.get(endpoints.PRODUCT_CATEGORIES, {
                    params: {
                         filters: categoryFilters,
                    },
               });
               const fetchedCategories: ProductCategory = response.data?.data?.[0];
               this.cacheCategories(cacheKey, fetchedCategories);
               return fetchedCategories;
          })();

          try {
               return await this.inFlightCategoryRequests[cacheKey];
          } finally {
               delete this.inFlightCategoryRequests[cacheKey];
          }
     }

     getCachedCategories(key: string) {
          const cached = sessionStorage.getItem(key);
          if (!cached) return null;

          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp > this.CACHE_EXPIRY) {
               sessionStorage.removeItem(key);
               return null;
          }

          return parsed.data;
     }

     cacheCategories(key: string, data: any) {
          const toCache = {
               data,
               timestamp: Date.now(),
          };
          sessionStorage.setItem(key, JSON.stringify(toCache));
     }

     fetchProducts(query: IQueryParams, filters = {}, collectionSlug?: string): Promise<{ data: Product[]; meta: ProductsResponse['meta'] }> {
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
                         const rawProducts = response.data.data;
                         const requestedPage = Math.max(1, query.pagination?.page ?? 1);
                         const requestedLimit = Math.max(1, query.pagination?.limit ?? 20);
                         const looksUnpaginated =
                              !!query.pagination &&
                              rawProducts.length > requestedLimit &&
                              (response.data.meta?.itemCount ?? rawProducts.length) > requestedLimit;

                         const paginatedProducts = looksUnpaginated
                              ? rawProducts.slice(
                                   (requestedPage - 1) * requestedLimit,
                                   requestedPage * requestedLimit
                              )
                              : rawProducts;

                         const productsWithOrderedVariants = paginatedProducts.map((product) => {
                              product.variants = product.variants.sort((a, b) => {
                                   if (a.status === 'OUT_OF_STOCK' && b.status !== 'OUT_OF_STOCK') return 1;
                                   if (a.status !== 'OUT_OF_STOCK' && b.status === 'OUT_OF_STOCK') return -1;
                                   return 0;
                              });
                              return product;
                         });

                         const normalizedMeta = looksUnpaginated
                              ? {
                                   ...(response.data.meta ?? {}),
                                   totalItems: rawProducts.length,
                                   itemCount: productsWithOrderedVariants.length,
                                   itemsPerPage: requestedLimit,
                                   totalPages: Math.max(1, Math.ceil(rawProducts.length / requestedLimit)),
                                   currentPage: requestedPage,
                              }
                              : response.data.meta;

                         resolve({
                              data: productsWithOrderedVariants,
                              meta: normalizedMeta
                         });
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
                         const productsWithOrderedVariants = {
                              ...response,
                              variants: response.variants.sort((a: any, b: any) => {
                                   if (a.status === 'OUT_OF_STOCK' && b.status !== 'OUT_OF_STOCK') return 1;
                                   if (a.status !== 'OUT_OF_STOCK' && b.status === 'OUT_OF_STOCK') return -1;
                                   return 0;
                              })
                         };

                         resolve(productsWithOrderedVariants)
                    })
                    .catch((err) => {
                         reject(err);
                    });
          });
     }

     fetchProductBySearch(
          searchTerm: string,
          query: IQueryParams | any,
          signal?: AbortSignal
     ): Promise<Product[]> {
          return new Promise((resolve, reject) => {
               http
                    .get<ProductsResponse>(endpoints.SEARCH_PRODUCTS, {
                         params: {
                              ...query,
                              search: searchTerm,
                         },
                         signal
                    })
                    .then((response) => {
                         resolve(response.data.data);
                    })
                    .catch((err) => {
                         reject(err);
                    });
          });
     }


     fetchProductBySlugSearch(
          storeSlug: string,
          searchTerm: string,
          query?: IQueryParams | any,
          signal?: AbortSignal
     ): Promise<Product[]> {
          return new Promise((resolve, reject) => {
               const storeFilter = {
                    "filters[store][slug]": storeSlug,
               };

               http.get<ProductsResponse>(endpoints.SEARCH_PRODUCTS, {
                    params: {
                         ...query,
                         ...storeFilter,
                         search: searchTerm,
                    },
                    signal
               })
                    .then((response) => {
                         resolve(response.data.data);
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
