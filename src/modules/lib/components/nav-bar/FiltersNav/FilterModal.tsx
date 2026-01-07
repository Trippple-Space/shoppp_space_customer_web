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
import { usePathname, useRouter } from 'next/navigation';
import { filtersToSearchParams } from '@/modules/lib/utility/utility';
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

  const { resetFilters, allFilters } = useFilterStore();
  const [sortBy, setSortBy] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [priceRange, setPriceRange] = useState<any>({ min: '', max: '' });
  const [selectedState, setSelectedState] = useState<string>('');

  const applyFilter = (e: any) => {
    e.preventDefault();

    const params = filtersToSearchParams({
      ...allFilters,
      ...(filterBy === 'Rating' && { rating: { rateBy: rating } }),
      ...(filterBy === 'Price' && { price: priceRange }),
      ...(filterBy === 'Location' && {
        location: { selectedState },
      }),
      ...(filterBy === 'Sort' && { sort: { sortBy } }),
    });

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });

    handleCloseModal();
  };

  const handleReset = () => {
    resetFilters(filterBy.toLowerCase());

    const params = filtersToSearchParams({
      ...allFilters,
      [filterBy.toLowerCase()]: {},
    });

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
        className={`border border-#00000014 m:t-20 w-90p ${filterBy === 'Price' ? 'm:mr-245 max-w-450' : filterBy === 'Rating' ? 'm:mr-360 max-w-400' : 'm:mr-35 max-w-400'}`}
      >
        <form onSubmit={applyFilter}>
          <div className="flex space-between items-center border-b border-#00000014 py-12 px-24">
            <h4 className="weight-600 text-16 line-height-24">
              {filterBy} {filterBy === 'Price' && `(₦)`}
            </h4>
            <AiOutlineClose
              className="w-20 h-20 cursor-pointer"
              onClick={() => handleCloseModal()}
            />
          </div>
          <div className="flex gap-10 flex-col p-24">
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
                  ) : (
                    <LocationFilter setLocationFilter={setSelectedState} />
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-12 j-content-end pt-12 bg-white border-t border-#00000014 mx--24 px-24">
              <button
                type="button"
                onClick={() => {
                  handleCloseModal();
                  handleReset();
                }}
                className={`bg-none border-2 color-#000000E0 py-10 l:py-12 px-20 w-fit radius-5 cursor-pointer text-13 l:text-14 font-inter g|transition:0.5s disabled:bg-grey`}
              >
                Reset
              </button>
              <Button type="submit" children={'Apply'} className="l:py-12" />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FilterModal;
