import VariantModal from '@/modules/lib/components/variant-modal/VariantModal';
import { RecentlyViewed } from '@/modules/lib/utility/types/product.interface';
import { SavedVariant } from '@/modules/lib/utility/types/SavedVariant.interface';

interface RecentlyViewedSectionProps {
  recentlyViewedVariants: RecentlyViewed[];
  saveVariant: (variantId: string) => void;
  removeSavedVariant: (variantId: string) => void;
  savedVariants: SavedVariant[] | undefined;
}

const RecentlyViewedSection = ({
  recentlyViewedVariants,
  saveVariant,
  removeSavedVariant,
  savedVariants,
}: RecentlyViewedSectionProps) => {
  if (recentlyViewedVariants?.length <= 0) return null;

  return (
    <div className="flex flex-col gap-12 pb-15 pt-20">
      <div className="flex a-items-center j-content-between">
        <p className="text-16  weight-600">
          Customers who viewed this also viewed
        </p>
        <p className="color-#1677FF cursor-pointer border-b hidden l:block">
          {' '}
          See all
        </p>
      </div>
      <div className="flex gap-20 a-items-start overflow-auto w-full h-fit no-scrollbar">
        {recentlyViewedVariants?.map((variant, i) => (
          <div className="" key={i}>
            <VariantModal
              variant={variant}
              saveVariant={saveVariant}
              removeSavedVariant={removeSavedVariant}
              savedVariants={savedVariants}
              key={i}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewedSection;
