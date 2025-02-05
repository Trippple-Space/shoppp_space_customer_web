import React from 'react'
import BoxRadio from '../../box-radio/BoxRadio'

export const SortFilter = () => {
    const sortOptions = [
        'Recommended', 'Popular', 'Fast selling'
    ]

    return (
        <ul className='flex flex-col'>
            {
                sortOptions.map((sortBy) => (
                    <li key={sortBy} className='flex gap-12 py-10'>
                        <div className='h-fit w-fit color-#6A6A6A hover:color-#000000E0'>
                            <BoxRadio label={sortBy} className='filter' name='sortBy' />
                        </div>
                    </li>
                ))
            }
        </ul>
    )
}
