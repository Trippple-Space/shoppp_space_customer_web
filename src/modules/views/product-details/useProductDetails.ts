import { useEffect, useState, useMemo, useRef, RefObject } from 'react';
import { useAuthGuard } from '@/modules/lib/utility/hooks/use-auth-guard';
import { useCart } from '@/modules/lib/utility/hooks/use-cart';
import { useSavedVariant } from '@/modules/lib/utility/hooks/use-saved-variants';
import useTransformProduct, {
  buildFiltersFromVariant,
  getVariantValue,
  requiredKeysForVariant,
} from '@/modules/lib/utility/hooks/use-transform-product';
import { productService } from '@/modules/lib/utility/services/product.service';
import {
  Product,
  ProductVariant,
  RecentlyViewed,
} from '@/modules/lib/utility/types/product.interface';
import { SavedVariant } from '@/modules/lib/utility/types/SavedVariant.interface';
import {
  checkMediaType,
  onGoingOrderStatusQuery,
} from '@/modules/lib/utility/utility';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useGetRatingStats from '@/modules/lib/utility/hooks/use-get-rating-stats';
import useGetProductRating from '@/modules/lib/utility/hooks/use-get-review';
import colorNames from '@/modules/lib/utility/json-data/colors.json';
import { useOrders } from '@/modules/lib/utility/hooks/use-orders';
import {
  hasPendingConfigurationImageUploads,
  isCustomerInputForField,
  isEmptyValue,
} from '@/modules/lib/components/product-detail-modal/productConfigurationsHelper';
import { guestSession } from '@/modules/lib/utility/guest-session';
import { CartItem } from '@/modules/lib/utility/types/cart.interface';
import { getVariantDisplayPrices } from '@/modules/lib/utility/visible-discount';
import {
  buildVariantMediaPreviewItems,
} from '@/modules/lib/utility/product-media';

