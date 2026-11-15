import React, { useEffect, useState } from 'react';
import BaseCategoryNav from './BaseCategoryNav';
import { cx, filtersToSearchParams } from '@/modules/lib/utility/utility';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SearchPageInfo from '../SearchPageInfo';
import { useFilterStore } from '@/modules/lib/utility/store/filter.store';

const FabricsCategoryNav = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  page,
}: any) => {
  const path = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { allFilters } = useFilterStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('');

  /*  useEffect(() => {
     const search = searchParams.get('search');
     const collection = searchParams.get('collection');
 
     setSearchTerm(search ?? '');
     setSelectedCollection(collection ?? '');
   }, [path, searchParams]); */

  useEffect(() => {
    const search = searchParams.get('search');
    const collection = searchParams.get('collection');

    if (search && search !== searchTerm) {
      setSearchTerm(search);
    }
    if (collection && collection !== selectedCollection) {
      setSelectedCollection(collection);
    }
  }, [searchParams]);

  return (
    <div
      className={cx('top-[75px] bg-white z-[1px]', {
        'lg:mt-[90px] mt-[80px] pb-[30px] app-width test-header': page === 'home',
        'mx-[24px] sm:mx-[40px] md:mx-[60px] lg:mx-[100px] xl:mx-[200px]': page !== 'home',
      })}
    >
      {searchTerm || selectedCollection ? (
        <SearchPageInfo
          searchTerm={searchTerm}
          selectedCollection={selectedCollection}
          onClearSearch={() => {
            const params = filtersToSearchParams(allFilters, selectedCategory);
            params.delete('search');
            params.delete('collection');
            setSearchTerm('');
            setSelectedCollection('');
            router.replace(`${path}?${params.toString()}`);
          }}
        />
      ) : (
        <BaseCategoryNav
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          page={page}
        />
      )}
    </div>
  );
};

export default FabricsCategoryNav;
