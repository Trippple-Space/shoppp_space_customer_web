'use client';

import React, { useEffect } from 'react';
import FabricsCategoryNav from '@/modules/lib/components/nav-bar/category-nav/FabricsCategoryNav';
import Footer from '@/modules/lib/components/footer/Footer';
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar';
import CentralArena from './CentralArena';
import { useStoreCategoryNavView } from '@/modules/lib/utility/hooks/views/use-category-nav-view';
import Filters from '@/modules/lib/components/nav-bar/FiltersNav/FiltersComponent';
import { useSearchParams } from 'next/navigation';
import { useFilterStore } from '@/modules/lib/utility/store/filter.store';
import { searchParamsToFilters } from '@/modules/lib/utility/utility';

const Homepage = () => {
  const { categories, setSelectedCategory, selectedCategory } =
    useStoreCategoryNavView();

  const searchParams = useSearchParams();
  const { setRate, setPrice, setSort, setLocation } = useFilterStore();

  useEffect(() => {
    const parsed = searchParamsToFilters(searchParams);

    if (parsed.rating?.rateBy) setRate(parsed.rating.rateBy);
    if (parsed.price?.min || parsed.price?.max) setPrice(parsed.price);
    if (parsed.sort?.sortBy) setSort(parsed.sort.sortBy);
    if (parsed.location?.selectedState)
      setLocation(parsed.location.selectedState);
  }, [searchParams]);

  return (
    <>
      <div className="border-b border-whitesmoke">
        <HomepageNavBar parent="" />
        <FabricsCategoryNav
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          page={'home'}
          key={categories}
        />
        <Filters />
      </div>
      <div className="app-width">
        <CentralArena />
      </div>
      <Footer />
    </>
  );
};

export default Homepage;
