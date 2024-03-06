import { useState } from "react"
import { useCategories } from "../use-categories"

export const useCategoryNavView = () => {
    const [options, setOptions] = useState([])
    const {categories} = useCategories()
    return {
        categories
    }
}
