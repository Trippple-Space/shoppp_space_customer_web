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
                    <li key={sortBy} className='flex gap-12 py-10'>
                        <div className='h-fit w-fit color-#6A6A6A hover:color-#000000E0'>
                            <BoxRadio label={sortBy} className='filter' name='sortBy' id='sortBy' checked={sortBy === sort} onChange={() => { setSortFilter(`${sortBy}`); setSort(`${sortBy}`) }} />
                        </div>
                    </li>
                ))
            }
        </ul>
    )
}