export const useProductDetails = (product: Product) => {
  const [recentlyViewedVariants, setRecentlyViewedVariants] = useState<
    RecentlyViewed[]
  >([]);

  const [showShareModal, setShowShareModal] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [isOpen, setIsOpen] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [forcedVariantId, setForcedVariantId] = useState<string | undefined>();
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    product.variants[0]?.media?.[0]?.url
  );

  const [imageSource, setImageSource] = useState<
    'default' | 'variant' | 'preview'
  >('default');

  const [savedToggle, setSavedToggle] = useState(false);
  const [guestCartVersion, setGuestCartVersion] = useState(0);

  const [configurationValues, setConfigurationValues] = useState<
    Record<string, any>
  >({});

  const [isEditingConfiguration, setIsEditingConfiguration] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null) as RefObject<HTMLImageElement>;
  const rateProductDeepLinkHandled = useRef(false);

  const variantIds = useMemo(
    () => product?.variants.map((v) => v.id),
    [product?.variants]
  );

  const filteredVariants = useMemo(() => {
    if (!product?.variants) return [];

    return product?.variants.filter((v) =>
      Object.entries(activeFilters).every(
        ([key, value]) => getVariantValue(v, key) === value
      )
    );
  }, [activeFilters, product?.variants]);

  const { groupedData, availableColors, allProperties } =
    useTransformProduct(product);

  const allPropertiesWithSize = useMemo(() => {
    const props: Record<string, string[]> = { ...allProperties };

    const sizes = Array.from(
      new Set(product?.variants?.map((v) => v.size).filter(Boolean))
    ) as string[];

    if (sizes.length) {
      props.size = sizes;
    }

    return props;
  }, [allProperties, product?.variants]);

  const isSelectionComplete = useMemo(() => {
    if (filteredVariants.length !== 1) return false;

    const candidate = filteredVariants[0];
    const requiredKeys = requiredKeysForVariant(candidate);

    return requiredKeys.every((key) => activeFilters[key]);
  }, [filteredVariants, activeFilters]);

  const hasAnySelectableOptions = useMemo(() => {
    if (!product?.variants?.length) return false;

    return product.variants.some((v) => {
      if (v.size) return true;

      return Object.values(v.properties || {}).some(
        (val) => val !== null && val !== undefined && String(val).trim() !== ''
      );
    });
  }, [product?.variants]);

  const selectedVariant = useMemo(() => {
    if (isSelectionComplete) {
      return filteredVariants[0];
    }

    if (forcedVariantId && product?.variants?.length) {
      return product.variants.find((v) => v.id === forcedVariantId);
    }

    if (!hasAnySelectableOptions && product?.variants?.length) {
      return product.variants[0];
    }

    return undefined;
  }, [
    isSelectionComplete,
    filteredVariants,
    forcedVariantId,
    product?.variants,
    hasAnySelectableOptions,
  ]);

  const missingRequiredOptions = useMemo(() => {
    if (!product?.variants?.length) return [];

    let candidate: ProductVariant | undefined;

    if (filteredVariants.length === 1) {
      candidate = filteredVariants[0];
    } else {
      candidate = product.variants.find((v) =>
        Object.entries(activeFilters).every(
          ([key, value]) => getVariantValue(v, key) === value
        )
      );
    }

    if (!candidate) {
      candidate = product.variants[0];
    }

    const requiredKeys = requiredKeysForVariant(candidate);

    return requiredKeys.filter((key) => !activeFilters[key]);
  }, [filteredVariants, activeFilters, product?.variants]);

  const initialMissingOptions = useMemo(() => {
    if (Object.keys(activeFilters).length > 0) return [];
    if (!product?.variants?.length) return [];

    const firstVariant = product.variants[0];
    return requiredKeysForVariant(firstVariant);
  }, [activeFilters, product?.variants]);

  const uniqueVariantsFromProductImages = useMemo(() => {
    if (!product?.variants?.length) return [];

    const candidateKeys = [
      ...(allPropertiesWithSize?.color?.length ? ['color'] : []),
      ...Object.keys(allPropertiesWithSize).filter(
        (k) => k !== 'color' && k !== 'size'
      ),
      ...(allPropertiesWithSize.size?.length ? ['size'] : []),
    ];

    const uniqueKey = candidateKeys.find((key) => {
      const values = new Set(
        product.variants
          .map((v) => String(getVariantValue(v, key) ?? '').trim())
          .filter(Boolean)
      );

      return values.size > 1;
    });

    if (!uniqueKey) {
      return product.variants;
    }

    const map = new Map<string, ProductVariant>();
    const rest: ProductVariant[] = [];

    for (const v of product.variants) {
      const raw = getVariantValue(v, uniqueKey);
      const value = String(raw ?? '')
        .trim()
        .toLowerCase();

      if (!value) {
        rest.push(v);
        continue;
      }

      if (!map.has(value)) {
        map.set(value, v);
      }
    }

    return Array.from(map.values()).concat(rest);
  }, [product?.variants, allPropertiesWithSize]);

  const variantPreviewItems = useMemo(
    () => buildVariantMediaPreviewItems(uniqueVariantsFromProductImages),
    [uniqueVariantsFromProductImages]
  );

  const allImages = variantPreviewItems.map((item) => item.media.url);
  const uniqueImages = Array.from(new Set(allImages.filter(Boolean)));

  const catalogueImages =
    (product?.productCatalogues ?? [])
      .map((catalogue) => catalogue.mediaUrl)
      .filter(Boolean) ?? [];

  const allLightboxImages = [...uniqueImages, ...catalogueImages];
  const lightboxImages = allLightboxImages.length
    ? Array.from(new Set(allLightboxImages))
    : [''];
  const lightboxTotal = lightboxImages.length;

  const { saveVariant, savedVariants, removeSavedVariant } = useSavedVariant();

  const {
    addToCart,
    cart,
    increment,
    decrement,
    isLoginModal,
    isAuthenticated,
  } = useCart();

  const { checking: authChecking } = useAuthGuard();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const {
    reviews,
    loading: reviewsLoading,
    refresh: refreshReviews,
  } = useGetProductRating(variantIds);

  const {
    reviewStat,
    loading: statsLoading,
    refresh: refreshStats,
  } = useGetRatingStats(variantIds);

  const { orders } = useOrders({
    filters: { status: { In: `${onGoingOrderStatusQuery},DELIVERED` } },
  });

  const selectedVariantItemInCart = useMemo(() => {
    const existing = cart.cartItems.find(
      (item) => item.variant.id === selectedVariant?.id
    );
    if (existing || !selectedVariant) {
      return existing;
    }
    if (isAuthenticated) {
      return undefined;
    }

    const guestQty = guestSession.getCartQuantityForVariant(selectedVariant.id);
    if (guestQty <= 0) {
      return undefined;
    }

    return {
      id: `guest-${selectedVariant.id}`,
      productId: selectedVariant.product?.id ?? '',
      quantity: guestQty,
      variant: selectedVariant,
      totalPrice: selectedVariant.finalPrice * guestQty,
      discountedPrice: selectedVariant.discountedPrice * guestQty,
      userConfigurations:
        guestSession.getLatestUserConfigurations(selectedVariant.id) ?? {},
      createdAt: '',
      discountValue: 0,
      lastUpdated: '',
      meta: null,
    } as CartItem;
  }, [cart.cartItems, selectedVariant, isAuthenticated, guestCartVersion]);

  useEffect(() => {
    const handleGuestCartUpdate = () => setGuestCartVersion((value) => value + 1);
    window.addEventListener('guest-cart-updated', handleGuestCartUpdate);
    return () =>
      window.removeEventListener('guest-cart-updated', handleGuestCartUpdate);
  }, []);

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        const response: RecentlyViewed[] =
          await productService.getAllRecentlyViewedVariants();
        setRecentlyViewedVariants(response);
      }
    })();
  }, [isAuthenticated]);

  useEffect(() => {
    if (authChecking) return;
    if (rateProductDeepLinkHandled.current) return;
    if (searchParams.get('rateProduct') !== 'true') return;

    rateProductDeepLinkHandled.current = true;

    if (isAuthenticated) {
      setIsReviewModalOpen(true);
    } else {
      isLoginModal();
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete('rateProduct');
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [
    authChecking,
    searchParams,
    pathname,
    router,
    isAuthenticated,
    isLoginModal,
  ]);

  useEffect(() => {
    if (!showLightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowLightbox(false);
      if (e.key === 'ArrowLeft')
        setLightboxIndex((i) => (i - 1 + lightboxTotal) % lightboxTotal);
      if (e.key === 'ArrowRight')
        setLightboxIndex((i) => (i + 1) % lightboxTotal);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showLightbox, lightboxTotal]);

  useEffect(() => {
    if (showLightbox) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showLightbox]);

  useEffect(() => {
    if (!isSelectionComplete && imageSource === 'variant') {
      setSelectedImage(product.variants[0]?.media?.[0]?.url);
      setImageSource('default');
    }
  }, [isSelectionComplete, imageSource, product.variants[0]?.media]);

  useEffect(() => {
    if (!selectedVariant?.media?.[0]?.url) return;

    if (imageSource === 'preview') {
      const isCurrentMediaInVariant = selectedVariant.media?.some(
        (m: { url?: string }) => m.url === selectedImage
      );

      if (isCurrentMediaInVariant) return;
    }

    setSelectedImage(selectedVariant.media[0].url);
    setImageSource('variant');
  }, [selectedVariant, imageSource, selectedImage]);

  useEffect(() => {
    if (!selectedVariantItemInCart?.userConfigurations) return;

    const nextValues: Record<string, any> = {};

    Object.values(selectedVariantItemInCart.userConfigurations).forEach(
      (schema: any) => {
        if (!schema || typeof schema !== 'object') return;

        Object.entries(schema).forEach(([fieldName, value]) => {
          nextValues[fieldName] = value;
        });
      }
    );

    setConfigurationValues(nextValues);
  }, [selectedVariantItemInCart]);

  useEffect(() => {
    setIsEditingConfiguration(false);
  }, [selectedVariant?.id]);

  useEffect(() => {
    if (!hasAnySelectableOptions && product?.variants?.length) {
      const first = product.variants[0];

      setForcedVariantId(first.id);
      setActiveFilters({});
      setSelectedImage(first.media?.[0]?.url);
      setImageSource('variant');
      return;
    }
  }, []);

  const descriptionLength = product?.longDescription?.split(' ')?.length || 0;
  const maxDisplayDescLength = 144;

  const variantDisplayPrices = getVariantDisplayPrices({
    variant: selectedVariant ?? product.variants[0],
    product,
  });

  const isOutOfStock = selectedVariant?.status === 'OUT_OF_STOCK';

  const isOptionCompatible = (prop: string, value: string): boolean => {
    return (
      product?.variants?.some((v) => {
        if (getVariantValue(v, prop) !== value) return false;

        return Object.entries(activeFilters).every(([k, vValue]) => {
          if (k === prop) return true;
          return getVariantValue(v, k) === vValue;
        });
      }) ?? false
    );
  };

  const toggleFilter = (key: string, value: string) => {
    setForcedVariantId(undefined);
    setActiveFilters((prev) => {
      if (prev[key] === value) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }

      const next: Record<string, string> = { [key]: value };

      Object.entries(prev).forEach(([k, v]) => {
        if (k === key) return;

        const compatible = product?.variants?.some((variant) => {
          return (
            getVariantValue(variant, key) === value &&
            getVariantValue(variant, k) === v
          );
        });

        if (compatible) {
          next[k] = v;
        }
      });

      return next;
    });
  };

  const resetToDefault = () => {
    // When there are selectable options, reset to the base state (no forced variant).
    // When there are no selectable options at all, keep the first variant selected
    // so the user can never end up with an "empty" selection.
    if (hasAnySelectableOptions) {
      setForcedVariantId(undefined);
      setActiveFilters({});
      setSelectedImage(product.variants[0]?.media?.[0]?.url);
      setImageSource('default');
      return;
    }

    const first = product.variants[0];
    setForcedVariantId(first.id);
    setActiveFilters({});
    setSelectedImage(first.media?.[0]?.url);
    setImageSource('variant');
  };

  const colorMap = Object.fromEntries(
    colorNames.map((c) => [c.name.replaceAll(' ', '').toLowerCase(), c.hex])
  );

  const mediaType = checkMediaType(selectedImage ?? '') ?? 'image';

  const showLongDescElipsis = (desc: string) => {
    if (!showFullDescription) {
      return desc.split(' ').slice(0, maxDisplayDescLength).join(' ');
    }
    return desc;
  };

  const currentVariantId = selectedVariant?.id || product.variants[0]?.id;

  const isSaved = savedVariants?.some(
    (variant: SavedVariant) => variant.variantId === currentVariantId
  );

  const handleSave = () => {
    let variantToSave = selectedVariant;
    if (!variantToSave) {
      variantToSave = product.variants[0];
    }
    if (!variantToSave?.id) {
      return;
    }
    const variantId = variantToSave.id;

    if (savedVariants?.some((v) => v.variantId === variantId)) {
      removeSavedVariant(variantId);
    } else {
      saveVariant(variantId);
    }

    setSavedToggle((prev) => !prev);
  };

  const aggregatedReviewData = useMemo(() => {
    const allReviews = reviews.flatMap((r) => r.reviews);

    const validStats = reviewStat
      .map((r) => r.reviewStat)
      .filter(
        (s): s is { averageRating: number; totalReviews: number } =>
          typeof s?.averageRating === 'number' &&
          typeof s?.totalReviews === 'number'
      );

    const totalReviews = validStats.reduce((sum, s) => sum + s.totalReviews, 0);

    const weightedRatingSum = validStats.reduce(
      (sum, s) => sum + s.averageRating * s.totalReviews,
      0
    );

    const averageRating =
      totalReviews > 0 ? weightedRatingSum / totalReviews : 0;

    return {
      reviews: allReviews,
      reviewStat: {
        averageRating,
        totalReviews,
      },
    };
  }, [reviews, reviewStat]);

  const displayReviews = useMemo(() => {
    if (!selectedVariant) return aggregatedReviewData.reviews;

    return reviews.find((r) => r.id === selectedVariant.id)?.reviews ?? [];
  }, [selectedVariant, reviews, aggregatedReviewData]);

  const displayReviewStat = useMemo(() => {
    if (!selectedVariant) return aggregatedReviewData.reviewStat;

    return (
      reviewStat.find((r) => r.id === selectedVariant.id)?.reviewStat ?? {
        averageRating: 0,
        totalReviews: 0,
      }
    );
  }, [selectedVariant, reviewStat, aggregatedReviewData]);

  const configurationRecords = selectedVariant?.configurationRecords ?? [];

  const handleConfigChange = (key: string, value: any) => {
    setConfigurationValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getRequiredCustomerFields = useMemo(() => {
    if (!selectedVariant) return [];

    return (selectedVariant.configurationRecords ?? []).flatMap((record: any) =>
      (record.customerDataForm ?? []).filter(
        (f: any) => isCustomerInputForField(f) && f.valueFormat?.required
      )
    );
  }, [selectedVariant]);

  const areRequiredCustomerFieldsFilled = useMemo(() => {
    return getRequiredCustomerFields.every((field: any) => {
      const key = field.valueFormat.fieldName;
      const value = configurationValues[key];

      if (field.valueFormat.type === 'array') {
        if (!value || typeof value !== 'object') return false;
        return field.valueFormat.defaultValue.every(
          (k: string) => !isEmptyValue(value[k])
        );
      }

      if (field.valueFormat.type === 'arrayOfImages') {
        if (!value) return false;
        if (Array.isArray(value)) return value.length > 0;
        return false;
      }

      return !isEmptyValue(value);
    });
  }, [getRequiredCustomerFields, configurationValues]);

  const hasPendingImageUploads = hasPendingConfigurationImageUploads(
    configurationValues
  );

  const storeUrl = useMemo(() => {
    if (typeof window === "undefined") return `/${product.store?.slug}`;

    const host = window.location.hostname;
    const slug = product.store?.slug;

    if (host === "asoebi.africa") {
      return `https://${slug}.asoebi.africa`;
    }

    if (host === "staging.asoebi.africa") {
      return `https://staging.asoebi.africa/${slug}`;
    }

    return `/${slug}`;
  }, [product.store?.slug]);

  return {
    product,
    recentlyViewedVariants,
    showShareModal,
    setShowShareModal,
    showFullDescription,
    setShowFullDescription,
    showAllPhotos,
    setShowAllPhotos,
    isOpen,
    setIsOpen,
    isReviewModalOpen,
    setIsReviewModalOpen,
    showLightbox,
    setShowLightbox,
    lightboxIndex,
    setLightboxIndex,
    activeFilters,
    setActiveFilters,
    forcedVariantId,
    setForcedVariantId,
    selectedImage,
    setSelectedImage,
    imageSource,
    setImageSource,
    configurationValues,
    isEditingConfiguration,
    setIsEditingConfiguration,
    imgRef,
    allPropertiesWithSize,
    selectedVariant,
    missingRequiredOptions,
    initialMissingOptions,
    uniqueVariantsFromProductImages,
    variantPreviewItems,
    allImages,
    uniqueImages,
    lightboxImages,
    saveVariant,
    savedVariants,
    removeSavedVariant,
    addToCart,
    cart,
    increment,
    decrement,
    isLoginModal,
    isAuthenticated,
    reviews,
    reviewsLoading,
    refreshReviews,
    statsLoading,
    refreshStats,
    orders,
    selectedVariantItemInCart,
    descriptionLength,
    maxDisplayDescLength,
    variantDisplayPrices,
    isOutOfStock,
    isOptionCompatible,
    toggleFilter,
    resetToDefault,
    colorMap,
    mediaType,
    showLongDescElipsis,
    isSaved,
    handleSave,
    displayReviews,
    displayReviewStat,
    configurationRecords,
    handleConfigChange,
    areRequiredCustomerFieldsFilled,
    hasPendingImageUploads,
    storeUrl,
    buildFiltersFromVariant,
  };
};
