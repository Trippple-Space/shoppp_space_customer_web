import React from 'react'
import Input from '../../input/Input'
import { GoArrowBoth } from 'react-icons/go'
import BoxRadio from '../../box-radio/BoxRadio'

export const PriceFilter = () => {

    const priceOptions = [
        { min: 0, max: 20, label: 'Under 20 K' },
        { min: 20, max: 50, label: '20 - 50 K' },
        { min: 50, max: 100, label: '50 - 100 K' },
        { min: 100, max: 'none', label: 'More than 100 K' }
    ]

    return (
        <>
            <div className='flex gap-4 items-center'>
                <div className='relative'>
                    <Input label={'Min'} inputClass={'p-12'} placeholder='0.00' type='number' name='min-value' />
                    <span className='absolute w-30 h-19 bg-white r-12 b-12'></span>
                </div>
                <GoArrowBoth className='w-24 h-24 mt-30 color-#00000026' />
                <div className='relative'>
                    <Input label={'Max'} inputClass={'p-12'} placeholder='0.00' type='number' name='max-value' />
                    <span className='absolute w-30 h-19 bg-white r-12 b-12'></span>
                </div>
            </div>
            <ul className='flex flex-col'>
                {
                    priceOptions.map((prices) => (
                        <li key={prices.label} className='flex gap-12 py-10'>
                            <div className='h-fit w-fit color-#6A6A6A hover:color-#000000E0'>
                                <BoxRadio label={prices.label} className='filter' name='price-range' />
                            </div>
                        </li>
                    ))
                }
            </ul>
        </>
    )
}
