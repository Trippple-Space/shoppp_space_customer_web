import React from 'react'
import { BiHomeAlt2 } from 'react-icons/bi'
import BaseCategoryNav from './BaseCategoryNav'
import { useCategoryNavView } from '@/modules/lib/utility/hooks/views/use-category-nav-view'

const FabricsCategoryNav = () => {
    const {categories} = useCategoryNavView()

    return (
        <div className='mt-100 app-width sticky t-34 bg-white z-1 test-header'>
            <BaseCategoryNav categories={categories} />
        </div>
    )
}

export default FabricsCategoryNav
