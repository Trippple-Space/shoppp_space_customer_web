'use client';

import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import Button from '../../button/Button';
import Modal from '../../modal/modal';
import { PriceFilter } from './PriceFilter';
import { RatingFilter } from './RatingFilter';
import { SortFilter } from './SortFilter';
import { useFilterStore } from '@/modules/lib/utility/store/filter.store';
import { LocationFilter } from './LocationFilter';
import { AvailabilityFilter } from './AvailabilityFilter';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { filtersToSearchParams } from '@/modules/lib/utility/utility';
import { useStoreCategoryNavView } from '@/modules/lib/utility/hooks/views/use-category-nav-view';

interface ModalProps {
  modalOpen: boolean;
  handleCloseModal: () => void;
  filterBy?: any;
}

const FilterModal: React.FC<ModalProps> = ({
  modalOpen,
  handleCloseModal,
  filterBy,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { resetFilters, allFilters } = useFilterStore();
  const { selectedCategory } = useStoreCategoryNavView();

  const [sortBy, setSortBy] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [priceRange, setPriceRange] = useState<any>({ min: '', max: '' });
  const [selectedState, setSelectedState] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');

  const applyFilter = (e: any) => {
    e.preventDefault();

    const existingParams = new URLSearchParams(searchParams as any);

    const params = filtersToSearchParams(
      {
        ...allFilters,
        ...(filterBy === 'Rating' && { rating: { rateBy: rating } }),
        ...(filterBy === 'Price' && { price: priceRange }),
        ...(filterBy === 'Location' && { location: { selectedState } }),
        ...(filterBy === 'Availability' && { availability: { orderType } }),
        ...(filterBy === 'Sort' && { sort: { sortBy } }),
      },
      selectedCategory,
      existingParams
    );

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });

    handleCloseModal();
  };

  const handleReset = () => {
    resetFilters(filterBy.toLowerCase());

    const existingParams = new URLSearchParams(searchParams as any);
    const params = filtersToSearchParams(
      {
        ...allFilters,
        [filterBy.toLowerCase()]: {},
      },
      selectedCategory,
      existingParams
    );

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div>
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        modalClassName="filter"
        extraClass={{ boxShadow: '0 8px 16px 0 #494F5E1F' }}
        className={`border border-[#00000014] md:top-[20px] w-[90%] ${filterBy === 'Price' ? 'md:mr-[245px] max-w-[450px]' : filterBy === 'Rating' || filterBy === 'Availability' ? 'md:mr-[360px] max-w-[400px]' : 'md:mr-[35px] max-w-[400px]'}`}
      >
        <form onSubmit={applyFilter}>
          <div className="flex justify-between items-center border-b border-[#00000014] py-[12px] px-[24px]">
            <h4 className="font-semibold text-[16px] leading-[24px]">
              {filterBy} {filterBy === 'Price' && `(₦)`}
            </h4>
            <AiOutlineClose
              className="w-[20px] h-[20px] cursor-pointer"
              onClick={() => handleCloseModal()}
            />
          </div>
          <div className="flex gap-[10px] flex-col p-[24px]">
            <div
              className="overflow-hidden"
              style={{
                height: 'fit-content',
                maxHeight: 'calc(100dvh - 500px)',
              }}
            >
              <div
                className="overflow-auto"
                style={{
                  height: 'fit-content',
                  maxHeight: 'calc(100dvh - 500px)',
                }}
              >
                <div className="h-fit">
                  {filterBy === 'Price' ? (
                    <PriceFilter
                      filteredPrice={priceRange}
                      setFilteredPrice={setPriceRange}
                    />
                  ) : filterBy === 'Rating' ? (
                    <RatingFilter setRatingFilter={setRating} />
                  ) : filterBy === 'Sort' ? (
                    <SortFilter setSortFilter={setSortBy} />
                  ) : filterBy === 'Availability' ? (
                    <AvailabilityFilter setAvailabilityFilter={setOrderType} />
                  ) : (
                    <LocationFilter setLocationFilter={setSelectedState} />
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-[12px] justify-end pt-[12px] bg-white border-t border-[#00000014] -mx-[24px] px-[24px]">
              <button
                type="button"
                onClick={() => {
                  handleCloseModal();
                  handleReset();
                }}
                className={`bg-transparent border-[2px] text-[#000000E0] py-[10px] lg:py-[12px] px-[20px] w-fit rounded-[5px] cursor-pointer text-[13px] lg:text-[14px] font-inter transition-all duration-500 disabled:bg-[#676767]`}
              >
                Reset
              </button>
              <Button type="submit" children={'Apply'} className="lg:py-[12px]" />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FilterModal;
