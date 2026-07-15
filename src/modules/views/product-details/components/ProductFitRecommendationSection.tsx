'use client';

import CustomerPersonalization from '@/modules/lib/components/personalization-modals/CustomerPersonalization';
import useUserStore from '@/modules/lib/utility/store/user.store';
import { usePersonalizationStore } from '@/modules/lib/utility/store/personalization.store';
import { ProductVariant } from '@/modules/lib/utility/types/product.interface';
import { useMemo, useState } from 'react';
import { getProductFitRecommendation } from '../utils/get-product-fit-recommendation';
import ProductFitRecommendation from '@/modules/views/product-details/components/ProductFitRecommendation';
import ProductFitRecommendationResult from '@/modules/views/product-details/components/ProductFitRecommendationResult';

interface ProductFitRecommendationSectionProps {
  selectedVariant?: ProductVariant;
}

const ProductFitRecommendationSection = ({
  selectedVariant,
}: ProductFitRecommendationSectionProps) => {
  const [personalizationOpen, setPersonalizationOpen] = useState(false);
  const isPersonalizationSetup = usePersonalizationStore(
    (state) => state.isPersonalizationSetup,
  );
  const dimensions = usePersonalizationStore((state) => state.dimensions);
  const unit = usePersonalizationStore((state) => state.unit);
  const user = useUserStore((state) => state.user);

  const userName = useMemo(() => {
    const firstName = user?.profile?.firstName?.trim();
    const lastName = user?.profile?.lastName?.trim();

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }

    if (firstName) {
      return firstName;
    }

    return '';
  }, [user]);

  const recommendation = useMemo(
    () =>
      getProductFitRecommendation(
        dimensions,
        unit,
        selectedVariant?.id,
        userName,
        selectedVariant?.size,
      ),
    [dimensions, unit, selectedVariant?.id, selectedVariant?.size, userName],
  );

  return (
    <>
      {!isPersonalizationSetup ? (
        <ProductFitRecommendation onSetup={() => setPersonalizationOpen(true)} />
      ) : (
        <ProductFitRecommendationResult
          recommendation={recommendation}
          onUpdateMeasurements={() => setPersonalizationOpen(true)}
        />
      )}

      <CustomerPersonalization
        isOpen={personalizationOpen}
        onClose={() => setPersonalizationOpen(false)}
      />
    </>
  );
};

export default ProductFitRecommendationSection;
