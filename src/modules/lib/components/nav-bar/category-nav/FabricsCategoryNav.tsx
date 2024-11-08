import React from 'react'
import BaseCategoryNav from './BaseCategoryNav'

const FabricsCategoryNav = ({categories, setSelectedCategory}: any) => {
    return (
        <div className='l:mt-100 mt-75 app-width t-75 bg-white z-1 test-header'>
            <BaseCategoryNav categories={categories} setSelectedCategory={setSelectedCategory} />
        </div>
    )
}

export default FabricsCategoryNav
