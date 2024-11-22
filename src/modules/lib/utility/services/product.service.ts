import { AxiosResponse } from "axios";
import { Product, ProductCategory } from "../types/product.interface";
import endpoints from "../endpoints";
import http from "../http";
import { IProductFilters, IQueryParams } from "../hooks/use-products";
import { buildEndpoint } from "../utility";
import config from "env";

class ProductService {
     fetchProductCategories(
          type?: "fabrics" | "wears"
     ): Promise<ProductCategory[]> {
          return new Promise((resolve) => {
               http.get(endpoints.PRODUCT_CATEGORIES, {
                    params: {
                         filters: { type },
                    },
               }).then((response: AxiosResponse) => {
                    resolve(response.data);
               });
          });
     }

     fetchProducts(query: IQueryParams): Promise<Product[]> {
          return new Promise((resolve) => {
               http.get(endpoints.PRODUCTS, {
                    ...query,
                    params: {
                         ...query,
                         filter: { status: { In: ["ACTIVE", "OUT_OF_STOCK"] } },
                    },
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
               console.log({ slug }, "from service");

               fetch(url.toString())
                    .then((res) => {
                         console.log({ res: res.ok });
                         console.log({ url });
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

     fetchProductBySearch(searchTerm: string): Promise<Product[]> {
          return new Promise((resolve, reject) => {
               const url = new URL(
                    buildEndpoint(
                         config.API_HOST + "/" + endpoints.SEARCH_PRODUCTS,
                         {
                              searchTerm,
                         }
                    )
               );

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
