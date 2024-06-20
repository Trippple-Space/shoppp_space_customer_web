import { useState } from "react"
import { useCategories } from "../use-categories"
import { usePathname } from "next/navigation"

export const useCategoryNavView = () => {
    const pathname = usePathname()
    const isWearsRoute = pathname.includes('wears')
    const {categories} = useCategories({type: isWearsRoute ? 'wears' : 'fabrics'})
    return {
        categories
    }
}
