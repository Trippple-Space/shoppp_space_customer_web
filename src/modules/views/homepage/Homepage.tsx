'use client';

import React, { useEffect, useState } from 'react';
import FabricsCategoryNav from '@/modules/lib/components/nav-bar/category-nav/FabricsCategoryNav';
import Footer from '@/modules/lib/components/footer/Footer';
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar';
import CentralArena from './CentralArena';
import { useStoreCategoryNavView } from '@/modules/lib/utility/hooks/views/use-category-nav-view';
import Filters from '@/modules/lib/components/nav-bar/FiltersNav/FiltersComponent';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useFilterStore } from '@/modules/lib/utility/store/filter.store';
import {
  filtersToSearchParams,
  formatNumberAsPrice,
  searchParamsToFilters,
} from '@/modules/lib/utility/utility';
import { TbX } from 'react-icons/tb';
import { IFilters } from '@/modules/lib/utility/types/product.interface';
import Collections from './Collections';
import { ICollection } from '@/modules/lib/utility/types/collection.interface';

const Homepage = ({ initialCollections = [] }: { initialCollections?: ICollection[] }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { categories, setSelectedCategory, selectedCategory } =
    useStoreCategoryNavView();
  const { setRate, setPrice, setSort, setLocation, allFilters, resetFilters } =
    useFilterStore();

  const [hasCollections, setHasCollections] = useState(false);
  const showCollectionsSection = !searchParams.get('search') && !searchParams.get('collection');
  const [collectionsLoaded, setCollectionsLoaded] = useState(!showCollectionsSection);

  useEffect(() => {
    if (!showCollectionsSection) setCollectionsLoaded(true);
  }, [showCollectionsSection]);

  useEffect(() => {
    const parsed = searchParamsToFilters(searchParams);

    if (parsed.rating?.rateBy) setRate(parsed.rating.rateBy);
    if (parsed.price?.min || parsed.price?.max) setPrice(parsed.price);
    if (parsed.sort?.sortBy) setSort(parsed.sort.sortBy);
    if (parsed.location?.selectedState)
      setLocation(parsed.location.selectedState);
  }, [searchParams]);

  const emptyCategory = {
    name: '',
    images: { icon: '', picture: '' },
    description: '',
    filters: {},
    subcategories: [],
  };

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    const hasSearchOrCollection = searchParams.get('search') || searchParams.get('collection');

    if (categoryFromUrl) {
      setSelectedCategory({
        ...selectedCategory,
        name: categoryFromUrl.toLowerCase(),
        filters: { name: categoryFromUrl.toLowerCase() },
      });
    } else if (hasSearchOrCollection) {
      setSelectedCategory(emptyCategory);
    }
  }, [searchParams, categories]);

  const hasPrice = !!allFilters.price.min || !!allFilters.price.max;
  const hasRating = !!allFilters.rating.rateBy;
  const hasLocation = !!allFilters.location.selectedState;
  const hasOffers = allFilters.showOffers;
  const hasCategory =
    !!selectedCategory.name && selectedCategory.name !== 'All';

  const getPriceLabel = () => {
    const { min, max } = allFilters.price;

    if (min && max)
      return `${formatNumberAsPrice(Number(min)) || '₦ 0'} - ${formatNumberAsPrice(Number(max)) || 'Infinity'}`;
    if (min) return `≥ ${formatNumberAsPrice(Number(min))}`;
    if (max) return `≤ ${formatNumberAsPrice(Number(max))}`;

    return '';
  };

  const handleReset = (filterBy: keyof IFilters) => {
    resetFilters(filterBy);

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

  const clearCategory = () => {
    setSelectedCategory({
      name: '',
      images: { icon: '', picture: '' },
      description: '',
      filters: {},
      subcategories: [],
    });

    const existingParams = new URLSearchParams(searchParams as any);
    const params = filtersToSearchParams(
      allFilters,
      selectedCategory,
      existingParams
    );
    params.delete('category');

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const clearAllFilters = () => {
    resetFilters('price');
    resetFilters('rating');
    resetFilters('location');
    resetFilters('sort');
    resetFilters('showOffers');
    setSelectedCategory({
      name: '',
      images: {
        icon: '',
        picture: '',
      },
      description: '',
      filters: {},
      subcategories: [],
    });

    const params = new URLSearchParams(searchParams as any);
    const searchTerm = params.get('search');
    const collection = params.get('collection')

    const newParams = new URLSearchParams();
    if (searchTerm) newParams.set('search', searchTerm);
    if (collection) newParams. set('collection', collection);

    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

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
        {(hasPrice || hasRating || hasLocation || hasOffers || hasCategory) && (
          <div className="bg-#F3F3F3 min-h-92 h-fit py-30 flex flex-col j-content-center">
            <div className="app-width flex j-content-between sm:gap-100 gap-30">
              <div className="flex gap-12">
                <div className="h-33 flex flex-col a-items-center j-content-center">
                  <p className="text-14 weight-500">Active:</p>
                </div>
                <div className="flex gap-12 flex-wrap a-items-center">
                  {hasCategory && (
                    <p className="bg-white h-33 min-w-121 flex gap-8 a-items-center j-content-between radius-999 p-10">
                      <span className="text-14 weight-500 capitalize">
                        {selectedCategory.name}
                      </span>
                      <TbX
                        className="w-15 h-15 cursor-pointer"
                        onClick={() => clearCategory()}
                      />
                    </p>
                  )}

                  {hasPrice && (
                    <p className="bg-white h-33 min-w-121 flex gap-8 a-items-center j-content-between radius-999 p-10">
                      <span className="text-14 weight-500" style={{ textWrap: "nowrap" }}>
                        {getPriceLabel()}
                      </span>
                      <TbX
                        className="w-15 h-15 cursor-pointer"
                        onClick={() => handleReset('price')}
                      />
                    </p>
                  )}

                  {hasLocation && (
                    <p className="bg-white h-33 min-w-121 flex gap-8 a-items-center j-content-between radius-999 p-10">
                      <span className="text-14 weight-500">
                        {allFilters.location.selectedState}
                      </span>
                      <TbX
                        className="w-15 h-15 cursor-pointer"
                        onClick={() => handleReset('location')}
                      />
                    </p>
                  )}

                  {hasOffers && (
                    <p className="bg-white h-33 min-w-121 flex gap-8 a-items-center j-content-between radius-999 p-10">
                      <span className="text-14 weight-500">Offers only</span>
                      <TbX
                        className="w-15 h-15 cursor-pointer"
                        onClick={() => handleReset('showOffers')}
                      />
                    </p>
                  )}

                  {hasRating && (
                    <p className="bg-white h-33 min-w-121 flex gap-8 a-items-center j-content-between radius-999 p-10">
                      <span className="text-14 weight-500">
                        Rating: {allFilters.rating.rateBy}+
                      </span>
                      <TbX
                        className="w-15 h-15 cursor-pointer"
                        onClick={() => handleReset('rating')}
                      />
                    </p>
                  )}
                </div>
              </div>
              <p
                className="underline text-14 weight-500 color-#1677FF cursor-pointer"
                style={{ textWrap: 'nowrap' }}
                onClick={clearAllFilters}
              >
                Clear Filters
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="app-width">
        {showCollectionsSection && (
          <Collections
            storeId="global"
            initialCollections={initialCollections}
            setHasCollections={setHasCollections}
            onCollectionsLoaded={() => setCollectionsLoaded(true)}
            setCollectionsLoaded={setCollectionsLoaded}
          />
        )}

        <CentralArena
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          hasCollections={hasCollections}
          collectionsLoaded={collectionsLoaded}
        />
      </div>
      <Footer />
    </>
  );
};

export default Homepage;
