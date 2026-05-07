'use client';
import Footer from '@/modules/lib/components/footer/Footer';
import Image from '@/modules/lib/components/image/Image';
import { useEffect, useState, useMemo, useRef } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar';
import QuantitySelector from '@/modules/lib/components/quantity-selector/QuantitySelector';
import VariantModal from '@/modules/lib/components/variant-modal/VariantModal';
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
  cx,
  formatNumberAsPrice,
  handleFlyToCart,
  onGoingOrderStatusQuery,
} from '@/modules/lib/utility/utility';
import { Rating, Star } from '@smastrom/react-rating';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { LuGrid2X2 } from 'react-icons/lu';
import { PiGlobeHemisphereEast, PiStorefront, PiTruck } from 'react-icons/pi';
import { RxShare2 } from 'react-icons/rx';
import { Comments } from './reviews/Comments';
import MiniReview from './reviews/MiniReview';
import ShareProductModal from './share-modal/shareProductModal';
import useGetRatingStats from '@/modules/lib/utility/hooks/use-get-rating-stats';
import useGetProductRating from '@/modules/lib/utility/hooks/use-get-review';
import colorNames from '@/modules/lib/utility/json-data/colors.json';
import VideoSrc from '@/modules/lib/components/video-src/VideoSrc';
import { useOrders } from '@/modules/lib/utility/hooks/use-orders';
import ShowAllPhotosModal from './modals/ShowAllPhotosModal';
import LightboxModal from './modals/LightboxModal';
import ReviewModal from './modals/ReviewModal';
import {
  buildUserConfigurations,
  DisplayProductConfigurations,
  isEmptyValue,
} from '@/modules/lib/components/product-detail-modal/productConfigurationsHelper';
import { CatalogueMediaItem } from '@/modules/lib/components/product-tile/ProductCatalogueDropdown';
import { guestSession } from '@/modules/lib/utility/guest-session';
import { CartItem } from '@/modules/lib/utility/types/cart.interface';
import {
  getStrikethroughAmounts,
  getVariantDisplayPrices,
} from '@/modules/lib/utility/visible-discount';
import {
  buildVariantMediaPreviewItems,
  getMediaDedupeKey,
} from '@/modules/lib/utility/product-media';

