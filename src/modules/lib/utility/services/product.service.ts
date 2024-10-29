import { AxiosResponse } from "axios";
import { Product, ProductCategory } from "../types/product.interface";
import endpoints from "../endpoints";
import http from "../http";
import { IProductFilters, IQueryParams } from "../hooks/use-products";
import { buildEndpoint } from "../utility";
import config from "env";
import { resolve } from "path";

class ProductService {
  fetchProductCategories(
    type?: "fabrics" | "wears"
  ): Promise<ProductCategory[]> {
    return new Promise((resolve) => {
      http
        .get(endpoints.PRODUCT_CATEGORIES, {
          params: {
            filters: { type },
          },
        })
        .then((response: AxiosResponse) => {
          resolve(response.data);
        });
    });
  }

  fetchProducts(query: IQueryParams): Promise<Product[]> {
    return new Promise((resolve) => {
      http
        .get(endpoints.PRODUCTS, {
          params: query,
        })
        .then((response: AxiosResponse) => {
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
        config.API_HOST + "/" + buildEndpoint(endpoints.PRODUCT, { slug })
      );

      // Adding query parameters if needed
      Object.keys(query).forEach((key) =>
        url.searchParams.append(key, query[key])
      );

      fetch(url.toString())
        .then((res) => {
          console.log({ res: res.ok });
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((response: any) => {
          console.log({ response });
          resolve(response);
        })
        .catch((err) => {
          console.error("Error fetching product by slug:", err);
          reject(err);
        });
    });
  }
}

export const productService = new ProductService();
