import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ConfigurationRecord,
  Product,
  ProductVariant,
} from '../../utility/types/product.interface';
import {
  formatNumberAsPrice,
  onGoingOrderStatusQuery,
} from '../../utility/utility';
import { useCart } from '../../utility/hooks/use-cart';
import { SavedVariant } from '../../utility/types/SavedVariant.interface';
import { IFetchedReview } from '../../utility/types/review.interface';
import useTransformProduct from '../../utility/hooks/use-transform-product';
import {
  useRecentlyViewedActions,
} from '../../utility/hooks/use-recently-viewed';
import { useProductTileOrders } from '../../utility/hooks/use-product-tile-orders';
import {
  buildUserConfigurations,
  isCustomerInputForField,
} from '../product-detail-modal/productConfigurationsHelper';
import { guestSession } from '../../utility/guest-session';
import { CartItem } from '../../utility/types/cart.interface';
import { useSavedVariant } from '../../utility/hooks/use-saved-variants';
import {
  extractVisibleDiscountMeta,
  getStrikethroughAmounts,
  getVariantDisplayPrices,
} from '../../utility/visible-discount';
import {
  buildVariantMediaPreviewItems,
  getUniqueGalleryVariants,
} from '../../utility/product-media';
import { TILE_AUTO_ROTATE_MS } from './product-tile-auto-rotate';
import {
  useRegisterProductTileGalleryApi,
  ProductTileGalleryApi,
  useProductTileGallery,
} from './ProductTileGalleryContext';
import {
  PRODUCT_TILE_PILL_STYLES,
  resolveConfigPillKind,
} from './product-tile-constants';

export interface IProductTile {
  product: Product;
  saveVariant?: (variantId: string) => void;
  removeSavedVariant?: (variantId: string) => void;
  savedVariants?: SavedVariant[];
  allReviews?: IFetchedReview[];
  id: string;
  isOpen?: string | null;
  setIsOpen?: React.Dispatch<React.SetStateAction<string | null>>;
  index?: number;
  selectedCategory?: any;
  setSelectedCategory?: any;
  addToCartVariant?: 'icon' | 'text';
  isStoreBased?: boolean;
}

