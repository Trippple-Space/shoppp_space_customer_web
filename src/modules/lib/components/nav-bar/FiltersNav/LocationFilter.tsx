import React, { useState } from 'react'
import BoxRadio from '../../box-radio/BoxRadio'
import { useFilterStore } from '@/modules/lib/utility/store/filter.store'
import { states } from '@/modules/lib/utility/utility'

interface ILocationFilter {
    locationFilter?: string,
    setLocationFilter?: any,
}

export const LocationFilter: React.FC<ILocationFilter> = ({ setLocationFilter }) => {
    const { allFilters } = useFilterStore()
    const [location, setLocation] = useState<string>(allFilters.location.selectedState)

    return (
        <ul className='flex flex-col'>
            {
                states.map((option) => (
                    <li key={option} className='flex gap-12 py-10'>
                        <div className='h-fit w-fit color-#6A6A6A hover:color-#000000E0'>
                            <BoxRadio label={option} className='filter' name='location' id='location' checked={option === location} onChange={() => { setLocationFilter(`${option}`); setLocation(`${option}`) }} />
                        </div>
                    </li>
                ))
            }
        </ul>
    )
}
