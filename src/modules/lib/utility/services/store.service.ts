import { AxiosResponse } from "axios";
import { Product, ProductCategory } from "../types/product.interface";
import endpoints from "../endpoints";
import http from "../http";
import { IQueryParams } from "../hooks/use-products";
import { buildEndpoint } from "../utility";
import config from "env";
import { Store } from "../types/store.interface";

class StoreService {
  fetchStores(query: IQueryParams): Promise<Product[]> {
    return new Promise((resolve) => {
      http
        .get(endpoints.STORES, {
          params: query,
        })
        .then((response: AxiosResponse) => {
          resolve(response.data);
        });
    });
  }

  fetchStoreBySlug(slug: string, query: IQueryParams): Promise<Store> {
    return new Promise((resolve) => {
      fetch(config.API_HOST + "/" + buildEndpoint(endpoints.STORE, { slug }), {
        cache: "no-store", // Next.js-specific way to prevent caching
      })
        .then((res) => res.json())
        .then((response: any) => {
          resolve(response);
        });
    });
  }
}

export const storeService = new StoreService();
