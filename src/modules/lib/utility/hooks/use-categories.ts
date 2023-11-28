import { productService } from "../services/product.service"
import { ProductCategory } from "../types/product.interface"
import { use, cache, useEffect, useState } from "react"

const categoryPlaceholders = Array.from({ length: 6 }).map(category => ({
    name: '',
    images: [''],
    description: '',
    id: 0
}))

export const useCategories = () => {
    const [categories, setCategories] = useState<ProductCategory[]>(categoryPlaceholders)

    useEffect(() => {
        productService.fetchProductCategories()
            .then((categories: ProductCategory[]) => {
                setCategories(categories)
            })
    }, [])

    return { categories }
}
