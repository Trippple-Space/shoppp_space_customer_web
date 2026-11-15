import React, { useEffect, useState } from 'react'
import { LiaAngleDownSolid, LiaLayerGroupSolid, LiaStar, LiaTagSolid } from 'react-icons/lia'
import FilterModal from './FilterModal'
import { useFilterStore } from '@/modules/lib/utility/store/filter.store'
import { HiOutlineLocationMarker } from 'react-icons/hi'

const Filters = () => {
  const { setShowOffers, allFilters } = useFilterStore()
  const filters = [
    /*{ name: 'Offers', downIcon: false, extraIcon: LiaTagSolid }, */
    { name: 'Rating', downIcon: true, extraIcon: LiaStar },
    { name: 'Price', downIcon: true, extraIcon: null },
    { name: 'Availability', downIcon: true, extraIcon: LiaLayerGroupSolid },
    /*{ name: 'Sort', downIcon: true, extraIcon: null }, */
    { name: 'Location', downIcon: true, extraIcon: HiOutlineLocationMarker }
  ]

  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
  const [selectedFilter, setSelectedFilter] = useState<string>()
  const [activeFilters, setActiveFilters] = useState<any>([])


  useEffect(() => {
    const getNonEmptyFilterKeys = (filters: any) => {
      return Object.keys(filters).filter(key => {
        const filter = filters[key];
        return Object.values(filter).some(value => value !== "");
      });
    }
    setActiveFilters(getNonEmptyFilterKeys(allFilters))
  }, [allFilters])

  const handleCloseModal = () => {
    setIsFilterOpen(false)
    setSelectedFilter('')
  }

  const openFilterOptions = (option: string) => {
    setIsFilterOpen(true);
    setSelectedFilter(option)
  }

  return (
    <div className='relative'>
      <div className='overflow-x-auto no-scrollbar pb-[24px]'>
        <div className='flex flex-row flex-nowrap justify-start sm:justify-center sm:gap-[12px] gap-[8px] w-max min-w-full px-[4px]'>
        {
          filters?.map((filter) => (
            <div key={filter.name}
              onClick={() => {
                if (filter.name === 'Offers') {
                  setShowOffers()
                } else {
                  openFilterOptions(filter.name)
                }
              }}
              className={`shrink-0 sm:py-[8px] py-[6px] sm:px-[12px] px-[10px] flex flex-row gap-[6px] items-center bg-[#F5F5F5] transition-all duration-400; rounded-[999px] w-fit font-medium sm:text-[14px] text-[12px] leading-[16.94px] cursor-pointer ${(selectedFilter === filter.name && !activeFilters.includes(filter.name.toLocaleLowerCase())) ? 'bg-[#00000014]' : activeFilters.includes(filter.name.toLocaleLowerCase()) ? 'bg-[#FACE33]' : 'bg-[#F5F5F5] hover:bg-[#00000014]'}  ${filter.name === 'Offers' && allFilters.showOffers && 'bg-[#FACE33] hover:bg-[#FACE33]'}`}
            >
              {filter.extraIcon && <filter.extraIcon className='sm:w-[16px] w-[14px] sm:h-[16px] h-[14px]' />}
              <span>{filter.name}</span>
              {filter.downIcon && <LiaAngleDownSolid className='sm:w-[12px] w-[10px] sm:h-[12px] h-[10px] mt-[2px]' />}
            </div>
          ))
        }
        </div>
      </div>
      <FilterModal modalOpen={isFilterOpen} filterBy={selectedFilter} handleCloseModal={handleCloseModal} />
    </div>
  );

}

export default Filters
