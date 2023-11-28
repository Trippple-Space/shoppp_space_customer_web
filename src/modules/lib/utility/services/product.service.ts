import { AxiosResponse } from "axios"
import { Product, ProductCategory } from "../types/product.interface"
import endpoints from "../endpoints"
import http from "../http"
import { IProductFilters, IQueryParams } from "../hooks/use-products"

class ProductService {

    fetchProductCategories(): Promise<ProductCategory[]> {
        return new Promise((resolve) => {
            http.get(endpoints.PRODUCT_CATEGORIES)
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
}

export const productService = new ProductService()