import React, { useState } from 'react'
import BoxRadio from '../../box-radio/BoxRadio'
import { useFilterStore } from '@/modules/lib/utility/store/filter.store'

interface ISortFilter {
    sortFilter?: string,
    setSortFilter?: any,
}

export const SortFilter: React.FC<ISortFilter> = ({ setSortFilter }) => {
    const { allFilters } = useFilterStore()
    const [sort, setSort] = useState<string>(allFilters.sort.sortBy)
    const sortOptions = [
        'Recommended', 'Popular', 'Fast selling'
    ]

    return (
        <ul className='flex flex-col'>
            {
                sortOptions.map((sortBy) => (
                    <li key={sortBy} className='flex gap-[12px] py-[10px]'>
                        <div className='h-fit w-fit text-[#6A6A6A] hover:text-[#000000E0]'>
                            <BoxRadio label={sortBy} className='filter' name='sortBy' id='sortBy' checked={sortBy === sort} onChange={() => { setSortFilter(`${sortBy}`); setSort(`${sortBy}`) }} />
                        </div>
                    </li>
                ))
            }
        </ul>
    )
}
