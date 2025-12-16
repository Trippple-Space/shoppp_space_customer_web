'use client';
import Footer from '@/modules/lib/components/footer/Footer';
import Image from '@/modules/lib/components/image/Image';
import Modal from '@/modules/lib/components/modal/modal';
import { useEffect, useState, useMemo, useRef } from 'react';
import { AiFillHeart, AiOutlineClose, AiOutlineHeart } from 'react-icons/ai';
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar';
import QuantitySelector from '@/modules/lib/components/quantity-selector/QuantitySelector';
import VariantModal from '@/modules/lib/components/variant-modal/VariantModal';
import { useCart } from '@/modules/lib/utility/hooks/use-cart';
import { useSavedVariant } from '@/modules/lib/utility/hooks/use-saved-variants';
import useTransformProduct, {
  getVariantValue,
} from '@/modules/lib/utility/hooks/use-transform-product';
import { productService } from '@/modules/lib/utility/services/product.service';
import {
  Product,
  ProductVariant,
  RecentlyViewed,
} from '@/modules/lib/utility/types/product.interface';
import { SavedVariant } from '@/modules/lib/utility/types/SavedVariant.interface';
import styles from '@/styles/lightbox.module.css';
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
import { AddReview } from './reviews/AddReview';
import { useOrders } from '@/modules/lib/utility/hooks/use-orders';
import { IoCloseSharp } from 'react-icons/io5';
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md';
import { AnimatePresence, motion } from 'framer-motion';
import ShowAllPhotosModal from './modals/ShowAllPhotosModal';
import LightboxModal from './modals/LightboxModal';
import ReviewModal from './modals/ReviewModal';

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

  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    product.variants[0]?.media?.[0]?.url
  );

  const [imageSource, setImageSource] = useState<
    'default' | 'variant' | 'preview'
  >('default');

  const imgRef = useRef<HTMLImageElement>(null);

  const variantIds = useMemo(
    () => product?.variants.map((v) => v.id),
    [product?.variants]
  );

  const filteredVariants = useMemo(() => {
    if (!product?.variants) return [];
    return product.variants.filter((v) =>
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
    return filteredVariants.length === 1;
  }, [filteredVariants]);

  const selectedVariant = useMemo(() => {
    return filteredVariants.length === 1 ? filteredVariants[0] : undefined;
  }, [filteredVariants]);

  const uniqueVariantsFromProductImages = availableColors
    ?.map((color) => groupedData?.[color]?.[0])
    .filter(Boolean);

  const allImages = uniqueVariantsFromProductImages?.flatMap((variant) =>
    variant.media.map((media) => media.url)
  );
  const uniqueImages = Array.from(new Set(allImages));
  const lightboxImages = uniqueImages.length ? uniqueImages : [''];
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
    if (isAuthenticated) {
      const variantId = localStorage.getItem('variantId');
      const variantIdMinimumPurchase = localStorage.getItem(
        'variantIdMinimumPurchase'
      );
      if (variantId && variantIdMinimumPurchase) {
        const parsedMinimumPurchase = parseInt(variantIdMinimumPurchase, 10);

        if (variantId && !isNaN(parsedMinimumPurchase)) {
          addToCart(variantId, parsedMinimumPurchase);
        }
        localStorage.removeItem('variantId');
        localStorage.removeItem('variantIdMinimumPurchase');
      }
    }
  }, [isAuthenticated]);

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
    if (selectedVariant?.media?.[0]?.url) {
      setSelectedImage(selectedVariant.media[0].url);
      setImageSource('variant');
    }
  }, [selectedVariant]);

  const selectedVariantItemInCart = cart.cartItems.find(
    (item) => item.variant.id === selectedVariant?.id
  );

  const descriptionLength = product?.longDescription?.split(' ')?.length || 0;
  const maxDisplayDescLength = 144;

  const isDiscounted = new Date() <= new Date(product?.discount?.activeEndDate);

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

  const buildFiltersFromVariant = (variant: ProductVariant) => {
    const filters: Record<string, string> = {};
    Object.entries(variant.properties || {}).forEach(([key, value]) => {
      if (value) filters[key] = String(value);
    });
    if (variant.size) filters.size = String(variant.size);
    return filters;
  };

  const resetToDefault = () => {
    setActiveFilters({});
    setSelectedImage(product.variants[0]?.media?.[0]?.url);
    setImageSource('default');
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

  const handleLogin = (variantId: string, minimumPurchase: number) => {
    localStorage.setItem('variantId', variantId.toString());
    localStorage.setItem(
      'variantIdMinimumPurchase',
      minimumPurchase.toString()
    );
    isLoginModal();
  };

  const isSaved = savedVariants?.find(
    (variant: SavedVariant) => selectedVariant?.id === variant.variantId
  );

  const handleSave = () => {
    if (isSaved) {
      removeSavedVariant(selectedVariant?.id || product.variants[0]?.id);
    } else {
      saveVariant(selectedVariant?.id || product.variants[0]?.id);
    }
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

  const addToCartBtn = () => {
    return (
      <div className="flex flex-col gap-16">
        <p className="text-24 weight-600">
          {formatNumberAsPrice(
            selectedVariant?.finalPrice ??
              product.variants[0]?.finalPrice ??
              product.price
          )}
        </p>

        {!selectedVariantItemInCart ? (
          <button
            className={classNames(
              `text-white border-none l:px-24 l:py-12 py-15 w-100p radius-6 ${!selectedVariant || selectedVariant.status === 'OUT_OF_STOCK' ? 'bg-gray-300' : 'bg-#0B9378 hover:bg-darkgreen pointer'}`
            )}
            onClick={() => {
              if (isAuthenticated) {
                if (orders.length == 0 && cart.cartItems.length == 0) {
                  handleFlyToCart(imgRef);
                }
                if (
                  selectedVariant &&
                  selectedVariant.status !== 'OUT_OF_STOCK'
                ) {
                  addToCart(
                    selectedVariant?.id ?? 0,
                    selectedVariant?.minPurchaseQuantity || 1
                  );
                }
              } else {
                handleLogin(
                  selectedVariant?.id ?? '',
                  selectedVariant?.minPurchaseQuantity || 1
                );
              }
            }}
          >
            <div className="l:flex grid grid-2-cols-auto gap-10 items-center w-fit mx-auto ">
              {selectedVariant &&
                selectedVariant?.status !== 'OUT_OF_STOCK' && (
                  <HiOutlineShoppingBag className="h-21" />
                )}
              <div
                className={classNames(
                  `whitespace-nowrap text-16 ${!selectedVariant || selectedVariant.status === 'OUT_OF_STOCK' ? 'text-black' : 'text-white'}`
                )}
              >
                {!selectedVariant
                  ? 'Select options'
                  : selectedVariant.status === 'OUT_OF_STOCK'
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

  return (
    <>
      <HomepageNavBar parent="" />
      <div className="sm:mt-96 mt-88 l:max-w-1400 w-full mx-auto xl:px-60 md:px-50 sm:px-40 px-24">
        <div className="flex a-items-center j-content-between gap-10">
          <div className="flex a-items-center gap-5">
            <PiStorefront className="w-fit color-#00000066 w-15 h-15" />
            <Link
              href={`/${product?.store?.slug}`}
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
              onClick={isAuthenticated ? handleSave : () => isLoginModal()}
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
                className={`relative w-full h-full cursor-pointer`}
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
                  />
                ) : (
                  <VideoSrc
                    className={`flex-grow-1 h-full radius-8 l:radius-t-l-16 l:radius-b-l-16 l:radius-b-r-0 l:radius-t-r-0   w-full h-full a-self-center object-fit-cover ${isOutOfStock && 'out-of-stock'}`}
                    src={selectedImage ?? ''}
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
                {uniqueVariantsFromProductImages.slice(0, 4).map((vari, idx) =>
                  vari?.media?.map((mediaItem: any) => (
                    <div
                      key={`${vari.id}-${mediaItem.url}`}
                      onClick={() => {
                        const isSameVariant = selectedVariant?.id === vari.id;
                        const isSameImage = selectedImage === mediaItem.url;

                        if (isSameVariant && isSameImage) {
                          resetToDefault();
                          return;
                        }

                        setActiveFilters(buildFiltersFromVariant(vari));
                        setSelectedImage(mediaItem.url);
                        setImageSource('preview');
                      }}
                      className={`l:h-207 ${vari?.status === 'OUT_OF_STOCK' && 'out-of-stock'} relative ${idx <= 3 ? 'block' : 'l:hidden block'}`}
                    >
                      {mediaType === 'image' ? (
                        <Image
                          src={mediaItem?.url ?? ''}
                          alt="product-image"
                          className={cx(
                            'object-fit w-50 h-50 radius-4 l:w-full l:h-full pointer l:radius-t-l-0 l:radius-b-l-0  l:radius-t-r-0 l:radius-b-r-0',
                            {
                              'border border-green border-2':
                                selectedVariant?.media.find(
                                  (img) => img.url === mediaItem.url
                                ),
                              'l:radius-t-r-16': idx === 1,
                              'l:radius-b-r-16': idx === 3,
                            }
                          )}
                          width={10000}
                        />
                      ) : (
                        <VideoSrc
                          className={cx(
                            'object-fit w-50 h-50 radius-4 l:w-full l:h-full pointer l:radius-t-l-0 l:radius-b-l-0  l:radius-t-r-0 l:radius-b-r-0',
                            {
                              'border border-green border-2':
                                selectedVariant?.media.find(
                                  (img) => img.url === mediaItem.url
                                ),
                              'l:radius-t-r-16': idx === 1,
                              'l:radius-b-r-16': idx === 3,
                            }
                          )}
                          src={mediaItem?.url ?? ''}
                        />
                      )}
                    </div>
                  ))
                )}
              </>
            )}
          </div>
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
                {isDiscounted
                  ? formatNumberAsPrice(
                      selectedVariant?.discountedPrice ??
                        product.variants[0]?.discountedPrice ??
                        0
                    )
                  : formatNumberAsPrice(
                      selectedVariant?.finalPrice ??
                        product.variants[0]?.finalPrice ??
                        0
                    )}
              </p>
              {isDiscounted && (
                <p className="weight-400 text-16 color-#00000099 line-through">
                  {formatNumberAsPrice(
                    selectedVariant?.finalPrice ??
                      product.variants[0]?.finalPrice ??
                      0
                  )}
                </p>
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
                    href={`/${product?.store?.slug}`}
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
              {allPropertiesWithSize.color?.length > 0 && (
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
                              'border-2.3 border-black!': active,
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
                return (
                  <div key={prop}>
                    <p className="text-left text-12 weight-400 color-#000000B2 mb-12">
                      Select {prop}:
                    </p>
                    <div className="flex gap-10 flex-wrap">
                      {values.map((value) => {
                        const active = activeFilters[prop] === value;
                        const compatible = isOptionCompatible(prop, value);

                        return (
                          <button
                            key={value}
                            onClick={() => toggleFilter(prop, value)}
                            className={cx(
                              'px-10 py-7 radius-6 border-2 transition whitespace-nowrap text-12',
                              active &&
                                'bg-#DEFFF9! color-#0B9378! border-#0B9378',
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
                    Receive your product within 4 hours after payment
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
                    {selectedVariant?.properties?.material}
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
                    {selectedVariant?.properties?.origin}
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
                {allPropertiesWithSize.color?.length > 0 && (
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
                                'border-2.8 border-black! w-34 min-w-34 h-34 flex':
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
                  return (
                    <div key={prop}>
                      <p className="text-left text-12 weight-400 color-#000000B2 mb-12">
                        Select {prop}:
                      </p>
                      <div className="flex gap-10 flex-wrap">
                        {values.map((value) => {
                          const active = activeFilters[prop] === value;
                          const compatible = isOptionCompatible(prop, value);

                          return (
                            <button
                              key={value}
                              onClick={() => toggleFilter(prop, value)}
                              className={cx(
                                'px-15 py-8 radius-6 border-2 transition text-12 whitespace-nowrap weight-400',
                                active &&
                                  'bg-#DEFFF9! color-#0B9378! border-#0B9378',
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