const ProductDetails = ({ product }: { product: Product }) => {
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

  const imgRef = useRef<HTMLImageElement>(null);
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
        (f: any) =>
          f.valueFormat?.targetUserType === 'customer' &&
          f.valueFormat?.required
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

      return !isEmptyValue(value);
    });
  }, [getRequiredCustomerFields, configurationValues]);

  const userConfigurations = buildUserConfigurations(
    configurationValues,
    configurationRecords
  );

  const addToCartBtn = () => {
    return (
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-8">
          <p className="text-24 weight-600">
            {formatNumberAsPrice(variantDisplayPrices.displayPrice)}
          </p>
          {variantDisplayPrices.hasSlash && (
            <div className="flex flex-wrap gap-8 a-items-center">
              {getStrikethroughAmounts(variantDisplayPrices).map(
                (amount, idx) => (
                  <p
                    key={idx}
                    className="weight-400 text-16 color-#00000099 line-through"
                  >
                    {formatNumberAsPrice(amount)}
                  </p>
                )
              )}
            </div>
          )}
        </div>

        {!selectedVariant &&
          (missingRequiredOptions.length > 0 ||
            initialMissingOptions.length > 0) && (
            <div className="flex flex-col gap-6 p-10 radius-6 bg-#FFF7E6 border border-#FFD699">
              <p className="text-12 weight-400 color-#8A5A00">
                Please select the following to continue:
              </p>

              <div className="flex flex-wrap gap-6">
                {(missingRequiredOptions.length > 0
                  ? missingRequiredOptions
                  : initialMissingOptions
                ).map((option) => (
                  <span
                    key={option}
                    className="px-8 py-4 radius-99 bg-#FFD699 text-11 weight-500 capitalize"
                  >
                    {option}
                  </span>
                ))}
              </div>
            </div>
          )}

        {!selectedVariantItemInCart ? (
          <button
            className={classNames(
              `text-white border-none l:px-24 l:py-12 py-15 w-100p radius-6 ${!selectedVariant || isOutOfStock || !areRequiredCustomerFieldsFilled ? 'bg-gray-300 cursor-not-allowed' : 'bg-#0B9378 hover:bg-darkgreen pointer'}`
            )}
            onClick={() => {
              if (orders.length == 0 && cart.cartItems.length == 0) {
                handleFlyToCart(imgRef);
              }
              if (
                selectedVariant &&
                selectedVariant.status !== 'OUT_OF_STOCK' &&
                areRequiredCustomerFieldsFilled
              ) {
                addToCart(
                  selectedVariant?.id ?? 0,
                  selectedVariant?.minPurchaseQuantity || 1,
                  userConfigurations,
                  selectedVariant
                    ? {
                        ...selectedVariant,
                        product: selectedVariant.product ?? product,
                      }
                    : undefined
                );
              }
            }}
          >
            <div className="l:flex grid grid-2-cols-auto gap-10 items-center w-fit mx-auto ">
              {selectedVariant &&
                areRequiredCustomerFieldsFilled &&
                selectedVariant?.status !== 'OUT_OF_STOCK' && (
                  <HiOutlineShoppingBag className="h-21" />
                )}
              <div
                className={classNames(
                  `whitespace-nowrap text-16 ${selectedVariant && areRequiredCustomerFieldsFilled ? (isOutOfStock ? 'text-black' : 'text-white') : 'color-gray'}`
                )}
              >
                {!selectedVariant
                  ? 'Add to cart'
                  : isOutOfStock
                    ? 'Out of stock'
                    : 'Add to cart'}
              </div>
            </div>
          </button>
        ) : (
          <QuantitySelector
            decrement={() => decrement(selectedVariantItemInCart)}
            increment={() => increment(selectedVariantItemInCart)}
            cartItem={selectedVariantItemInCart}
          />
        )}
      </div>
    );
  };

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

  return (
    <>
      <HomepageNavBar parent="" />
      <div className="sm:mt-96 mt-88 l:max-w-1400 w-full mx-auto xl:px-60 md:px-50 sm:px-40 px-24">
        <div className="flex a-items-center j-content-between gap-10">
          <div className="flex a-items-center gap-5">
            <PiStorefront className="w-fit color-#00000066 w-15 h-15" />
            <Link
              href={storeUrl}
              target="_blank"
              className="text-14 color-#00000066"
            >
              {product?.store?.name} /
            </Link>
            <span>
              {product.name
                .split(' ')
                .slice(0, 2)
                .join('')
                .toLocaleLowerCase()
                .replace(/^\w/, (c) => c.toUpperCase())}
            </span>
          </div>

          <div className="flex gap-16 a-items-center">
            <p
              className="cursor-pointer flex a-items-center gap-8 text-14 weight-400 color-#00000099"
              onClick={() => setShowShareModal(true)}
            >
              <RxShare2 className="shadow w-20 h-20" />
              <span className="border-b hidden l:block">Share</span>
            </p>
            <p
              className="cursor-pointer flex a-items-center gap-8 text-15 weight-400 color-#00000099"
              onClick={handleSave}
            >
              {isSaved ? (
                <AiFillHeart className="w-20 h-20" />
              ) : (
                <AiOutlineHeart className="w-20 h-20" />
              )}
              <span className="border-b hidden l:block">Save</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col l:flex-row a-items-start j-content-between mt-20 gap-6 l:g|max-height:480px relative">
          {allImages.length > 4 && (
            <div className="hidden l:block absolute r-0 b-0 p-20 z-2 cursor-pointer">
              <div
                className="bg-white flex gap-8 radius-8  a-items-center border px-16 py-10"
                onClick={() => setShowAllPhotos((prev) => !prev)}
              >
                <LuGrid2X2 className="w-fit flex" />
                <p className="text-14 weight-500">Show all photos</p>
              </div>
            </div>
          )}
          <div className="w-full h-270 md:h-420 sm:h-350 relative">
            {isOutOfStock && (
              <div className="absolute w-100p h-100p text-white flex j-content-center a-items-center z-1 l:text-22 radius-6">
                Out of stock
              </div>
            )}
            {
              <div
                className={`relative w-full h-full cursor-pointer overflow-hidden`}
                onClick={() => {
                  const idx = lightboxImages.findIndex(
                    (u) => u === selectedImage
                  );
                  setLightboxIndex(idx >= 0 ? idx : 0);
                  setShowLightbox(true);
                }}
                aria-label="Open gallery"
              >
                <div
                  className={`absolute inset-0 bg-black hover:bg-black opacity-0 hover:opacity-20 g|transition-property:opacity g|transition-duration:0.2s z-1 radius-8 l:radius-t-l-16 l:radius-b-l-16 l:radius-b-r-0 l:radius-t-r-0`}
                ></div>
                {mediaType === 'image' ? (
                  <Image
                    src={selectedImage ?? ''}
                    className={`flex-grow-1 h-full radius-8 l:radius-t-l-16 l:radius-b-l-16 l:radius-b-r-0 l:radius-t-r-0 w-full h-full a-self-center object-fit-cover ${isOutOfStock && 'out-of-stock'}`}
                    alt={''}
                    ref={imgRef}
                    width={10000}
                    hasLoader
                  />
                ) : (
                  <VideoSrc
                    className={`flex-grow-1 h-full radius-8 l:radius-t-l-16 l:radius-b-l-16 l:radius-b-r-0 l:radius-t-r-0   w-full h-full a-self-center object-fit-cover ${isOutOfStock && 'out-of-stock'}`}
                    src={selectedImage ?? ''}
                    hasLoader={true}
                  />
                )}
              </div>
            }
          </div>

          <div
            className="w-100p flex l:grid grid-2-cols-1fr l:grid-2-row-auto gap-6 no-scrollbar l:overflow-visible overflow-auto"
            style={{ width: '100%' }}
          >
            {(uniqueVariantsFromProductImages?.length ?? 0) > 0 && (
              <>
                {variantPreviewItems.slice(0, 4).map(({ variant: vari, media: mediaItem }, idx) => (
                    <div
                      key={`${vari.id}-${mediaItem.url}`}
                      onClick={() => {
                        const isSameVariant = selectedVariant?.id === vari.id;
                        const selectedVariantHasSameMedia = Boolean(
                          getMediaDedupeKey(mediaItem) &&
                          selectedVariant?.media?.some(
                            (img) =>
                              getMediaDedupeKey(img) ===
                              getMediaDedupeKey(mediaItem)
                          )
                        );
                        const isSameImage =
                          selectedImage === mediaItem.url ||
                          selectedVariantHasSameMedia;

                        if (isSameVariant && isSameImage) {
                          resetToDefault();
                          return;
                        }

                        setForcedVariantId(vari.id);
                        setActiveFilters(buildFiltersFromVariant(vari));
                        setSelectedImage(mediaItem.url);
                        setImageSource('preview');
                      }}
                      className={`l:h-207 ${vari?.status === 'OUT_OF_STOCK' && 'out-of-stock'} relative ${idx <= 3 ? 'block' : 'l:hidden block'}`}
                    >
                      {mediaItem?.type === 'image' ? (
                        <Image
                          src={mediaItem?.url ?? ''}
                          alt="product-image"
                          className={cx(
                            'object-fit w-50 h-50 radius-4 l:w-full l:h-full pointer l:radius-t-l-0 l:radius-b-l-0  l:radius-t-r-0 l:radius-b-r-0',
                            {
                              'border border-green border-2':
                                Boolean(
                                  getMediaDedupeKey(mediaItem) &&
                                    selectedVariant?.media?.some(
                                      (img) =>
                                        getMediaDedupeKey(img) ===
                                        getMediaDedupeKey(mediaItem)
                                    )
                                ),
                              'l:radius-t-r-16': idx === 1,
                              'l:radius-b-r-16': idx === 3,
                            }
                          )}
                          width={10000}
                          hasLoader
                        />
                      ) : (
                        <VideoSrc
                          className={cx(
                            'object-fit w-50 h-50 radius-4 l:w-full l:h-full pointer l:radius-t-l-0 l:radius-b-l-0  l:radius-t-r-0 l:radius-b-r-0',
                            {
                              'border border-green border-2':
                                Boolean(
                                  getMediaDedupeKey(mediaItem) &&
                                    selectedVariant?.media?.some(
                                      (img) =>
                                        getMediaDedupeKey(img) ===
                                        getMediaDedupeKey(mediaItem)
                                    )
                                ),
                              'l:radius-t-r-16': idx === 1,
                              'l:radius-b-r-16': idx === 3,
                            }
                          )}
                          src={mediaItem?.url ?? ''}
                          hasLoader={true}
                        />
                      )}
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>

        <div>
          {(product?.productCatalogues?.length ?? 0) > 0 && (
            <div className="mt-30">
              <p className="text-16 weight-600 mb-10">Catalogue</p>

              <div className="grid grid-3-cols-1fr sm:grid-4-cols-1fr md:grid-5-cols-1fr lg:grid-6-cols-1fr xl:grid-7-cols-1fr gap-3">
                {product?.productCatalogues?.map((item) => (
                  <CatalogueMediaItem
                    key={item.id}
                    item={item}
                    onClick={() => {
                      const idx = lightboxImages.findIndex(
                        (u) => u === item.mediaUrl
                      );
                      setLightboxIndex(idx >= 0 ? idx : 0);
                      setShowLightbox(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          className={cx('flex flex-col l:flex-row l:j-content-between mt-20')}
        >
          <div className="l:w-40p flex flex-col gap-12">
            <div className="flex flex-col gap-12 border-b  border-#00000014 pb-15">
              <p className="weight-500 text-20">{product.name}</p>
            </div>
            <div className="flex flex-col gap-12 border-b  border-#00000014 pb-15">
              <p className="weight-400 text-28">
                {formatNumberAsPrice(variantDisplayPrices.displayPrice)}
              </p>
              {variantDisplayPrices.hasSlash && (
                <div className="flex flex-wrap gap-8 a-items-center">
                  {getStrikethroughAmounts(variantDisplayPrices).map(
                    (amount, idx) => (
                      <p
                        key={idx}
                        className="weight-400 text-16 color-#00000099 line-through"
                      >
                        {formatNumberAsPrice(amount)}
                      </p>
                    )
                  )}
                </div>
              )}
              <div className="flex flex-col l:flex-row l:a-items-center l:j-content-between gap-12 w-100p">
                <div className="flex a-items-center gap-12">
                  <div className="flex gap-8 a-items-center">
                    <Rating
                      style={{
                        maxWidth: 130,
                        maxHeight: 130,
                        display: 'flex',
                        gap: '8px',
                      }}
                      value={displayReviewStat.averageRating}
                      itemStyles={{
                        itemShapes: Star,
                        activeFillColor: '#f59e0b',
                        inactiveFillColor: '#0000000F',
                      }}
                      readOnly
                    />
                    <span className="weight-500 text-14">
                      {displayReviewStat.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="color-" style={{ color: '#D9D9D9B2' }}>
                    |
                  </span>
                  <div className="color-#000000B2 text-12 flex a-items-center gap-5">
                    <MiniReview
                      id={selectedVariant?.id ?? ''}
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                      reviews={displayReviews}
                      reviewStat={displayReviewStat}
                      loading={statsLoading}
                      slug={product.slug}
                    /* color={selectedColor} */
                    />
                  </div>
                </div>

                <div className="flex">
                  <span
                    className="color-#1677FF text-12 border-b cursor-pointer"
                    onClick={() => {
                      isAuthenticated
                        ? setIsReviewModalOpen(true)
                        : isLoginModal();
                    }}
                  >
                    Rate this product
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-12 border-b  border-#00000014 pb-15">
              <div className="flex a-items-center py-15 gap-12">
                <div className="bg-black flex a-items-center j-content-center radius-999 color-white py-10 px-14 h-43 w-43">
                  {product.store.name[0]}
                </div>
                <div className="">
                  <p className="text-16 weight-500">
                    Seller by {product.store.name}
                  </p>
                  <Link
                    href={storeUrl}
                    target="_blank"
                    className="color-#00000099 text-14 border-b"
                  >
                    Visit store home
                  </Link>
                </div>
              </div>
            </div>

            <div className="l:hidden flex flex-col gap-12 border-b  border-#00000014 pb-15">
              <p className="weight-600 border-b border-#00000014 pb-15 pt-15">
                VARIATIONS
              </p>
              {allPropertiesWithSize?.color?.filter((v) => v.trim() !== '')
                ?.length > 0 && (
                  <div>
                    <p className="text-left text-12 weight-400 color-#000000B2 mb-12">
                      Select color:
                    </p>
                    <div
                      className="flex gap-6 a-items-center no-scrollbar"
                      style={{ width: '100%', overflow: 'auto' }}
                    >
                      {allPropertiesWithSize.color?.map((color) => {
                        const hex = colorMap[color.replaceAll(' ', '')];
                        const active = activeFilters.color === color;
                        const compatible = isOptionCompatible('color', color);

                        return (
                          <div
                            key={color}
                            onClick={() => toggleFilter('color', color)}
                            className={classNames(
                              'w-32 h-32 round border border-lightgray transition',
                              {
                                'border-3 border-#0B9378! border-solid': active,
                                'opacity-40 cursor-not-allowed': !compatible,
                              }
                            )}
                            style={{ background: hex || color }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

              {Object.entries(allPropertiesWithSize).map(([prop, values]) => {
                if (prop === 'color') return null;
                const cleanValues = values.filter((v) => v.trim() !== '');

                if (cleanValues.length === 0) return null;

                return (
                  <div key={prop}>
                    <p className="text-left text-12 weight-400 color-#000000B2 mb-12">
                      Select {prop}:
                    </p>
                    <div className="flex gap-10 flex-wrap">
                      {values.map((value) => {
                        const active = activeFilters[prop] === value;
                        const compatible = isOptionCompatible(prop, value);

                        if (value === '') return;

                        return (
                          <button
                            key={value}
                            onClick={() => toggleFilter(prop, value)}
                            className={cx(
                              'px-10 py-7 radius-6 border transition whitespace-nowrap text-12',
                              active &&
                              'bg-#DEFFF9! color-#0B9378! border-#0B9378 border-3 border-solid',
                              !active &&
                              compatible &&
                              'bg-white border-grey-300 hover:border-black',
                              !compatible &&
                              'bg-grey-100 text-grey-400 border-grey-200 cursor-not-allowed'
                            )}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <DisplayProductConfigurations
                configurationRecords={configurationRecords}
                configurationValues={configurationValues}
                handleConfigChange={handleConfigChange}
                userConfigurations={
                  selectedVariantItemInCart?.userConfigurations
                }
                isEditingConfiguration={isEditingConfiguration}
                onEditConfiguration={() => setIsEditingConfiguration(true)}
              />

              {addToCartBtn()}
            </div>

            <div className="flex flex-col gap-12 border-b  border-#00000014 pb-15 pt-15">
              <p className="text-16 ">{product.shortDescription}</p>
            </div>
            <div className="flex flex-col gap-30 border-b  border-#00000014 pb-15 pt-15">
              <div className="flex gap-12">
                <PiTruck className="w-32 h-32" />
                <div className="flex flex-col gap-2">
                  <p className="weight-500 text-16">Delivery Within Lagos</p>
                  <p className="text-14 color-#00000099">
                    Receive your product within 24 -72 hours after payment
                    confirmation.
                  </p>
                </div>
              </div>
              <div className="flex gap-12 a-items-center relative">
                <div
                  className="flex gap-12 a-items-center"
                  style={{ filter: 'blur(1px)' }}
                >
                  <PiGlobeHemisphereEast className="w-32 h-32" />
                  <div className="flex flex-col gap-2">
                    <p className="weight-500 text-16">Delivery Outside Lagos</p>
                    <p className="text-14 color-#00000099">
                      Receive your product within 1-3 days after payment
                      confirmation.
                    </p>
                  </div>
                </div>

                <button className="absolute border-none r-0 text-#D4280C bg-#FFDBD6 py-4 px-12 radius-4">
                  Coming soon
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-12 border-b  border-#00000014 pb-15 pt-15">
              <p className="weight-500 text-16">Product Description</p>
              <p style={{ whiteSpace: 'pre-line' }}>
                {showLongDescElipsis(product.longDescription)}
                {descriptionLength > maxDisplayDescLength ? (
                  <span onClick={() => setShowFullDescription((prev) => !prev)}>
                    {!showFullDescription && '...'}
                    <span
                      className="color-#1677FF border-b cursor-pointer"
                      style={{ fontStyle: 'italic' }}
                    >
                      {' '}
                      {showFullDescription ? 'show less' : 'show more'}
                    </span>
                  </span>
                ) : (
                  ''
                )}
              </p>
            </div>
            <div className="flex flex-col gap-12  border-b  border-#00000014 pb-30 pt-15">
              <p className="weight-500 text-16">Specifications</p>
              <div>
                <div
                  className="w-full  flex a-items-center"
                  style={{ border: '0.5px solid #00000014' }}
                >
                  <div className="w-40p py-10 text-14 px-14 bg-#F5F5F5">
                    Type
                  </div>
                  <div className="w-60p pl-10 capitalize">{product.type}</div>
                </div>
                <div
                  className="w-full  flex a-items-center"
                  style={{ border: '0.5px solid #00000014' }}
                >
                  <div className="w-40p py-10 mt-2 text-14 px-14 bg-#F5F5F5">
                    Material
                  </div>
                  <div className="w-60p pl-10 capitalize">
                    {product?.meta?.material || ''}
                  </div>
                </div>
                <div
                  className="w-full flex a-items-center"
                  style={{ border: '0.5px solid #00000014' }}
                >
                  <div className="w-40p py-10 mt-2 text-14 px-14 bg-#F5F5F5">
                    Brand name
                  </div>
                  <div className="w-60p pl-10 capitalize">
                    {product?.meta?.origin || ''}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden l:block l:w-40p w-full">
            <div
              className="w-full flex flex-col gap-12 bg-white p-24 border radius-12 border-#00000014
            "
              style={{ boxShadow: '-4px -4px 8px 2px #EDFCF766' }}
            >
              <p className="weight-600 border-b border-#00000014 pb-10">
                VARIATIONS
              </p>
              <div className="flex flex-col gap-28">
                {allPropertiesWithSize?.color?.filter((v) => v.trim() !== '')
                  ?.length > 0 && (
                    <div>
                      <p className="text-left text-12 weight-400 color-#000000B2 mb-12">
                        Select color:
                      </p>
                      <div
                        className="flex gap-6 a-items-center no-scrollbar"
                        style={{ width: '100%', overflow: 'auto' }}
                      >
                        {allPropertiesWithSize.color?.map((color) => {
                          const hex = colorMap[color.replaceAll(' ', '')];
                          const active = activeFilters.color === color;
                          const compatible = isOptionCompatible('color', color);

                          return (
                            <div
                              key={color}
                              onClick={() => toggleFilter('color', color)}
                              className={classNames(
                                'w-36 min-w-36 h-36 flex round border border-lightgray transition',
                                {
                                  'border-3 border-#0B9378! border-solid w-34 min-w-34 h-34 flex':
                                    active,
                                  'opacity-40 cursor-not-allowed': !compatible,
                                }
                              )}
                              style={{ background: hex || color }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                {Object.entries(allPropertiesWithSize).map(([prop, values]) => {
                  if (prop === 'color') return null;

                  const cleanValues = values.filter((v) => v.trim() !== '');

                  if (cleanValues.length === 0) return null;

                  return (
                    <div key={prop}>
                      <p className="text-left text-12 weight-400 color-#000000B2 mb-12">
                        Select {prop}:
                      </p>
                      <div className="flex gap-10 flex-wrap">
                        {values.map((value) => {
                          const active = activeFilters[prop] === value;
                          const compatible = isOptionCompatible(prop, value);

                          if (value === '') return;

                          return (
                            <button
                              key={value}
                              onClick={() => toggleFilter(prop, value)}
                              className={cx(
                                'px-15 py-8 radius-6 border transition text-12 whitespace-nowrap weight-400',
                                active &&
                                'bg-#DEFFF9! color-#0B9378! border-3 border-#0B9378 border-solid',
                                !active &&
                                compatible &&
                                'bg-white border-grey-300 hover:border-black',
                                !compatible &&
                                'bg-grey-100 text-grey-400 border-grey-200 cursor-not-allowed'
                              )}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {selectedVariant?.status !== 'OUT_OF_STOCK' && (
                  <DisplayProductConfigurations
                    configurationRecords={configurationRecords}
                    configurationValues={configurationValues}
                    handleConfigChange={handleConfigChange}
                    userConfigurations={
                      selectedVariantItemInCart?.userConfigurations
                    }
                    isEditingConfiguration={isEditingConfiguration}
                    onEditConfiguration={() => setIsEditingConfiguration(true)}
                  />
                )}

                {addToCartBtn()}
              </div>
            </div>
          </div>
        </div>
        {recentlyViewedVariants?.length > 0 && (
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
        )}
        <div className="flex flex-col gap-12 pt-15 mt-10 pb-100">
          <div className="">
            <p className="text-20 weight-600">
              Customer Reviews (
              {reviews.flatMap((review) => review.reviews).length ?? 0})
            </p>
            <Comments
              reviews={reviews.flatMap((review) => review.reviews)}
              isModal={false}
              limit={3}
              slug={product.slug}
            />
          </div>
        </div>
      </div>
      <ShareProductModal
        modalOpen={showShareModal}
        handleCloseModal={() => {
          setShowShareModal(false);
        }}
      />
      <ShowAllPhotosModal
        isOpen={showAllPhotos}
        onClose={() => setShowAllPhotos(false)}
        uniqueImages={uniqueImages}
        productVariants={product.variants}
        selectedImage={selectedImage}
        selectedVariant={selectedVariant}
        setActiveFilters={setActiveFilters}
        setSelectedImage={setSelectedImage}
        setImageSource={setImageSource}
        buildFiltersFromVariant={buildFiltersFromVariant}
        resetToDefault={resetToDefault}
      />
      <ReviewModal
        isOpen={isReviewModalOpen && !reviewsLoading && !statsLoading}
        onClose={() => setIsReviewModalOpen(false)}
        selectedVariantId={selectedVariant?.id ?? product.variants[0].id}
        refreshReviews={refreshReviews}
        refreshStats={refreshStats}
      />

      <LightboxModal
        showLightbox={showLightbox}
        setShowLightbox={setShowLightbox}
        lightboxIndex={lightboxIndex}
        setLightboxIndex={setLightboxIndex}
        lightboxImages={lightboxImages}
        isOutOfStock={isOutOfStock}
        imgRef={imgRef}
        isSaved={isSaved}
        handleSave={handleSave}
        isAuthenticated={isAuthenticated}
        isLoginModal={isLoginModal}
        setShowShareModal={setShowShareModal}
      />

      <Footer />
    </>
  );
};

export default ProductDetails;
