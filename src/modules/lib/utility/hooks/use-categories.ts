import { productService } from "@/lib/utility/services/product.service"
import { IProductCategory } from "@/lib/utility/types/product"
import { use, cache, useEffect, useState } from "react"

const categoryPlaceholders = Array.from({ length: 6 }).map(category => ({
    name: '',
    images: [''],
    description: '',
    id: 0
}))

export const useCategories = () => {
    const [categories, setCategories] = useState<IProductCategory[]>(categoryPlaceholders)

    useEffect(() => {
        productService.fetchProductCategories()
            .then((categories: IProductCategory[]) => {
                setCategories(categories)
            })
    }, [])

    return { categories }
}
