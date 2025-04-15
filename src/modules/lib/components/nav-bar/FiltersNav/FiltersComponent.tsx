import React, { useEffect, useRef, useState } from 'react'
import { LiaAngleDownSolid, LiaStar, LiaTagSolid } from 'react-icons/lia'
import FilterModal from './FilterModal'
import { useFilterStore } from '@/modules/lib/utility/store/filter.store'
import { useFilter } from '@/modules/lib/utility/hooks/use-filter'
import { HiOutlineLocationMarker } from 'react-icons/hi'

const Filters = () => {
  const { allFilters } = useFilter();
  const { setShowOffers } = useFilterStore()
  const filters = [
    { name: 'Offers', downIcon: false, extraIcon: LiaTagSolid },
    { name: 'Rating', downIcon: true, extraIcon: LiaStar },
    { name: 'Price', downIcon: true, extraIcon: null },
    { name: 'Sort', downIcon: true, extraIcon: null },
    { name: 'Location', downIcon: true, extraIcon: HiOutlineLocationMarker }
  ]

  const modalRef = useRef<any>()
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
    if (modalRef.current) {
      const offset = 100
      const scrollToElem = modalRef.current.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: scrollToElem - offset, behavior: 'smooth' })
    }
  }

  return (
    <div className='relative' ref={modalRef}>
      <div className='flex flex-row j-content-center s:gap-12 gap-8 pb-24'>
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
              className={`s:py-8 py-6 s:px-12 px-10 flex flex-row gap-6 a-items-center bg-#F5F5F5 g|transition:0.4s; radius-999 w-fit weight-500 s:text-14 text-12 line-height-16.94 cursor-pointer ${(selectedFilter === filter.name && !activeFilters.includes(filter.name.toLocaleLowerCase())) ? 'bg-#00000014' : activeFilters.includes(filter.name.toLocaleLowerCase()) ? 'bg-#FACE33' : 'bg-#F5F5F5 hover:bg-#00000014'}  ${filter.name === 'Offers' && allFilters.showOffers && 'bg-#FACE33 hover:bg-#FACE33'}`}
            >
              {filter.extraIcon && <filter.extraIcon className='s:w-16 w-14 s:h-16 h-14' />}
              <span>{filter.name}</span>
              {filter.downIcon && <LiaAngleDownSolid className='s:w-12 w-10 s:h-12 h-10 mt-2' />}
            </div>
          ))
        }
      </div>
      <FilterModal modalOpen={isFilterOpen} filterBy={selectedFilter} handleCloseModal={handleCloseModal} />
    </div>
  );

}

export default Filters
