import React, { useEffect, useState } from 'react'
import Input from '../../input/Input'
import { GoArrowBoth } from 'react-icons/go'
import BoxRadio from '../../box-radio/BoxRadio'
import { useFilterStore } from '@/modules/lib/utility/store/filter.store'

interface IPriceFilter {
    filteredPrice?: any,
    setFilteredPrice?: any;
}

export const PriceFilter: React.FC<IPriceFilter> = ({ setFilteredPrice }) => {
    const { allFilters } = useFilterStore()
    const [isRadioChecked, setIsRadioChecked] = useState<boolean>(true)
    const [inputRange, setInputRange] = useState<any>({ min: allFilters.price.min, max: allFilters.price.max })
    const [radioRange, setRadioRange] = useState<any>({ min: allFilters.price.min, max: allFilters.price.max })
    const priceOptions = [
        { min: '0', max: '19000', label: 'Under 20,000' },
        { min: '20000', max: '50000', label: '20,000 - 50,000' },
        { min: '50000', max: '100000', label: '50,000 - 100,000' },
        { min: '100000', max: 'infinity', label: 'More than 100,000' }
    ]

    const setPriceRange = (key: "min" | "max", value: string) => {
        setInputRange((prev: any) => ({ ...prev, [key]: value }));
        
        if (!isRadioChecked) {
            setFilteredPrice({ min: '', max: '' })
            if (key === 'min'){
                setInputRange((prev: any) => ({...prev, max: ''}))
            } else {
                setInputRange((prev: any) => ({...prev, min: ''}))
            }
        }
        setFilteredPrice((prev: any) => ({ ...prev, [key]: value }));
        setRadioRange({ min: '', max: '' });
    };


    useEffect(() => {
        const checkedRadio = priceOptions.find((option) => option?.min === radioRange?.min && option?.max === radioRange?.max)
        setIsRadioChecked(!checkedRadio)
    }, [radioRange])

    return (
        <>
            <div className='flex gap-4 items-center'>
                <div className='relative'>
                    <Input label={'Min'} inputClass={'p-12'} placeholder='0.00' type='number' name='min-value' value={isRadioChecked ? inputRange?.min : ''}
                        handleChange={(e: any) => {
                            const newMin = e.target.value;
                            setPriceRange("min", newMin);
                        }}
                    />
                    <span className='absolute w-30 h-19 bg-white r-12 b-12'></span>
                </div>
                <GoArrowBoth className='w-24 h-24 mt-30 color-#00000026' />
                <div className='relative'>
                    <Input label={'Max'} inputClass={'p-12'} placeholder='0.00' type='number' name='max-value' value={isRadioChecked ? inputRange?.max : ''}
                        handleChange={(e: any) => {
                            const newMax = e.target.value;
                            setPriceRange("max", newMax);
                        }}
                    />
                    <span className='absolute w-30 h-19 bg-white r-12 b-12'></span>
                </div>
            </div>
            <ul className='flex flex-col'>
                {
                    priceOptions.map((prices) => (
                        <li key={prices.label} className='flex gap-12 py-10'>
                            <div className='h-fit w-fit color-#6A6A6A hover:color-#000000E0'>
                                <BoxRadio label={prices.label} className='filter' name='price-range' checked={prices?.min === radioRange.min && prices?.max === radioRange.max}
                                    onChange={() => {
                                        setFilteredPrice({ min: prices.min, max: prices.max })
                                        setRadioRange({ min: prices.min, max: prices.max });
                                        setInputRange({ min: '', max: '' });
                                    }}
                                />
                            </div>
                        </li>
                    ))
                }
            </ul>
        </>
    )
}