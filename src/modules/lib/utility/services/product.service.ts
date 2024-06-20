import { AxiosResponse } from "axios"
import { Product, ProductCategory } from "../types/product.interface"
import endpoints from "../endpoints"
import http from "../http"
import { IProductFilters, IQueryParams } from "../hooks/use-products"
import { buildEndpoint } from "../utility"
import config from "env"

class ProductService {

    fetchProductCategories(type?: 'fabrics' | 'wears'): Promise<ProductCategory[]> {
        return new Promise((resolve) => {
            http.get(endpoints.PRODUCT_CATEGORIES, {
                params: {
                    filters: { type }
                }
            })
                .then((response: AxiosResponse) => {
                    resolve(response.data)
                })
        })
    }

    fetchProducts(query: IQueryParams): Promise<Product[]> {
        return new Promise((resolve) => {
            http.get(endpoints.PRODUCTS, {
                params: query
            })
                .then((response: AxiosResponse) => {
                    resolve(response.data)
                })
        })
    }

    fetchProductBySlug(slug: string, query: IQueryParams): Promise<Product> {
        return new Promise((resolve) => {
            fetch(config.API_HOST + '/' + buildEndpoint(endpoints.PRODUCT, { slug }))
                .then(res => res.json())
                .then((response: any) => {
                    resolve(response)
                })
        })
    }
}

export const productService = new ProductService()