import { useCollections } from '@/modules/lib/utility/hooks/use-collections';
import CollectionSection from './CollectionSection';
import { useEffect, useState } from 'react';

const Collections = ({ storeId, setHasCollections }: { storeId: string, setHasCollections?: (hasCollections: boolean) => void }) => {
  const { collections, loading: loadingCollections } = useCollections({
    storeId,
    type: null,
  });

  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  useEffect(() => {
    if (collections.length > 0) {
      setHasCollections?.(true)
    }
  }, [collections])

  if (loadingCollections) return null;

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
