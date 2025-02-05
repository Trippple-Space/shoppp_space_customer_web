import React, { ReactNode, FC, useState } from 'react'
import { LiaAngleDownSolid, LiaStar, LiaTagSolid } from 'react-icons/lia'
import FilterModal from './FilterModal'

const Filters = () => {
    const filters = [
        { name: 'Offers', downIcon: false, extraIcon: LiaTagSolid },
        { name: 'Rating', downIcon: true, extraIcon: LiaStar },
        { name: 'Price', downIcon: true, extraIcon: null },
        { name: 'Sort', downIcon: true, extraIcon: null }
    ]

    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
    const [selectedFilter, setSelectedFilter] = useState<string>()
    const handleCloseModal = () => {
        setIsFilterOpen(false)
        setSelectedFilter('')
    }

    return (
        (<div className='relative'>
            <div className='flex flex-row j-content-center s:gap-12 gap-8 pb-24'>
                {
                    filters?.map((filter) => (
                        <div key={filter.name} onClick={() => { setIsFilterOpen(true); setSelectedFilter(filter.name) }} className={`s:py-8 py-6 s:px-12 px-10 flex flex-row gap-6 a-items-center bg-#F5F5F5 hover:bg-#00000014 g|transition:0.4s; radius-999 w-fit weight-500 s:text-14 text-12 line-height-16.94 cursor-pointer ${selectedFilter === filter.name? 'bg-#00000014' : 'bg-#F5F5F5'}`}>
                            {filter.extraIcon && <filter.extraIcon className='s:w-16 w-14 s:h-16 h-14' />}
                            <span>{filter.name}</span>
                            {filter.downIcon && <LiaAngleDownSolid className='s:w-12 w-10 s:h-12 h-10 mt-2' />}
                        </div>
                    ))
                }
            </div>
            <FilterModal modalOpen={isFilterOpen} filterBy={selectedFilter} handleCloseModal={handleCloseModal} />
        </div>)
    );
}

export default Filters
