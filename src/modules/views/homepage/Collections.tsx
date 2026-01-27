import { useCollections } from '@/modules/lib/utility/hooks/use-collections';
import CollectionSection from './CollectionSection';

const Collections = ({ storeId }: { storeId: string }) => {
  const { collections, loading: loadingCollections } = useCollections({
    storeId,
    type: null,
  });

  if (loadingCollections) return <p>Loading collections...</p>;

  return (
    <div className="px-24 sm:px-40 md:px-60 l:px-100 xl:px-200 flex flex-col gap-20">
      {collections.map((collection) => (
        <CollectionSection key={collection.id} collection={collection} />
      ))}
    </div>
  );
};

export default Collections;
