'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import CustomerPersonalization from '@/modules/lib/components/personalization-modals/CustomerPersonalization';
import { PersonalizationFlowStep } from '@/modules/lib/components/personalization-modals/types';
import useUserStore from '@/modules/lib/utility/store/user.store';
import {
  hydratePersonalizationFromApi,
  usePersonalizationStore,
} from '@/modules/lib/utility/store/personalization.store';
import { fitOracleService } from '@/modules/lib/utility/services/fit-oracle.service';
import {
  Product,
  ProductVariant,
} from '@/modules/lib/utility/types/product.interface';
import { ProductFitRecommendationData } from '../types/product-fit-recommendation';
import { shouldShowProductSizeChart } from '../utils/fit-size-chart';
import { resolveSelectedFitLabel, getFitSelectionSignature } from '../utils/resolve-selected-fit-label';
import ProductFitRecommendation from '@/modules/views/product-details/components/ProductFitRecommendation';
import ProductFitRecommendationResult from '@/modules/views/product-details/components/ProductFitRecommendationResult';
import ProductFitRecommendationLoading from '@/modules/views/product-details/components/ProductFitRecommendationLoading';
import ProductFitRecommendationError from '@/modules/views/product-details/components/ProductFitRecommendationError';

interface ProductFitRecommendationSectionProps {
  productId: string;
  productType?: string;
  selectedVariant?: ProductVariant;
  activeFilters?: Record<string, string>;
  fitSizeChart?: Product['fitSizeChart'];
}

const ProductFitRecommendationSection = ({
  productId,
  selectedVariant,
  activeFilters = {},
  fitSizeChart,
}: ProductFitRecommendationSectionProps) => {
  const [personalizationOpen, setPersonalizationOpen] = useState(false);
  const [personalizationStep, setPersonalizationStep] =
    useState<PersonalizationFlowStep>('intro');
  const [isSetupResolved, setIsSetupResolved] = useState(false);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [recommendation, setRecommendation] =
    useState<ProductFitRecommendationData | null>(null);

  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const user = useUserStore((state) => state.user);
  const isPersonalizationSetup = usePersonalizationStore(
    (state) => state.isPersonalizationSetup,
  );
  const shopPreference = usePersonalizationStore((state) => state.shopPreference);
  const bodyBuild = usePersonalizationStore((state) => state.bodyBuild);
  const dimensions = usePersonalizationStore((state) => state.dimensions);
  const unit = usePersonalizationStore((state) => state.unit);
  const getProfilePayload = usePersonalizationStore(
    (state) => state.getProfilePayload,
  );

  const hasSizeChart = shouldShowProductSizeChart(fitSizeChart);

  const fitSelectionSignature = useMemo(
    () => getFitSelectionSignature(activeFilters, selectedVariant),
    [activeFilters, selectedVariant],
  );

  const selectedFitLabel = useMemo(
    () => resolveSelectedFitLabel(activeFilters, selectedVariant),
    [fitSelectionSignature, activeFilters, selectedVariant],
  );

  const userName = useMemo(() => {
    const firstName = user?.profile?.firstName?.trim();
    const lastName = user?.profile?.lastName?.trim();

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }

    if (firstName) {
      return firstName;
    }

    return 'You';
  }, [user]);

  useEffect(() => {
    let cancelled = false;

    const resolveSetup = async () => {
      setIsSetupResolved(false);

      if (isAuthenticated) {
        try {
          await hydratePersonalizationFromApi();
        } catch {
          // Keep localStorage / guest state as offline fallback.
        }
      }

      if (!cancelled) {
        setIsSetupResolved(true);
      }
    };

    resolveSetup();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const fetchRecommendation = useCallback(async () => {
    if (
      !isSetupResolved ||
      !isPersonalizationSetup ||
      !productId ||
      !hasSizeChart
    ) {
      setRecommendation(null);
      setFetchError(false);
      setIsLoadingRecommendation(false);
      return;
    }

    setIsLoadingRecommendation(true);
    setFetchError(false);

    try {
      const response = await fitOracleService.getRecommendation(productId, {
        // Fit chart matching uses sizeLabel only — ignore non-fit props like color.
        sizeLabel: selectedFitLabel,
        profile: getProfilePayload(),
        userName,
      });

      if (!response || response.status === 'unavailable') {
        setRecommendation(null);
      } else {
        setRecommendation(response);
      }
    } catch {
      setRecommendation(null);
      setFetchError(true);
    } finally {
      setIsLoadingRecommendation(false);
    }
  }, [
    getProfilePayload,
    hasSizeChart,
    isPersonalizationSetup,
    isSetupResolved,
    productId,
    selectedFitLabel,
    userName,
  ]);

  useEffect(() => {
    if (!isSetupResolved) {
      return;
    }

    // Debounce profile edits (typing in Update measurement) so we don't
    // hit /recommendation on every keystroke. Size clicks are also fine
    // with a short pause before the loading state.
    const timer = window.setTimeout(() => {
      fetchRecommendation();
    }, 450);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    fetchRecommendation,
    isSetupResolved,
    isPersonalizationSetup,
    fitSelectionSignature,
    shopPreference,
    bodyBuild,
    dimensions,
    unit,
  ]);

  const openPersonalization = (step: PersonalizationFlowStep = 'intro') => {
    setPersonalizationStep(step);
    setPersonalizationOpen(true);
  };

  const personalizationModal = (
    <CustomerPersonalization
      isOpen={personalizationOpen}
      onClose={() => setPersonalizationOpen(false)}
      initialStep={personalizationStep}
    />
  );

  if (!hasSizeChart) {
    return null;
  }

  // Wait until we know setup status before showing setup CTA or results.
  if (!isSetupResolved) {
    return personalizationModal;
  }

  if (!isPersonalizationSetup) {
    return (
      <>
        <ProductFitRecommendation onSetup={() => openPersonalization('intro')} />
        {personalizationModal}
      </>
    );
  }

  if (isLoadingRecommendation) {
    return (
      <>
        <ProductFitRecommendationLoading />
        {personalizationModal}
      </>
    );
  }

  if (fetchError) {
    return (
      <>
        <ProductFitRecommendationError
          onRetry={fetchRecommendation}
          isRetrying={isLoadingRecommendation}
        />
        {personalizationModal}
      </>
    );
  }

  if (!recommendation) {
    return personalizationModal;
  }

  return (
    <>
      <ProductFitRecommendationResult
        recommendation={recommendation}
        onUpdateMeasurements={() => openPersonalization('dimensions')}
      />
      {personalizationModal}
    </>
  );
};

export default ProductFitRecommendationSection;
