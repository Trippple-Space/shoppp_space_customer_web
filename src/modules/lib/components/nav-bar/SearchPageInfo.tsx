'use client';

import React from 'react';
import { FiX } from 'react-icons/fi';
import { useSearchParams } from 'next/navigation';

type SearchPageInfoProps = {
  searchTerm?: string;
  selectedCollection?: string;
  onClearSearch: () => void;
};

const SearchPageInfo = ({ onClearSearch, searchTerm, selectedCollection }: SearchPageInfoProps) => {
  const searchParams = useSearchParams();

  const searchFromUrl = (searchParams.get('search') ?? '').trim();
  const collectionFromUrl = (searchParams.get('collection') ?? '').trim();

  if (!searchFromUrl && !collectionFromUrl) return null;

  return (
    <div className="bg-[#F3F3F3] py-[12px] px-[24px] flex flex-col items-center justify-center gap-[16px] sm:rounded-[55px] rounded-[30px] font-inter relative">
      <button
        onClick={onClearSearch}
        className="absolute top-[16px] sm:right-[36px] right-[16px] sm:w-[40px] w-[28px] sm:h-[40px] h-[28px] cursor-pointer hover:bg-[#eee] border-[#999] border-solid rounded-full flex flex-col items-center justify-center"
        aria-label="Clear Search"
        title='Clear Search'
      >
        <FiX className="sm:text-[24px] text-[16px] text-[#999]" />
      </button>

      {
        collectionFromUrl &&
        <div className="flex flex-col gap-[8px] items-center justify-center">
          <h5 className="sm:text-[32px] text-[20px] font-semibold capitalize">{collectionFromUrl.replaceAll('-', ' ')}</h5>
          <p className="sm:text-[16px] text-[14px] font-normal">
            Browse all {searchFromUrl ? `'${searchFromUrl}' in` : 'products in'}  {collectionFromUrl.replaceAll('-', ' ')} collection
          </p>
        </div>
      }

      {
        searchFromUrl && !collectionFromUrl &&
        <div className="flex flex-col gap-[8px] items-center justify-center">
          <h5 className="sm:text-[32px] text-[20px] font-semibold capitalize">{searchFromUrl}</h5>
          <p className="sm:text-[16px] text-[14px] font-normal">
            Browse all {searchFromUrl} results
          </p>
        </div>
      }

      {/* <div className='flex gap-[16px] items-center justify-center'>
            <p className='text-[14px] font-normal'>Related keywords:</p>
            <p className='flex gap-[16px] items-center justify-center'>
                <span className='text-[14px] font-medium'>Lace</span>
                <span className='text-[14px] font-medium'>Lace</span>
            </p>
        </div> */}
    </div>
  );
};

export default SearchPageInfo;
