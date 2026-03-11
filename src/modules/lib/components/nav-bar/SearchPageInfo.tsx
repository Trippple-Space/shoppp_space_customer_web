import React from 'react';
import { FiX } from 'react-icons/fi';

type SearchPageInfoProps = {
  searchTerm?: string;
  selectedCollection?: string;
  onClearSearch: () => void;
};

const SearchPageInfo = ({ searchTerm, selectedCollection, onClearSearch }: SearchPageInfoProps) => {
  return (
    <div className="bg-#F3F3F3 py-12 px-24 flex flex-col a-items-center j-content-center gap-16 sm:radius-55 radius-30 font-inter relative">
      <button
        onClick={onClearSearch}
        className="absolute t-16 sm:r-36 r-16 sm:w-40 w-28 sm:h-40 h-28 cursor-pointer hover:bg-#eee border-#999 border-solid radius-50p flex flex-col a-items-center j-content-center"
        aria-label="Clear Search"
        title='Clear Search'
      >
        <FiX className="sm:text-24 text-16 color-#999" />
      </button>

      {
        selectedCollection &&
        <div className="flex flex-col gap-8 a-items-center j-content-center">
          <h5 className="sm:text-32 text-20 weight-600 capitalize">{selectedCollection.replaceAll('-', ' ')}</h5>
          <p className="sm:text-16 text-14 weight-400">
            Browse all {searchTerm ? `'${searchTerm}' in` : 'products in'}  {selectedCollection.replaceAll('-', ' ')} collection
          </p>
        </div>
      }

      {
        searchTerm && !selectedCollection &&
        <div className="flex flex-col gap-8 a-items-center j-content-center">
          <h5 className="sm:text-32 text-20 weight-600 capitalize">{searchTerm}</h5>
          <p className="sm:text-16 text-14 weight-400">
            Browse all {searchTerm} results
          </p>
        </div>
      }

      {/* <div className='flex gap-16 a-items-center j-content-center'>
            <p className='text-14 weight-400'>Related keywords:</p>
            <p className='flex gap-16 a-items-center j-content-center'>
                <span className='text-14 weight-500'>Lace</span>
                <span className='text-14 weight-500'>Lace</span>
            </p>
        </div> */}
    </div>
  );
};

export default SearchPageInfo;
