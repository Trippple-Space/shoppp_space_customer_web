import { AxiosResponse } from "axios"
import { IProduct, IProductCategory } from "../types/product"
import endpoints from "../endpoints"
import http from "../http"
import { IProductFilters, IQueryParams } from "../hooks/use-products"

class ProductService {

    fetchProductCategories(): Promise<IProductCategory[]> {
        return new Promise((resolve) => {
            http.get(endpoints.PRODUCT_CATEGORIES)
                .then((response: AxiosResponse) => {
                    console.log({ response })
                    resolve(response.data)
                })
        })

    }

    fetchProducts(query: IQueryParams): Promise<IProduct[]> {
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