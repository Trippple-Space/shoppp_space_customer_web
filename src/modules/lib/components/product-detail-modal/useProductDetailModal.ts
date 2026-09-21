import { useEffect, useMemo, useRef, useState } from 'react';
import { Product, ProductVariant } from '../../utility/types/product.interface';
import { useCart } from '../../utility/hooks/use-cart';
import useTransformProduct, {
  buildFiltersFromVariant,
  getVariantValue,
  requiredKeysForVariant,
} from '../../utility/hooks/use-transform-product';
import colorNames from '@/modules/lib/utility/json-data/colors.json';
import {
  buildUserConfigurations,
  isEmptyValue,
  isCustomerInputForField,
  hasPendingConfigurationImageUploads,
} from './productConfigurationsHelper';
import { guestSession } from '../../utility/guest-session';
import { CartItem } from '../../utility/types/cart.interface';
import { buildVariantMediaPreviewItems } from '../../utility/product-media';
import { getVariantDisplayPrices } from '../../utility/visible-discount';
import {
  isFullProductSizeChart,
  shouldShowProductSizeChart,
} from '@/modules/views/product-details/utils/fit-size-chart';
import { fitOracleService } from '@/modules/lib/utility/services/fit-oracle.service';
import type { ProductSizeChartResponse } from '@/modules/views/product-details/types/product-size-chart';

export interface ProductDetailModalProp {
  openSingleProductModal: boolean;
  handleCloseProductModal: () => void;
  variant?: ProductVariant;
  product?: Product;
  position: string;
  variantSelectedImage?: string;
  modalZIndex?: number;
}

