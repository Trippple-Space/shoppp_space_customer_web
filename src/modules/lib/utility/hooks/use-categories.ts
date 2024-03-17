import { productService } from "../services/product.service"
import { ProductCategory } from "../types/product.interface"
import { use, cache, useEffect, useState } from "react"

const categoryPlaceholders = Array.from({ length: 6 }).map(category => ({
    name: '',
    images: [''],
    description: '',
    type: '',
    id: 0
}))

export const useCategories = () => {
    const [categories, setCategories] = useState<ProductCategory[]>(categoryPlaceholders)

    useEffect(() => {
        productService.fetchProductCategories()
            .then((categories: ProductCategory[]) => {
                setCategories([{
                    id: 0,
                    description: 'All categories',
                    images: ['home.svg'],
                    name: 'All',
                    type: 'fabrics'
                }, ...categories])
            })
    }, [])

    return { categories }
}
