import { useState } from "react"
import { useCategories } from "../use-categories"

export const useCategoryNavView = () => {
    const {categories} = useCategories()
    return {
        categories
    }
}
