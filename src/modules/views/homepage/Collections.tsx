import { useCollections } from '@/modules/lib/utility/hooks/use-collections';
import CollectionSection from './CollectionSection';

const Collections = ({ storeId }: { storeId: string }) => {
  const { collections, loading: loadingCollections } = useCollections({
    storeId,
    type: null,
  });

  if (loadingCollections) return null;

  return (
    <div className="md:mt-32 mt-24 w-100p flex flex-col md:gap-24 gap-20">
      {collections.map((collection, index) => (
        <CollectionSection key={collection.id} collection={collection} index={index} />
      ))}
    </div>
  );
};

export default Collections;