export const useProductTile = ({
  product,
  savedVariants,
  saveVariant,
  removeSavedVariant,
  allReviews,
  isOpen,
  setIsOpen,
  index,
  selectedCategory,
  setSelectedCategory,
  addToCartVariant = 'text',
  isStoreBased = false,
}: IProductTile) => {
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : '';
  const { groupedData, availableColors, productImages, allProperties } = product
    ? useTransformProduct(product)
    : {
      groupedData: {},
      availableColors: [],
      productImages: [],
      allProperties: {},
    };

  const storeUrl = useMemo(() => {
    if (typeof window === "undefined") return `/${product.store?.slug}`;

    const host = window.location.hostname;
    const slug = product.store?.slug;

    if (host === "shoppp.space") {
      return `https://${slug}.shoppp.space`;
    }

    if (host === "staging.shoppp.space") {
      return `https://staging.shoppp.space/${slug}`;
    }

    return `/${slug}`;
  }, [product.store?.slug]);

  const uniqueVariantsFromProductImages = useMemo(
    () => (product ? getUniqueGalleryVariants(product) : []),
    [product]
  );

  const variantPreviewItems = useMemo(
    () => buildVariantMediaPreviewItems(uniqueVariantsFromProductImages),
    [uniqueVariantsFromProductImages]
  );

  const { orders, fetching: orderFetching } = useProductTileOrders({
    filters: { status: { In: `${onGoingOrderStatusQuery},DELIVERED` } },
  });

  const isCheckoutOrOrdersPage =
    pathname.includes('/checkout') || pathname.includes('/orders');

  const [seenAddToCartIconOnBoarding] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('seenAddToCartIcon');
      return stored ? JSON.parse(stored) : false;
    }
    return false;
  });

  const [onProductTileHover, setOnProductTileHover] = useState(false);
  const [openSingleProductModal, setOpenSingleProductModal] = useState(false);
  const [isToAddProperties, setIsToAddProperties] = useState<boolean>(false);
  const [recentlyViewedId, setRecentlyViewsId] = useState<any>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [guestCartVersion, setGuestCartVersion] = useState(0);
  const [catalogueGalleryOpen, setCatalogueGalleryOpen] = useState(false);
  const [galleryQuickLookVariant, setGalleryQuickLookVariant] = useState<
    ProductVariant | undefined
  >();
  const [galleryQuickLookImage, setGalleryQuickLookImage] = useState<string>();

  const activePreviewItem = variantPreviewItems[activeIndex];
  const selectedVariant =
    activePreviewItem?.variant ??
    uniqueVariantsFromProductImages[0] ??
    product?.variants?.[0];
  const selectedImage = activePreviewItem?.media?.url;

  const handleAutoAdvance = useCallback(() => {
    if (variantPreviewItems.length <= 1) return;
    setActiveIndex((index) => (index + 1) % variantPreviewItems.length);
  }, [variantPreviewItems.length]);

  const rotateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoRotatePaused = onProductTileHover || openSingleProductModal;

  const clearRotateTimeout = useCallback(() => {
    if (rotateTimeoutRef.current) {
      clearTimeout(rotateTimeoutRef.current);
      rotateTimeoutRef.current = null;
    }
  }, []);

  const scheduleRotate = useCallback(() => {
    clearRotateTimeout();
    if (autoRotatePaused || variantPreviewItems.length <= 1) return;

    rotateTimeoutRef.current = setTimeout(() => {
      handleAutoAdvance();
    }, TILE_AUTO_ROTATE_MS);
  }, [
    autoRotatePaused,
    variantPreviewItems.length,
    handleAutoAdvance,
    clearRotateTimeout,
  ]);

  useEffect(() => {
    scheduleRotate();
    return clearRotateTimeout;
  }, [activeIndex, scheduleRotate, clearRotateTimeout]);

  const rowRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<HTMLSpanElement[]>([]);
  const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggeredRef = useRef(false);
  const cartActionLockRef = useRef(false);

  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  const handleTagSelection = (tagLabel: string) => {
    if (!setSelectedCategory) return;

    const clicked = String(tagLabel ?? '').trim();
    if (!clicked) return;

    const currentRaw = String(selectedCategory?.name ?? '').trim();
    const current =
      !currentRaw || currentRaw.toLowerCase() === 'all'
        ? []
        : currentRaw
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean);

    const clickedIndex = current.findIndex(
      (t: string) => t.toLowerCase() === clicked.toLowerCase()
    );

    const next =
      clickedIndex >= 0
        ? current.filter((_, i) => i !== clickedIndex)
        : [...current, clicked];

    const nextName = next.length ? next.join(',') : 'All';

    setSelectedCategory({
      ...(selectedCategory ?? {}),
      name: nextName,
    });
  };

  const {
    addToCart: cartAddToCart,
    cart,
    increment: cartIncrement,
    decrement: cartDecrement,
    removeFromCart,
    isAuthenticated,
    isLoginModal,
    fetching: cartFetching,
  } = useCart();
  const {
    saveVariant: fallbackSaveVariant,
    removeSavedVariant: fallbackRemoveSavedVariant,
    savedVariants: fallbackSavedVariants,
  } = useSavedVariant();
  const imgRef = useRef<HTMLImageElement>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isRemovingFromCart, setIsRemovingFromCart] = useState(false);

  /* const variantIds = useMemo(
    () => product.variants.map((v: any) => v.id),
    [product.variants]
  );
  const { reviewStat, loading: statsLoading } = useGetRatingStats(variantIds); */
  const { addVariant } = useRecentlyViewedActions();

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

  const addToCart = async (
    variantId: string,
    quantity: number,
    userConfigurations: any,
    variant: ProductVariant
  ) => {
    if (cartActionLockRef.current) return;
    cartActionLockRef.current = true;
    setIsAddingToCart(true);
    try {
      await cartAddToCart(variantId, quantity, userConfigurations, variant);
    } finally {
      cartActionLockRef.current = false;
      setIsAddingToCart(false);
    }
  };

  const increment = (cartItem: CartItem, userConfigurations?: any) => {
    if (cartActionLockRef.current || isAddingToCart || isRemovingFromCart) return;
    cartIncrement(cartItem, userConfigurations);
  };

  const decrement = async (cartItem: CartItem, userConfigurations?: any) => {
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
    cartDecrement(cartItem, userConfigurations);
  };

  useEffect(() => {
    setActiveIndex(0);
  }, [product?.id]);

  const handlePreviewMediaSelect = useCallback(
    (index: number) => {
      const item = variantPreviewItems[index];
      if (!item?.media?.url) return;

      setActiveIndex(index);
      setRecentlyViewsId(item.variant.id);
    },
    [variantPreviewItems]
  );

  useEffect(() => {
    if (!seenAddToCartIconOnBoarding) {
      localStorage.setItem('seenAddToCartIcon', 'true');
    }
  }, [seenAddToCartIconOnBoarding]);

  const configPills = useMemo(() => {
    const records = selectedVariant?.configurationRecords ?? [];

    return records
      .filter((r: any) => !!r?.description)
      .map((r: ConfigurationRecord) => {
        const kind = resolveConfigPillKind(r);
        return {
          text: r.description,
          ...PRODUCT_TILE_PILL_STYLES[kind],
          source: kind,
        };
      });
  }, [selectedVariant?.id]);

  const visibleConfigPills = useMemo(() => {
    if (configPills.length > 0) {
      return configPills.slice(0, 2);
    }

    return [
      {
        text: 'Ready to wear',
        ...PRODUCT_TILE_PILL_STYLES['ready-to-wear'],
        source: 'ready-to-wear',
      },
    ];
  }, [configPills]);

  const activeVariantId = selectedVariant?.id ?? product?.variants?.[0]?.id;
  const resolvedSavedVariants = savedVariants ?? fallbackSavedVariants;
  const resolvedSaveVariant = saveVariant ?? fallbackSaveVariant;
  const resolvedRemoveSavedVariant =
    removeSavedVariant ?? fallbackRemoveSavedVariant;

  const isSaved = resolvedSavedVariants?.find(
    (item: SavedVariant) => item.variantId === activeVariantId
  );

  const handleSave = () => {
    if (!activeVariantId) return;
    if (isSaved) {
      resolvedRemoveSavedVariant && resolvedRemoveSavedVariant(activeVariantId);
    } else {
      resolvedSaveVariant && resolvedSaveVariant(activeVariantId);
    }
  };

  const handleCloseProductModal = () => {
    setOpenSingleProductModal((prev) => !prev);
    if (openSingleProductModal) {
      setIsToAddProperties(false);
      setGalleryQuickLookVariant(undefined);
      setGalleryQuickLookImage(undefined);
    }
  };

  const getCartItemForVariant = useCallback(
    (variant: ProductVariant) => {
      const existing = cart.cartItems.find(
        (item) => item.variant.id === variant.id
      );
      if (existing) return existing;
      if (isAuthenticated) return undefined;

      const guestQty = guestSession.getCartQuantityForVariant(variant.id);
      if (guestQty <= 0) return undefined;

      return {
        id: `guest-${variant.id}`,
        productId: variant.product?.id ?? '',
        quantity: guestQty,
        variant,
        totalPrice: variant.finalPrice * guestQty,
        discountedPrice: variant.discountedPrice * guestQty,
        userConfigurations:
          guestSession.getLatestUserConfigurations(variant.id) ?? {},
        createdAt: '',
        discountValue: 0,
        lastUpdated: '',
        meta: null,
      } as CartItem;
    },
    [cart.cartItems, isAuthenticated, guestCartVersion]
  );

  const isSavedForVariant = useCallback(
    (variantId: string) =>
      !!resolvedSavedVariants?.find(
        (item: SavedVariant) => item.variantId === variantId
      ),
    [resolvedSavedVariants]
  );

  const handleToggleSaveVariant = useCallback(
    (variantId: string) => {
      if (isSavedForVariant(variantId)) {
        resolvedRemoveSavedVariant?.(variantId);
      } else {
        resolvedSaveVariant?.(variantId);
      }
    },
    [
      isSavedForVariant,
      resolvedRemoveSavedVariant,
      resolvedSaveVariant,
    ]
  );

  const handleGalleryOpenQuickLook = useCallback(
    (variant: ProductVariant, mediaUrl: string) => {
      setGalleryQuickLookVariant(variant);
      setGalleryQuickLookImage(mediaUrl);
      setIsToAddProperties(true);
      setOpenSingleProductModal(true);
    },
    []
  );

  const handleGalleryAddToCart = useCallback(
    (variant: ProductVariant) => {
      setShowOnBoardingModal(false);
      if (!localStorage.getItem('seenMiniCart')) {
        window.dispatchEvent(new Event('showMiniCartOnboarding'));
        localStorage.setItem('seenMiniCart', 'true');
      }
      addToCart(
        variant.id,
        variant.minPurchaseQuantity || 1,
        {},
        {
          ...variant,
          product: variant.product ?? product,
        }
      );
    },
    [addToCart, product]
  );

  const handleLongPressOpenProductModal = () => {
    handleCloseProductModal();
    if (selectedVariant) {
      setRecentlyViewsId(selectedVariant.id);
    }
  };

  const clearLongPressTimeout = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  const startLongPress = () => {
    longPressTriggeredRef.current = false;
    clearLongPressTimeout();
    longPressTimeoutRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      handleLongPressOpenProductModal();
    }, 450);
  };

  const endLongPress = () => {
    clearLongPressTimeout();
  };

  useEffect(() => {
    return () => clearLongPressTimeout();
  }, []);

  useEffect(() => {
    if (recentlyViewedId && isAuthenticated) {
      addVariant(recentlyViewedId, 'view');
    }
  }, [recentlyViewedId, isAuthenticated]);

  const isOutOfStock = selectedVariant?.status === 'OUT_OF_STOCK';
  const variantDisplayPrices = getVariantDisplayPrices({
    variant: selectedVariant,
    product,
  });

  const discountPill = useMemo(() => {
    if (!variantDisplayPrices.hasSlash) return null;

    const payable = variantDisplayPrices.displayPrice;
    const strike = getStrikethroughAmounts(variantDisplayPrices)[0];
    if (!strike || strike <= payable) return null;

    const discount = product?.discount;
    const visibleMeta = extractVisibleDiscountMeta(selectedVariant);

    let text: string;
    if (variantDisplayPrices.hasVisualSlash && visibleMeta?.value) {
      if (visibleMeta.discountCalculationType === 'PERCENTAGE') {
        text = `${Math.round(Number(visibleMeta.value))}% off`;
      } else {
        text = `${formatNumberAsPrice(visibleMeta.value)} off`;
      }
    } else if (variantDisplayPrices.hasVendorSlash && discount?.value) {
      if (discount.discountCalculationType === 'PERCENTAGE') {
        text = `${Math.round(Number(discount.value))}% off`;
      } else {
        text = `${formatNumberAsPrice(discount.value)} off`;
      }
    } else {
      const pct = Math.round(((strike - payable) / strike) * 100);
      if (pct <= 0) return null;
      text = `${pct}% off`;
    }

    return {
      text,
      ...PRODUCT_TILE_PILL_STYLES.discount,
      source: 'discount',
    };
  }, [variantDisplayPrices, selectedVariant, product?.discount]);

  const hasProperties = useMemo(() => {
    if (!selectedVariant) return false;

    const hasSize = selectedVariant.size && selectedVariant.size.trim() !== '';
    const hasOtherProperties =
      selectedVariant?.properties &&
      Object.entries(selectedVariant.properties).some(([, value]) => {
        const trimmed = String(value ?? '').trim();
        return trimmed !== '';
      });

    return hasSize || hasOtherProperties;
  }, [selectedVariant]);

  const shouldAddDirectlyToCart = useMemo(() => {

    if (!allProperties) return false;

    const propertyKeys = Object.keys(allProperties);
    if (propertyKeys.length !== 1) return false;

    const firstKey = propertyKeys[0];
    const values = allProperties[firstKey];

    if (!Array.isArray(values) || values.length !== 1) return false;

    const singleValue = values[0];
    const hasNonEmptyValue =
      typeof singleValue === 'string' && singleValue.trim() !== '';

    return hasNonEmptyValue;
  }, [allProperties]);

  const hasCustomerConfiguration = useMemo(() => {
    return (
      selectedVariant?.configurationRecords?.some((record: any) =>
        record.customerDataForm?.some((f: any) => isCustomerInputForField(f))
      ) ?? false
    );
  }, [selectedVariant?.id]);

  const variantNeedsQuickLook = useCallback(
    (variant: ProductVariant) => {
      const hasSize = variant.size && variant.size.trim() !== '';
      const hasOtherProperties =
        variant?.properties &&
        Object.entries(variant.properties).some(([, value]) => {
          const trimmed = String(value ?? '').trim();
          return trimmed !== '';
        });
      const hasProperties = hasSize || hasOtherProperties;
      const hasCustomerConfiguration =
        variant?.configurationRecords?.some((record: any) =>
          record.customerDataForm?.some((f: any) => isCustomerInputForField(f))
        ) ?? false;

      return (
        (hasProperties && !shouldAddDirectlyToCart) || hasCustomerConfiguration
      );
    },
    [shouldAddDirectlyToCart]
  );

  const productTileGalleryApi = useMemo((): ProductTileGalleryApi => {
    return {
      isSavedForVariant,
      onToggleSaveVariant: handleToggleSaveVariant,
      getCartItemForVariant,
      variantNeedsQuickLook,
      onGalleryAddToCart: handleGalleryAddToCart,
      onGalleryOpenQuickLook: handleGalleryOpenQuickLook,
      onIncrementCartItem: increment,
      onDecrementCartItem: decrement,
      isAuthenticated,
      onAuthRequired: isLoginModal,
    };
  }, [
    isSavedForVariant,
    handleToggleSaveVariant,
    getCartItemForVariant,
    variantNeedsQuickLook,
    handleGalleryAddToCart,
    handleGalleryOpenQuickLook,
    increment,
    decrement,
    isAuthenticated,
    isLoginModal,
  ]);

  useRegisterProductTileGalleryApi(product?.id, productTileGalleryApi);

  const pageGallery = useProductTileGallery();

  useEffect(() => {
    if (!pageGallery?.isGalleryOpen) return;
    pageGallery.bumpGalleryRevision();
  }, [guestCartVersion, cart.cartItems, pageGallery]);

  const visibleTags = useMemo(() => {
    return (product?.tags ?? [])
      .filter((tag: any) => !tag.label?.includes('pill:'))
      .filter((tag: any) => !tag.label?.includes('collection:'));
  }, [product?.tags]);

  const activeTagSet = useMemo(() => {
    const raw = String(selectedCategory?.name ?? '').trim();
    if (!raw || raw.toLowerCase() === 'all') return new Set<string>();

    return new Set(
      raw
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
    );
  }, [selectedCategory?.name]);

  const isTagActive = (tagLabel: string) => {
    const key = String(tagLabel ?? '').trim().toLowerCase();
    return activeTagSet.has(key);
  };

  const [visibleTagCount, setVisibleTagCount] = useState(visibleTags.length);

  const [showOnBoardingModal, setShowOnBoardingModal] = useState(false);
  const indexCount = index === 0;

  useEffect(() => {
    const handleGuestCartUpdate = () => setGuestCartVersion((value) => value + 1);
    window.addEventListener('guest-cart-updated', handleGuestCartUpdate);
    return () =>
      window.removeEventListener('guest-cart-updated', handleGuestCartUpdate);
  }, []);

  useEffect(() => {
    const isDataLoading = orderFetching || cartFetching;
    if (isDataLoading) return;

    if (!seenAddToCartIconOnBoarding && !isCheckoutOrOrdersPage) {
      const noOrders = (orders?.length ?? 0) === 0;
      const emptyCart = (cart?.cartItems?.length ?? 0) === 0;

      if (noOrders && emptyCart) {
        setShowOnBoardingModal(true);
      } else {
        setShowOnBoardingModal(false);
      }
    } else {
      setShowOnBoardingModal(false);
    }
  }, [
    orderFetching,
    cartFetching,
    orders,
    cart,
    seenAddToCartIconOnBoarding,
    isCheckoutOrOrdersPage,
  ]);

  useEffect(() => {
    document.body.style.overflow = showOnBoardingModal ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showOnBoardingModal]);

  const recalculateVisibleTags = React.useCallback(() => {
    if (
      !rowRef.current ||
      !priceRef.current ||
      !tagsContainerRef.current ||
      visibleTags.length === 0
    )
      return;

    const rowWidth = rowRef.current.clientWidth;
    const priceWidth = priceRef.current.offsetWidth;

    const gapBetween = 21;
    const chevronWidth = chevronRef.current?.offsetWidth ?? 14;

    const availableWidth = rowWidth - priceWidth - gapBetween - chevronWidth;

    let usedWidth = 0;
    let count = 0;

    for (let i = 0; i < tagRefs.current.length; i++) {
      const tagEl = tagRefs.current[i];
      if (!tagEl) continue;

      const style = window.getComputedStyle(tagEl);
      const margin =
        parseFloat(style.marginLeft) + parseFloat(style.marginRight);

      const tagWidth = tagEl.offsetWidth + margin + 6;

      if (usedWidth + tagWidth > availableWidth) break;

      usedWidth += tagWidth;
      count++;
    }

    setVisibleTagCount(count);
    setIsOverflowing(count < visibleTags.length);
  }, [visibleTags, selectedVariant?.id, selectedCategory?.name]);

  useEffect(() => {
    recalculateVisibleTags();
  }, [recalculateVisibleTags]);

  useEffect(() => {
    if (!rowRef.current) return;

    const observer = new ResizeObserver(() => {
      recalculateVisibleTags();
    });

    observer.observe(rowRef.current);

    return () => {
      observer.disconnect();
    };
  }, [recalculateVisibleTags]);

  useEffect(() => {
    recalculateVisibleTags();
  }, [visibleTags, selectedVariant?.id]);

  useEffect(() => {
    const close = () => setShowAllTags(false);
    if (showAllTags) document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [showAllTags]);

  const handleOnboardingClose = () => {
    setShowOnBoardingModal(false);
    localStorage.setItem('seenAddToCartIcon', 'true');
    if (!localStorage.getItem('seenMiniCart') && !isCheckoutOrOrdersPage) {
      window.dispatchEvent(new Event('showMiniCartOnboarding'));
      localStorage.setItem('seenMiniCart', 'true');
    }
  };

  const configurationRecords = selectedVariant?.configurationRecords ?? [];
  const [configurationValues, setConfigurationValues] = useState<
    Record<string, any>
  >({});

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

  const userConfigurations = buildUserConfigurations(
    configurationValues,
    configurationRecords
  );

  return {
    groupedData,
    availableColors,
    productImages,
    allReviews,
    isOpen,
    setIsOpen,
    product,
    storeUrl,
    variantPreviewItems,
    isCheckoutOrOrdersPage,
    onProductTileHover,
    setOnProductTileHover,
    openSingleProductModal,
    isToAddProperties,
    setIsToAddProperties,
    setRecentlyViewsId,
    activeIndex,
    catalogueGalleryOpen,
    setCatalogueGalleryOpen,
    galleryQuickLookVariant,
    galleryQuickLookImage,
    selectedVariant,
    selectedImage,
    rowRef,
    priceRef,
    chevronRef,
    tagsContainerRef,
    tagRefs,
    longPressTriggeredRef,
    isOverflowing,
    showAllTags,
    setShowAllTags,
    handleTagSelection,
    addToCart,
    increment,
    decrement,
    isAddingToCart,
    isRemovingFromCart,
    isAuthenticated,
    isLoginModal,
    imgRef,
    selectedVariantItemInCart,
    handlePreviewMediaSelect,
    visibleConfigPills,
    isSaved,
    handleSave,
    handleCloseProductModal,
    getCartItemForVariant,
    isSavedForVariant,
    handleToggleSaveVariant,
    handleGalleryOpenQuickLook,
    handleGalleryAddToCart,
    startLongPress,
    endLongPress,
    isOutOfStock,
    variantDisplayPrices,
    discountPill,
    hasProperties,
    shouldAddDirectlyToCart,
    hasCustomerConfiguration,
    variantNeedsQuickLook,
    visibleTags,
    isTagActive,
    visibleTagCount,
    showOnBoardingModal,
    setShowOnBoardingModal,
    indexCount,
    handleOnboardingClose,
    userConfigurations,
    addToCartVariant,
    isStoreBased,
  };
};
