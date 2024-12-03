import { useState } from "react"
import { useCategories } from "../use-categories"
import { usePathname } from "next/navigation"

export const useCategoryNavView = ({ storeId = 0 } = { storeId: 0}) => {
    const pathname = usePathname()
    const isWearsRoute = pathname.includes('wears')
    const {currentCategoryList, selectedCategory, setSelectedCategory} = useCategories({type: isWearsRoute ? 'wears' : 'fabrics', label: 'GLOBAL', storeId})
    return {
        categories: currentCategoryList,
        selectedCategory, 
        setSelectedCategory
    }
}
