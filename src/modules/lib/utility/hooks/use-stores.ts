import { productService } from "../services/product.service"
import { useEffect, useState } from "react"
import { Store } from "../types/store.interface"

const storesPlaceholders = Array.from({ length: 6 }).map(store => ({
    id: 0,
    name: "",
    description: "",
    status: false,
    type: "",
    slug: ""
}))

export const useStores = () => {
    const [stores, setStores] = useState<Store[]>(storesPlaceholders)

    useEffect(() => {
        productService.fetchProductCategories()
            .then((stores: Store[] | any) => {
                setStores([...stores])
            })
    }, [])

    return { stores }
}
