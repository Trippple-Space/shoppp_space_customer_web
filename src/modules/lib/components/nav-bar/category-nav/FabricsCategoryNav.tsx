import React from 'react'
import BaseCategoryNav from './BaseCategoryNav'

const FabricsCategoryNav = ({categories, setSelectedCategory}: any) => {
    return (
        <div className='l:mt-70 mt-65 app-width sticky t-34 bg-white z-1 test-header'>
            <BaseCategoryNav categories={categories} setSelectedCategory={setSelectedCategory} />
        </div>
    )
}

export default FabricsCategoryNav
