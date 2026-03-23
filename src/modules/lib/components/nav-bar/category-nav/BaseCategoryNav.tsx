import React, { FC, useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import { ICategory } from '@/modules/lib/utility/types/product.interface';
import ImageAlt from '../../image-alt/ImageAlt';
import SkeletonLoader from '../../skeleton-loader/Skeleton';
import ScrollButtons from '../../scroll-buttons/scrollButtons';

// This one is gueressing Su's head :)
interface IBaseCategoryNav {
  categories: ICategory[];
  displayFilter?: boolean;
  isRoute?: boolean;
  selectedCategory?: any;
  setSelectedCategory?: any;
  page?: any;
}

const BaseCategoryNav: FC<IBaseCategoryNav> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  page,
}) => {
  const [activeOption, setActiveOption] = useState('All');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const name = selectedCategory?.name ?? '';
    const active =
      name && name !== 'All' && name.includes(',')
        ? name.split(',')[0].trim()
        : name;
    setActiveOption(active || 'All');
  }, [selectedCategory]);

  return (
    <div
      className={`flex a-items-center w-full relative ${
        page === 'home' && 'j-content-center'
      }`}
    >
      <div className="scroll-x no-scrollbar" ref={scrollRef}>
        <div
          className={`flex h-fit w-fit whitespace-nowrap ${
            page === 'store' ? 's:gap-12 gap-8' : 'gap-8'
          }`}
        >
          {categories?.map((category, i) => {
            const isActive =
              category?.name.toLowerCase() === activeOption.toLowerCase();
            const isSyntheticAll =
              category?.name?.toLowerCase?.()?.trim() === 'all' &&
              !category?.images?.icon &&
              !category?.images?.picture;

            return (
              <div
                key={isSyntheticAll ? 'all' : i}
                className={`${
                  page === 'home' ? 's:min-w-90 min-w-71' : 's:min-w-116 min-w-96'
                } flex j-content-center`}
              >
                <div
                  onClick={() => {
                    setActiveOption(category?.name);
                    setSelectedCategory({
                      ...category,
                      filters: category.name,
                    });
                  }}
                  className="flex flex-col a-items-center gap-7 space-between w-fit cursor-pointer"
                >
                  {isSyntheticAll ? (
                    <div
                      className={cx(
                        'flex a-items-center j-content-center bg-#00000008 border',
                        page === 'home'
                          ? 'w-47.02 h-46 round'
                          : 's:w-100 w-80 h-64 radius-6',
                        isActive ? 'border-2 border-green' : 'border-#00000026'
                      )}
                    >
                      <span
                        className={cx(
                          'weight-600 text-small capitalize',
                          isActive ? 'text-green' : 'color-#00000099'
                        )}
                      >
                        All
                      </span>
                    </div>
                  ) : !!category.images?.icon || category.images?.picture ? (
                    <ImageAlt
                      className={`${
                        page === 'home'
                          ? 'w-47.02 h-46 round'
                          : 's:w-100 w-80 h-64 radius-6'
                      } border object-fit ${
                        isActive ? 'border-2 border-green' : 'border-#00000026'
                      }`}
                      type={'image'}
                      src={category.images.picture}
                      iconClassName={`${
                        page === 'home'
                          ? 'w-47.02 h-46 round'
                          : 's:w-100 w-80 h-64 radius-6'
                      } border object-fit ${
                        isActive ? 'border-2 border-green' : 'border-#00000026'
                      }`}
                    />
                  ) : (
                    <SkeletonLoader />
                  )}

                  <div
                    className={cx(
                      'weight-600 text-small text-center capitalize g|max-width:90px',
                      { 'text-green': isActive }
                    )}
                  >
                    {category.name || (
                      <SkeletonLoader className="block! h-10!" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ScrollButtons
        scrollRef={scrollRef}
        page={page}
        scrollLength={categories.length}
        component={'categories'}
      />
    </div>
  );
};

export default BaseCategoryNav;
