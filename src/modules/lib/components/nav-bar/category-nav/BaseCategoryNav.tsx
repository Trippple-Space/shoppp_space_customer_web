'use client';

import React, {
  FC,
  ReactNode,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
} from 'react';
import { createPortal } from 'react-dom';
import cx from 'classnames';
import { ICategory } from '@/modules/lib/utility/types/product.interface';
import ImageAlt from '../../image-alt/ImageAlt';
import SkeletonLoader from '../../skeleton-loader/Skeleton';
import ScrollButtons from '../../scroll-buttons/scrollButtons';

const StickyWhenPassed = ({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const [navHeight, setNavHeight] = useState(64);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!enabled) return;

    const nav = document.querySelector('[data-shoppp-main-nav]');
    if (!nav) return;

    const updateNav = () => setNavHeight(nav.getBoundingClientRect().height);
    updateNav();

    const navObserver = new ResizeObserver(updateNav);
    navObserver.observe(nav);
    window.addEventListener('resize', updateNav);

    return () => {
      navObserver.disconnect();
      window.removeEventListener('resize', updateNav);
    };
  }, [enabled]);

  useLayoutEffect(() => {
    if (!enabled) return;

    const bar = barRef.current;
    if (!bar) return;

    const updateHeight = () => {
      if (!isStuck) setBarHeight(bar.offsetHeight);
    };
    updateHeight();

    const barObserver = new ResizeObserver(updateHeight);
    barObserver.observe(bar);

    return () => barObserver.disconnect();
  }, [enabled, isStuck, children]);

  useEffect(() => {
    if (!enabled) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && barRef.current) {
          setBarHeight(barRef.current.offsetHeight);
        }
        setIsStuck(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: `-${navHeight}px 0px 0px 0px`,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [enabled, navHeight]);

  if (!enabled) return <>{children}</>;

  const bar = (
    <div
      ref={barRef}
      className={cx('bg-white', {
        'fixed left-0 right-0 z-[4px] pt-[12px] pb-[16px] border-b border-[#F5F5F5]': isStuck,
      })}
      style={isStuck ? { top: navHeight } : undefined}
    >
      <div className={isStuck ? 'app-width' : undefined}>{children}</div>
    </div>
  );

  return (
    <>
      <div ref={sentinelRef} style={{ height: 1 }} />
      {isStuck && <div style={{ height: barHeight }} aria-hidden />}
      {isStuck && mounted ? createPortal(bar, document.body) : bar}
    </>
  );
};

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
    <StickyWhenPassed enabled={page === 'home'}>
    <div
      className={`flex items-center w-full relative ${
        page === 'home' && 'justify-center'
      }`}
    >
      <div className="scroll-x no-scrollbar" ref={scrollRef}>
        <div
          className={`flex h-fit w-fit whitespace-nowrap ${
            page === 'store' ? 'sm:gap-[12px] gap-[8px]' : 'gap-[8px]'
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
                  page === 'home' ? 'sm:min-w-[90px] min-w-[71px]' : 'sm:min-w-[116px] min-w-[96px]'
                } flex justify-center`}
              >
                <div
                  onClick={() => {
                    if (isActive) {
                      setActiveOption('All');
                      setSelectedCategory({
                        ...category,
                        name: 'All',
                        filters: {},
                      });
                      return;
                    }

                    setActiveOption(category?.name);
                    setSelectedCategory({
                      ...category,
                      filters: category.name,
                    });
                  }}
                  className="flex flex-col items-center gap-[7px] justify-between w-fit cursor-pointer"
                >
                  {isSyntheticAll ? (
                    <div
                      className={cx(
                        'flex items-center justify-center bg-[#00000008] border',
                        page === 'home'
                          ? 'w-[47.02px] h-[46px] rounded-full'
                          : 'sm:w-[100px] w-[80px] h-[64px] rounded-[6px]',
                        isActive ? 'border-[2px] border-brand' : 'border-[#00000026]'
                      )}
                    >
                      <span
                        className={cx(
                          'font-semibold text-small capitalize',
                          isActive ? 'text-brand' : 'text-[#00000099]'
                        )}
                      >
                        All
                      </span>
                    </div>
                  ) : !!category.images?.icon || category.images?.picture ? (
                    <ImageAlt
                      className={`${
                        page === 'home'
                          ? 'w-[47.02px] h-[46px] rounded-full'
                          : 'sm:w-[100px] w-[80px] h-[64px] rounded-[6px]'
                      } border object-fit ${
                        isActive ? 'border-[2px] border-brand' : 'border-[#00000026]'
                      }`}
                      type={'image'}
                      src={category.images.picture}
                      iconClassName={`${
                        page === 'home'
                          ? 'w-[47.02px] h-[46px] rounded-full'
                          : 'sm:w-[100px] w-[80px] h-[64px] rounded-[6px]'
                      } border object-fit ${
                        isActive ? 'border-[2px] border-brand' : 'border-[#00000026]'
                      }`}
                    />
                  ) : (
                    <SkeletonLoader />
                  )}

                  <div
                    className={cx(
                      'font-semibold text-small text-center capitalize max-w-[90px]',
                      { 'text-brand': isActive }
                    )}
                  >
                    {category.name || (
                      <SkeletonLoader className="!block !h-[10px]" />
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
    </StickyWhenPassed>
  );
};

export default BaseCategoryNav;
