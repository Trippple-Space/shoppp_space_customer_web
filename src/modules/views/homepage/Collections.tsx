import { useCollections } from '@/modules/lib/utility/hooks/use-collections';
import CollectionSection from './CollectionSection';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ICollection } from '@/modules/lib/utility/types/collection.interface';
import { TbAlertCircle, TbRefresh } from 'react-icons/tb';
import Button from '@/modules/lib/components/button/Button';
import cx from 'classnames';

const Collections = ({
  storeId,
  initialCollections = [],
  setHasCollections,
  onCollectionsLoaded,
  setCollectionsLoaded,
  isStoreBased = false,
  headingClassName = '',
  subHeadingClassName = '',
  hasMargin = '',
  hasAppWidth = true,
  onAllCollectionsEmptyChange,
}: {
  storeId: string;
  initialCollections?: ICollection[];
  setHasCollections?: (hasCollections: boolean) => void;
  onCollectionsLoaded?: () => void;
  setCollectionsLoaded?: (collectionsLoaded: boolean) => void;
  isStoreBased?: boolean;
  headingClassName?: string;
  subHeadingClassName?: string;
  hasMargin?: string;
  hasAppWidth?: boolean;
  onAllCollectionsEmptyChange?: (allEmpty: boolean) => void;
}) => {
  const { collections, loading: loadingCollections, error, retry } = useCollections({
    storeId,
    type: null,
    initialCollections,
  });

  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [collectionEmptyState, setCollectionEmptyState] = useState<Record<string, boolean>>({});
  const onCollectionsLoadedRef = useRef(onCollectionsLoaded);
  onCollectionsLoadedRef.current = onCollectionsLoaded;

  const handleCollectionEmptyStateChange = useCallback(
    (collectionId: string, isEmpty: boolean) => {
      setCollectionEmptyState((prev) => {
        if (prev[collectionId] === isEmpty) return prev;
        return { ...prev, [collectionId]: isEmpty };
      });
    },
    []
  );

  useEffect(() => {
    setCollectionEmptyState(
      collections.reduce<Record<string, boolean>>((acc, collection) => {
        acc[collection.id] = collection.productCount === 0;
        return acc;
      }, {})
    );
  }, [collections]);

  useEffect(() => {
    if (collections.length > 0) {
      setHasCollections?.(true);
    }
  }, [collections]);

  useEffect(() => {
    if (!loadingCollections && onCollectionsLoadedRef.current) {
      setCollectionsLoaded?.(false);
      let rafId1: number | undefined;
      const rafId2 = requestAnimationFrame(() => {
        rafId1 = requestAnimationFrame(() => {
          onCollectionsLoadedRef.current?.();
        });
      });
      return () => {
        cancelAnimationFrame(rafId2);
        if (rafId1 != null) cancelAnimationFrame(rafId1);
      };
    }
  }, [loadingCollections, setCollectionsLoaded]);

  const allCollectionsEmpty =
    collections.length > 0 && collections.every((collection) => collectionEmptyState[collection.id] === true);
  const sortedCollections = [...collections].sort((a, b) => {
    const toPriority = (value: unknown): number | null => {
      if (typeof value === 'number' && Number.isFinite(value)) return value;
      if (typeof value === 'string' && value.trim() !== '') {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) return parsed;
      }
      return null;
    };

    const aPriority = toPriority(a.meta?.simpleLayoutView?.priorityScore);
    const bPriority = toPriority(b.meta?.simpleLayoutView?.priorityScore);

    // Higher priorityScore should render first.
    if (aPriority !== null && bPriority !== null) {
      if (bPriority !== aPriority) return bPriority - aPriority;
    } else if (aPriority !== null) {
      return -1;
    } else if (bPriority !== null) {
      return 1;
    }

    // Keep ordering deterministic when priority is same/missing.
    const aCreatedAt = new Date(a.createdAt ?? 0).getTime();
    const bCreatedAt = new Date(b.createdAt ?? 0).getTime();
    return bCreatedAt - aCreatedAt;
  });
  const visibleCollectionIds = sortedCollections
    .filter((collection) => !collectionEmptyState[collection.id])
    .map((collection) => collection.id);
  const visibleCollections = sortedCollections.filter(
    (collection) => !collectionEmptyState[collection.id]
  );
  const shouldSpanByCollectionId = useMemo(() => {
    const spanMap: Record<string, boolean> = {};
    let currentRowCol = 0;

    visibleCollections.forEach((collection, index) => {
      const isForced = collection.meta?.simpleLayoutView?.shouldSpanFullWidth === true;
      const nextIsForced =
        visibleCollections[index + 1]?.meta?.simpleLayoutView?.shouldSpanFullWidth === true;
      let shouldSpan = isForced;

      // Prevent a single half-width card sitting above a forced full-width row.
      if (!isForced && nextIsForced && currentRowCol === 0) {
        shouldSpan = true;
      }

      if (shouldSpan) {
        currentRowCol = 0;
      } else {
        currentRowCol = currentRowCol === 0 ? 1 : 0;
      }

      spanMap[collection.id] = shouldSpan;
    });

    return spanMap;
  }, [visibleCollections]);

  useEffect(() => {
    onAllCollectionsEmptyChange?.(allCollectionsEmpty);
  }, [allCollectionsEmpty, onAllCollectionsEmptyChange]);

  const containerClassName = cx(
    !isStoreBased
      ? "w-full"
      : hasAppWidth
        ? "app-width max-w-[1440px] mx-auto"
        : "",
    !allCollectionsEmpty && !isStoreBased && "md:mt-[32px] mt-[24px]",
    !allCollectionsEmpty && hasMargin,
    "flex flex-col"
  );

  if (loadingCollections) return null;

  if (error && collections.length === 0) {
    return (
      <div className={containerClassName}>
        <div
          className="flex flex-col items-center justify-center gap-[20px] py-[48px] px-[24px] rounded-16 bg-[#FAFAFA]"
          role="alert"
          aria-live="polite"
        >
          <span className="flex items-center justify-center w-[56px] h-[56px] rounded-full bg-[#FFF3F1] text-[#D4280C]">
            <TbAlertCircle className="w-[32px] h-[32px]" aria-hidden />
          </span>
          <div className="flex flex-col items-center gap-[8px] text-center max-w-[400px]">
            <h3 className="text-[18px] font-semibold text-[#000000E0]">
              Couldn’t load collections
            </h3>
            <p className="text-[14px] font-normal text-[#00000099]">
              Something went wrong. Please try again.
            </p>
          </div>
          <Button onClick={retry} className="px-[24px] py-[8px] min-w-[120px] flex items-center justify-center gap-[8px]">
            <TbRefresh className="w-[18px] h-[18px]" aria-hidden />
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    collections.length > 0 ? (
      <div className={containerClassName}>
        <div className='grid md:gap-[24px] gap-[20px] lg:grid-cols-2'>
          {sortedCollections.map((collection, index) => {
            const visibleIndex = visibleCollectionIds.indexOf(collection.id);
            const isVisible = visibleIndex !== -1;
            const shouldSpan = shouldSpanByCollectionId[collection.id] === true;

            return (
              <div key={collection.id} className={cx(shouldSpan && 'lg:col-span-2', !isVisible && 'hidden')} style={{
                minWidth: 0
              }}>
                <CollectionSection
                  collection={collection}
                  index={index}
                  selectedCollection={selectedCollection}
                  setSelectedCollection={setSelectedCollection}
                  isStoreBased={isStoreBased}
                  storeId={storeId}
                  headingClassName={headingClassName}
                  subHeadingClassName={subHeadingClassName}
                  onCollectionEmptyStateChange={handleCollectionEmptyStateChange}
                />
              </div>
            )
          })}
        </div>
      </div >
    ) : null)
};

export default Collections;
