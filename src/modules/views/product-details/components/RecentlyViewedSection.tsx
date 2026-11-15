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
    <div className="flex flex-col gap-[12px] pb-[15px] pt-[20px]">
      <div className="flex items-center justify-between">
        <p className="text-[16px]  font-semibold">
          Customers who viewed this also viewed
        </p>
        <p className="text-[#1677FF] cursor-pointer border-b hidden lg:block">
          {' '}
          See all
        </p>
      </div>
      <div className="flex gap-[20px] items-start overflow-auto w-full h-fit no-scrollbar">
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
