import { useCollections } from '@/modules/lib/utility/hooks/use-collections';
import CollectionSection from './CollectionSection';
import { useEffect, useRef, useState } from 'react';
import { ICollection } from '@/modules/lib/utility/types/collection.interface';
import { TbAlertCircle, TbRefresh } from 'react-icons/tb';

const Collections = ({
  storeId,
  initialCollections = [],
  setHasCollections,
  onCollectionsLoaded,
  setCollectionsLoaded,
}: {
  storeId: string;
  initialCollections?: ICollection[];
  setHasCollections?: (hasCollections: boolean) => void;
  onCollectionsLoaded?: () => void;
  setCollectionsLoaded?: (collectionsLoaded: boolean) => void;
}) => {
  const { collections, loading: loadingCollections, error, retry } = useCollections({
    storeId,
    type: null,
    initialCollections,
  });

  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const onCollectionsLoadedRef = useRef(onCollectionsLoaded);
  onCollectionsLoadedRef.current = onCollectionsLoaded;

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

  if (loadingCollections) return null;

  if (error && collections.length === 0) {
    return (
      <div className="md:mt-32 mt-24 w-100p flex flex-col">
        <div
          className="flex flex-col items-center justify-center gap-20 py-48 px-24 rounded-16 border border-[#E8E8E8] bg-[#FAFAFA]"
          role="alert"
          aria-live="polite"
        >
          <span className="flex items-center justify-center w-56 h-56 rounded-full bg-[#FFF3F1] text-[#D4280C]">
            <TbAlertCircle className="w-32 h-32" aria-hidden />
          </span>
          <div className="flex flex-col items-center gap-8 text-center max-w-400">
            <h3 className="text-18 weight-600 color-#000000E0">
              Couldn’t load collections
            </h3>
            <p className="text-14 weight-400 color-#00000099">
              Something went wrong. Please try again.
            </p>
          </div>
          <button
            type="button"
            onClick={retry}
            className="flex items-center justify-center gap-8 h-44 min-w-120 px-24 rounded-999 bg-#1677FF color-white text-14 weight-500 hover:opacity-90 transition-opacity"
          >
            <TbRefresh className="w-18 h-18" aria-hidden />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="md:mt-32 mt-24 w-100p flex flex-col">
      <div className='grid md:gap-24 gap-20 lg:grid-2-cols-1fr' style={{

      }}>
        {collections.map((collection, index) => {
          const isLast = index === collections.length - 1;
          const isOdd = collections.length % 2 === 1;

          return (
            <div key={collection.id} className={isLast && isOdd ? 'lg:grid-col-span-2' : ''} style={{
              minWidth: 0
            }}>
              <CollectionSection collection={collection} index={index} selectedCollection={selectedCollection} setSelectedCollection={setSelectedCollection} />
            </div>
          )
        })}
      </div>
    </div >
  );
};

export default Collections;
