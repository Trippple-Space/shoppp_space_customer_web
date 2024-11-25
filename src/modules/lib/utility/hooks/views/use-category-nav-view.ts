import { useState } from "react"
import { useCategories } from "../use-categories"
import { usePathname } from "next/navigation"

export const useCategoryNavView = () => {
    const pathname = usePathname()
    const isWearsRoute = pathname.includes('wears')
    const {currentCategoryList} = useCategories({type: isWearsRoute ? 'wears' : 'fabrics', label: 'GLOBAL'})
    return {
        categories: currentCategoryList
    }
}