export const useProductDetailModal = ({
  product,
  variant,
  handleCloseProductModal,
  openSingleProductModal,
  position,
  variantSelectedImage,
  modalZIndex = 10,
}: ProductDetailModalProp) => {
  const {
    addToCart,
    cart,
    increment,
    decrement,
    removeFromCart,
    isAuthenticated,
    isLoginModal,
  } = useCart();

  const { groupedData, availableColors, productImages, allProperties } = product
    ? useTransformProduct(product)
    : {
      groupedData: {},
      availableColors: [],
      productImages: [],
      allProperties: {},
    };

  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [forcedVariantId, setForcedVariantId] = useState<string | undefined>();

  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    variant?.media?.[0]?.url || product?.variants[0]?.media?.[0]?.url
  );
  const [imageSource, setImageSource] = useState<
    'default' | 'variant' | 'preview'
  >('default');
  const [selectedMediaType, setSelectedMediaType] = useState<string | undefined>(
    variant?.media?.[0]?.type || product?.variants[0]?.media?.[0]?.type
  );

  const [configurationValues, setConfigurationValues] = useState<
    Record<string, any>
  >({});

  const [isHover, setIsHover] = useState(false);
  const [isEditingConfiguration, setIsEditingConfiguration] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isRemovingFromCart, setIsRemovingFromCart] = useState(false);
  const [guestCartVersion, setGuestCartVersion] = useState(0);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [fetchedSizeChart, setFetchedSizeChart] =
    useState<ProductSizeChartResponse | null>(null);

  const embeddedSizeChart = isFullProductSizeChart(product?.fitSizeChart)
    ? product.fitSizeChart
    : null;
  const resolvedSizeChart = embeddedSizeChart ?? fetchedSizeChart;
  const showSizeChartLink = shouldShowProductSizeChart(
    resolvedSizeChart ?? product?.fitSizeChart,
  );

  useEffect(() => {
    if (!openSingleProductModal || !product?.id || embeddedSizeChart) {
      return;
    }

    let cancelled = false;
    fitOracleService
      .getSizeChart(product.id)
      .then((chart) => {
        if (!cancelled) setFetchedSizeChart(chart);
      })
      .catch(() => {
        if (!cancelled) setFetchedSizeChart(null);
      });

    return () => {
      cancelled = true;
    };
  }, [openSingleProductModal, product?.id, embeddedSizeChart]);

  useEffect(() => {
    if (!openSingleProductModal) {
      setFetchedSizeChart(null);
      setSizeChartOpen(false);
    }
  }, [openSingleProductModal]);

  const imgRef = useRef<HTMLImageElement>(null);
  const didInitFromVariantRef = useRef(false);
  const cartActionLockRef = useRef(false);

  const filteredVariants = useMemo(() => {
    if (!product?.variants) return [];

    return product?.variants.filter((v) =>
      Object.entries(activeFilters).every(
        ([key, value]) => getVariantValue(v, key) === value
      )
    );
  }, [activeFilters, product?.variants]);

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

  const selectedVariant = useMemo(() => {
    if (isSelectionComplete) {
      return filteredVariants[0];
    }

    if (forcedVariantId && product?.variants?.length) {
      return product.variants.find((v) => v.id === forcedVariantId);
    }

    return undefined;
  }, [
    isSelectionComplete,
    filteredVariants,
    forcedVariantId,
    product?.variants,
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
    if (!openSingleProductModal) return [];
    if (Object.keys(activeFilters).length > 0) return [];
    if (!product?.variants?.length) return [];

    const firstVariant = product.variants[0];
    return requiredKeysForVariant(firstVariant);
  }, [openSingleProductModal, activeFilters, product?.variants]);

  /* const hasAnySelectableOptions = useMemo(() => {
    if (!product?.variants?.length) return false;

    return product.variants.some((v) => {
      if (v.size) return true;

      return Object.values(v.properties || {}).some(
        (val) => val !== null && val !== undefined && String(val).trim() !== ''
      );
    });
  }, [product?.variants]); */

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
    if (!isSelectionComplete && imageSource === 'variant') {
      setSelectedImage(
        variant?.media?.[0]?.url || product?.variants[0]?.media?.[0]?.url
      );
      setImageSource('default');
    }
  }, [isSelectionComplete, imageSource, variant?.media, product?.variants]);

  useEffect(() => {
    if (!selectedVariant?.media?.[0]?.url) return;
    const isCurrentMediaInVariant = selectedVariant.media?.some(
      (m: { url?: string }) => m.url === selectedImage
    );
    if (isCurrentMediaInVariant) return;
    setSelectedImage(selectedVariant.media[0].url);
    setImageSource('variant');
    setSelectedMediaType(selectedVariant.media[0]?.type);
  }, [selectedVariant, imageSource, selectedImage]);

  useEffect(() => {
    if (!openSingleProductModal) return;

    const body = document.body;
    const scrollY = window.scrollY;

    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      height: body.style.height,
      overflow: body.style.overflow,
    };

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.height = 'auto';
    body.style.overflow = 'visible';

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.width = previous.width;
      body.style.height = previous.height;
      body.style.overflow = previous.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [openSingleProductModal]);

  useEffect(() => {
    if (openSingleProductModal) return;
    cartActionLockRef.current = false;
    setIsAddingToCart(false);
    setIsRemovingFromCart(false);
  }, [openSingleProductModal]);

  useEffect(() => {
    if (!openSingleProductModal) {
      didInitFromVariantRef.current = false;
      return;
    }

    if (didInitFromVariantRef.current) return;

    didInitFromVariantRef.current = true;

    if (variant) {
      const filters = buildFiltersFromVariant(variant);
      setActiveFilters(filters);

      const firstMedia = variant.media?.[0]?.url;
      if (firstMedia) {
        setSelectedImage(firstMedia);
        setImageSource('variant');
      }
    } else if (product?.variants?.length) {
      const first = product.variants[0];
      const filters = buildFiltersFromVariant(first);

      setForcedVariantId(first.id);
      setActiveFilters(filters);
      setSelectedImage(first.media?.[0]?.url);
      setImageSource('variant');
    }
  }, [openSingleProductModal]);

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

  const uniqueVariantsFromProductImages = useMemo(() => {
    if (variantSelectedImage) {
      return variant ? [variant] : [];
    }

    if (!product?.variants?.length) return [];

    // build list of candidate keys that can define uniqueness
    // prefer color first, then others, then size
    const candidateKeys = [
      ...(allPropertiesWithSize.color?.length ? ['color'] : []),
      ...Object.keys(allPropertiesWithSize).filter(
        (k) => k !== 'color' && k !== 'size'
      ),
      ...(allPropertiesWithSize.size?.length ? ['size'] : []),
    ];

    // pick the first key that actually varies across variants
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
  }, [variantSelectedImage, variant, product?.variants, allPropertiesWithSize]);

  const variantPreviewItems = useMemo(
    () => buildVariantMediaPreviewItems(uniqueVariantsFromProductImages),
    [uniqueVariantsFromProductImages]
  );
  const carouselPreviewItems = useMemo(() => {
    const seen = new Set<string>();
    return uniqueVariantsFromProductImages.flatMap((variant) =>
      (variant?.media ?? [])
        .filter((media) => {
          const key = String(media?.url ?? '').trim();
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .map((media) => ({ variant, media }))
    );
  }, [uniqueVariantsFromProductImages]);

  const variantDisplayPrices = getVariantDisplayPrices({
    variant: selectedVariant,
    product,
  });
  const descriptionLength = product?.longDescription?.split(' ')?.length || 0;
  const maxDisplayDescLength = 20;

  const colorMap = Object.fromEntries(
    colorNames.map((c) => [c.name.replaceAll(' ', '').toLowerCase(), c.hex])
  );

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
    setForcedVariantId(undefined);
    setActiveFilters({});
    setSelectedImage(product?.variants[0]?.media?.[0]?.url);
    setImageSource('default');
  };

  const handlePreviousImage = () => {
    if (!carouselPreviewItems?.length) return;

    let currentIndex = carouselPreviewItems.findIndex(
      (item) => item.media?.url === selectedImage
    );
    if (currentIndex === -1 && selectedVariant) {
      currentIndex = carouselPreviewItems.findIndex(
        (item) => item.variant?.id === selectedVariant?.id
      );
    }

    const prevIndex =
      currentIndex >= 0 && currentIndex > 0
        ? currentIndex - 1
        : carouselPreviewItems.length - 1;

    const prevPreviewItem = carouselPreviewItems[prevIndex];

    if (!prevPreviewItem) return;

    setForcedVariantId(prevPreviewItem.variant.id);
    setActiveFilters(buildFiltersFromVariant(prevPreviewItem.variant));
    setSelectedImage(prevPreviewItem.media?.url);
    setSelectedMediaType(prevPreviewItem.media?.type);
    setImageSource('variant');
  };

  const handleNextImage = () => {
    if (!carouselPreviewItems?.length) return;

    let currentIndex = carouselPreviewItems.findIndex(
      (item) => item.media?.url === selectedImage
    );
    if (currentIndex === -1 && selectedVariant) {
      currentIndex = carouselPreviewItems.findIndex(
        (item) => item.variant?.id === selectedVariant?.id
      );
    }

    const nextIndex =
      currentIndex >= 0
        ? (currentIndex + 1) % carouselPreviewItems.length
        : 0;

    const nextPreviewItem = carouselPreviewItems[nextIndex];

    if (!nextPreviewItem) return;

    setForcedVariantId(nextPreviewItem.variant.id);
    setActiveFilters(buildFiltersFromVariant(nextPreviewItem.variant));
    setSelectedImage(nextPreviewItem.media?.url);
    setSelectedMediaType(nextPreviewItem.media?.type);
    setImageSource('variant');
  };

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

  const userConfigurations = buildUserConfigurations(
    configurationValues,
    configurationRecords
  );

  const hasPendingImageUploads = hasPendingConfigurationImageUploads(
    configurationValues
  );

  const handleSelectPreview = (vari: ProductVariant, mediaItem: any) => {
    const isSameVariant = selectedVariant?.id === vari.id;
    const isSameImage = selectedImage === mediaItem.url;

    if (isSameVariant && isSameImage) {
      return;
    }

    setForcedVariantId(vari.id);
    setActiveFilters(buildFiltersFromVariant(vari));
    setSelectedImage(mediaItem.url);
    setImageSource('preview');
    setSelectedMediaType(mediaItem?.type);
  };

  const handleAddToCart = async () => {
    if (cartActionLockRef.current || isAddingToCart || isRemovingFromCart) return;
    if (!selectedVariant || selectedVariant.status === 'OUT_OF_STOCK') return;
    if (!localStorage.getItem('seenMiniCart')) {
      window.dispatchEvent(new Event('showMiniCartOnboarding'));
      localStorage.setItem('seenMiniCart', 'true');
    }
    const configs = buildUserConfigurations(
      configurationValues,
      configurationRecords
    );
    cartActionLockRef.current = true;
    setIsAddingToCart(true);
    try {
      await addToCart(
        selectedVariant.id ?? '0',
        selectedVariant.minPurchaseQuantity || 1,
        configs,
        {
          ...selectedVariant,
          product: selectedVariant.product ?? product,
        }
      );
    } finally {
      cartActionLockRef.current = false;
      setIsAddingToCart(false);
    }
  };

  const handleDecrement = async (
    cartItem: CartItem,
    userConfigurations?: any
  ) => {
    if (cartActionLockRef.current || isAddingToCart || isRemovingFromCart) return;
    if (cartItem.quantity <= cartItem.variant.minPurchaseQuantity) {
      cartActionLockRef.current = true;
      setIsRemovingFromCart(true);
      try {
        await removeFromCart(cartItem.id);
      } finally {
        cartActionLockRef.current = false;
        setIsRemovingFromCart(false);
      }
      return;
    }
    decrement(cartItem, userConfigurations);
  };

  const handleIncrement = (
    cartItem: CartItem,
    userConfigurations?: any
  ) => {
    if (cartActionLockRef.current || isAddingToCart || isRemovingFromCart) return;
    increment(cartItem, userConfigurations);
  };

  return {
    groupedData,
    availableColors,
    productImages,
    isLoginModal,
    resetToDefault,
    product,
    variant,
    handleCloseProductModal,
    openSingleProductModal,
    position,
    variantSelectedImage,
    modalZIndex,
    addToCart,
    increment: handleIncrement,
    decrement: handleDecrement,
    isAddingToCart,
    isRemovingFromCart,
    activeFilters,
    selectedImage,
    selectedMediaType,
    configurationValues,
    isHover,
    setIsHover,
    isEditingConfiguration,
    setIsEditingConfiguration,
    sizeChartOpen,
    setSizeChartOpen,
    resolvedSizeChart,
    showSizeChartLink,
    imgRef,
    allPropertiesWithSize,
    selectedVariant,
    missingRequiredOptions,
    initialMissingOptions,
    selectedVariantItemInCart,
    uniqueVariantsFromProductImages,
    variantPreviewItems,
    carouselPreviewItems,
    variantDisplayPrices,
    descriptionLength,
    maxDisplayDescLength,
    colorMap,
    isOptionCompatible,
    toggleFilter,
    handlePreviousImage,
    handleNextImage,
    configurationRecords,
    handleConfigChange,
    areRequiredCustomerFieldsFilled,
    userConfigurations,
    hasPendingImageUploads,
    handleSelectPreview,
    handleAddToCart,
  };
};
