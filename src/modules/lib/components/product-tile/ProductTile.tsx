'use client';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import Image from '../image/Image';
import { AiFillStar, AiFillHeart } from 'react-icons/ai';
import classNames from 'classnames';
import { Product, ProductVariant } from '../../utility/types/product.interface';
import {
  checkMediaType,
  displayProductPill,
  formatNumberAsPrice,
  handleFlyToCart,
  onGoingOrderStatusQuery,
  saveVariantToLocalStorage,
} from '../../utility/utility';
import { useCart } from '../../utility/hooks/use-cart';
import QuantitySelector from '../quantity-selector/QuantitySelector';
import Link from 'next/link';
import VideoSrc from '../video-src/VideoSrc';
import { FaEye } from 'react-icons/fa6';
import ProductDetailModal from '../product-detail-modal/ProductDetailModal';
import { PiShoppingCartFill, PiStorefront } from 'react-icons/pi';
import { SavedVariant } from '../../utility/types/SavedVariant.interface';
import MiniReview from '@/modules/views/product-details/reviews/MiniReview';
import { IFetchedReview } from '../../utility/types/review.interface';
import useGetRatingStats from '../../utility/hooks/use-get-rating-stats';
import useTransformProduct from '../../utility/hooks/use-transform-product';
import {
  useRecentlyViewedActions,
  useRecentlyViewedVariant,
} from '../../utility/hooks/use-recently-viewed';
import { useOrders } from '../../utility/hooks/use-orders';
import Button from '../button/Button';
import { useProductTileOrders } from '../../utility/hooks/use-product-tile-orders';
import { LuChevronRight } from 'react-icons/lu';

interface IProductTile {
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
}

const ProductTile: FC<IProductTile> = ({
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
}) => {
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
  const uniqueVariantsFromProductImages = availableColors
    ?.map((color) => groupedData?.[color]?.[0])
    .filter(Boolean);

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
  const [selectedColor, setSelectedColor] = useState(availableColors[0]);
  const [selectedImage, setSelectedImage] = useState(
    product?.variants?.[0]?.media?.[0]?.url
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product?.variants?.[0]
  );

  const rowRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<HTMLSpanElement[]>([]);

  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  const {
    addToCart,
    cart,
    increment,
    decrement,
    isAuthenticated,
    isLoginModal,
    fetching: cartFetching,
  } = useCart();
  const imgRef = useRef<HTMLImageElement>(null);

  /* const variantIds = useMemo(
    () => product.variants.map((v: any) => v.id),
    [product.variants]
  );
  const { reviewStat, loading: statsLoading } = useGetRatingStats(variantIds); */
  const { addVariant } = useRecentlyViewedActions();

  const selectedVariantItemInCart = cart.cartItems.find(
    (item) => item.variant.id === selectedVariant?.id
  );

  useEffect(() => {
    setSelectedImage(product?.variants?.[0]?.media?.[0]?.url);
    setSelectedVariant(product?.variants?.[0]);
  }, [product?.id]);

  const [topTwoPills, setTopTwoPills] = useState<any[]>([]);
  useEffect(() => {
    const pills = displayProductPill(product?.tags);
    setTopTwoPills(pills);

    if (!seenAddToCartIconOnBoarding) {
      localStorage.setItem('seenAddToCartIcon', 'true');
    }
  }, []);

  const configPills = useMemo(() => {
    const records = selectedVariant?.configurationRecords ?? [];

    return records
      .filter((r: any) => !!r?.description)
      .map((r: any) => ({
        text: r.description,
        pillBackground: '#FFF7E6',
        pillColor: '#AD6800',
        source: 'config',
      }));
  }, [selectedVariant?.id]);

  const finalTopPills = useMemo(() => {
    const configs = configPills.slice(0, 2);
    const normal = topTwoPills ?? [];

    if (configs.length >= 2) {
      return configs;
    }

    if (configs.length === 1) {
      return [...configs, normal[0]].filter(Boolean);
    }

    return normal.slice(0, 2);
  }, [configPills, topTwoPills]);

  const isSaved = savedVariants?.find(
    (item: SavedVariant) => item.variantId === selectedVariant?.id
  );
  const mediaType = checkMediaType(selectedImage) ?? 'image';

  const handleSave = () => {
    if (isSaved) {
      removeSavedVariant && removeSavedVariant(selectedVariant?.id);
    } else {
      saveVariant && saveVariant(selectedVariant?.id);
    }
  };

  const handleCloseProductModal = () => {
    setOpenSingleProductModal((prev) => !prev);
    if (openSingleProductModal) {
      setIsToAddProperties(false);
    }
  };

  function handleLogin(variantId: string, minimumPurchase: number) {
    saveVariantToLocalStorage(variantId, minimumPurchase.toString());
    isLoginModal();
  }

  useEffect(() => {
    if (recentlyViewedId && isAuthenticated) {
      addVariant(recentlyViewedId, 'view');
    }
  }, [recentlyViewedId, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const variantId = localStorage.getItem('variantId');
      const variantIdMinimumPurchase = localStorage.getItem(
        'variantIdMinimumPurchase'
      );
      const storedConfig = localStorage.getItem('userConfigurations');
      const userConfigurations: Record<string, any> | null = storedConfig
        ? JSON.parse(storedConfig)
        : null;

      if (variantId && variantIdMinimumPurchase) {
        const parsedMinimumPurchase = parseInt(variantIdMinimumPurchase, 10);
        if (variantId && !isNaN(parsedMinimumPurchase)) {
          addToCart(
            variantId,
            parsedMinimumPurchase,
            userConfigurations ?? undefined
          );
        }
        localStorage.removeItem('variantId');
        localStorage.removeItem('variantIdMinimumPurchase');
        localStorage.removeItem('userConfigurations');
      }
    }
  }, [isAuthenticated]);

  const isOutOfStock = selectedVariant?.status === 'OUT_OF_STOCK';
  const isDiscounted =
    new Date(product?.discount?.activeStartDate) <=
      new Date(new Date().setHours(new Date().getHours() + 1)) &&
    new Date(new Date().setHours(new Date().getHours() + 1)) <=
      new Date(product?.discount?.activeEndDate);

  const hasProperties = useMemo(() => {
    if (!selectedVariant) return false;

    const hasSize = selectedVariant.size && selectedVariant.size.trim() !== '';
    const hasOtherProperties =
      selectedVariant.properties &&
      Object.keys(selectedVariant.properties).length > 0;

    return hasSize || hasOtherProperties;
  }, [selectedVariant]);

  const shouldAddDirectlyToCart = useMemo(() => {
    if (!allProperties) return false;

    const propertyKeys = Object.keys(allProperties);
    if (propertyKeys.length !== 1) return false;

    const firstKey = propertyKeys[0];
    const values = allProperties[firstKey];

    if (!Array.isArray(values) || values.length !== 1) return false;

    return true;
  }, [allProperties]);

  const hasCustomerConfiguration = useMemo(() => {
    return (
      selectedVariant?.configurationRecords?.some((record: any) =>
        record.customerDataForm?.some(
          (f: any) => f.valueFormat?.targetUserType === 'customer'
        )
      ) ?? false
    );
  }, [selectedVariant?.id]);

  const visibleTags = useMemo(() => {
    return (product?.tags ?? [])
      .filter((tag: any) => !tag.label?.includes('pill:'))
      .filter((tag: any) => !tag.label?.includes('collection:'));
  }, [product?.tags]);

  const [visibleTagCount, setVisibleTagCount] = useState(visibleTags.length);

  const [showOnBoardingModal, setShowOnBoardingModal] = useState(false);
  const indexCount = index === 0;

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
  }, [visibleTags, selectedVariant?.id]);

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

  return (
    <div className="mt-30 l:mt-20 w-full overflow-hidden">
      {showOnBoardingModal && indexCount && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        ></div>
      )}

      {/* IMAGE SECTION */}
      <div
        id="image"
        className="relative ratio-1 radius-10 g|overflow:hidden l:radius-15 w-full"
        onMouseOver={() => setOnProductTileHover(true)}
        onMouseOut={() => setOnProductTileHover(false)}
      >
        <Link href={`/products/${product?.slug}`}>
          {mediaType === 'image' ? (
            <div className="relative w-full h-full">
              {isOutOfStock && (
                <div className="absolute w-100p h-100p text-white flex j-content-center a-items-center z-1 l:text-22 radius-6">
                  Out of stock
                </div>
              )}
              <Image
                ref={imgRef}
                className={`absolute w-full h-full a-self-center g|object-fit:cover pointer ${
                  isOutOfStock && 'out-of-stock'
                }`}
                src={selectedImage}
                alt="product-image"
                width={10000}
                hasLoader={true}
              />
            </div>
          ) : (
            <VideoSrc
              className={`absolute w-full h-full a-self-center g|object-fit:cover pointer ${
                isOutOfStock && 'out-of-stock'
              }`}
              src={selectedImage}
            />
          )}
        </Link>

        {/* QUICK LOOK BUTTON */}
        {onProductTileHover && product && (
          <div
            id="add to cart button"
            className="hidden l:block absolute z-1 b-0 l-0 ml-10 mt-20 l:mr-15 l:mb-15"
            onClick={() => {
              handleCloseProductModal();
              if (selectedVariant) {
                setRecentlyViewsId(selectedVariant.id);
              }
            }}
          >
            <p className="bg-white radius-20 p-5 cursor-pointer text-12 flex a-items-center gap-5">
              <FaEye className="w-fit" />
              Quick look
            </p>
          </div>
        )}

        {/* ADD TO CART / ONBOARDING */}
        <div
          id="add to cart button"
          className="absolute b-0 r-0 mr-10 mb-10 l:mr-15 l:mb-15"
        >
          {selectedVariantItemInCart ? (
            <QuantitySelector
              decrement={() => {
                if (
                  (hasProperties && !shouldAddDirectlyToCart) ||
                  hasCustomerConfiguration
                ) {
                  setIsToAddProperties(true);
                  handleCloseProductModal();
                } else {
                  decrement(selectedVariantItemInCart);
                }
              }}
              increment={() => {
                if (
                  (hasProperties && !shouldAddDirectlyToCart) ||
                  hasCustomerConfiguration
                ) {
                  setIsToAddProperties(true);
                  handleCloseProductModal();
                } else {
                  increment(selectedVariantItemInCart);
                }
              }}
              cartItem={selectedVariantItemInCart}
            />
          ) : (
            <>
              {showOnBoardingModal && indexCount && !isCheckoutOrOrdersPage && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="l:w-200 w-100 l:p-10 p-5 l:mb-10 b-70p r-20"
                  style={{
                    position: 'absolute',
                    background: 'white',
                    borderRadius: '10px',
                    zIndex: 1000,
                  }}
                >
                  <p className="weight-400">
                    Tap this button to add an item to your cart
                  </p>
                  <div onClick={handleOnboardingClose}>
                    <button className="bg-green text-white mt-2 l:mt-10 l:py-10 l:px-20 w-full py-5 radius-5 border-none hover:pointer text-13 l:text-14 font-inter hover:bg-darkgreen transition-0.5s text-center">
                      Close
                    </button>
                  </div>
                </div>
              )}

              <div
                style={{ zIndex: showOnBoardingModal && indexCount ? 1000 : 0 }}
                className="round relative"
              >
                {selectedVariant?.status !== 'OUT_OF_STOCK' && (
                  <button
                    onClick={() => {
                      if (
                        (hasProperties && !shouldAddDirectlyToCart) ||
                        hasCustomerConfiguration
                      ) {
                        setShowOnBoardingModal(false);
                        setIsToAddProperties(true);
                        handleCloseProductModal();
                      } else {
                        setShowOnBoardingModal(false);
                        if (isAuthenticated) {
                          if (!localStorage.getItem('seenMiniCart')) {
                            window.dispatchEvent(
                              new Event('showMiniCartOnboarding')
                            );
                            localStorage.setItem('seenMiniCart', 'true');
                          }
                          addToCart(
                            selectedVariant.id,
                            selectedVariant.minPurchaseQuantity || 1
                          );
                        } else {
                          handleLogin(
                            selectedVariant.id,
                            selectedVariant.minPurchaseQuantity || 1
                          );
                        }
                      }
                    }}
                    disabled={!selectedImage}
                    className={classNames(
                      `bg-#FACE33 shadow-0-4-8-0-#00000033 hover:shadow-0-8-8-0-#00000033 text-black! 
                      disabled:bg-gray-200 disabled:cursor-not-allowed hover:scale-1.06 
                      g|transition:0.5s g|will-change:transform pointer font-roboto 
                      border-hidden outline-none s:p-14 p-12 round flex a-items-center j-items-center gap-10`
                    )}
                  >
                    <PiShoppingCartFill className="s:w-22 w-20 s:h-22 h-20" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* FAVORITE ICON */}
        <div
          id="favorite icon"
          className="absolute z-1 t-0 r-0 mr-10 mt-10 l:mr-15 l:mt-15 text-24 l:text-34"
          onClick={isAuthenticated ? handleSave : () => isLoginModal()}
          style={{
            background: isSaved ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.7)',
            borderRadius: '50%',
            padding: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.11)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AiFillHeart
            color={isSaved ? '#ffffffee' : '#000000aa'}
            className="shadow"
          />
        </div>

        {/* PILLS */}
        <div className="absolute w-fit h-fit t-0 l-0 z-1">
          {finalTopPills.map((pill, index) => (
            <div
              key={index + pill.text + pill.pillColor}
              className="mt-10 l:ml-15 l:mt-15 whitespace-nowrap w-fit h-20 radius-20 flex a-items-center j-content-center px-10 py-15 ml-5"
              style={{
                backgroundColor: pill.pillBackground,
                color: pill.pillColor,
              }}
            >
              <p className="text-10 l:text-12">{pill.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="scroll-x no-scrollbar">
        <div
          id="product varients"
          className="l:mt-16 mt-14 l:h-51.2 h-45 flex a-items-center md:gap-6 gap-4 w-full overflow-auto whitespace-nowrap no-scrollbar"
        >
          {uniqueVariantsFromProductImages.map((variant: any) =>
            variant?.media?.map((mediaItem: any, i: number) => (
              <div className="l:w-35.2 l:min-w-35.2 l:h-35.2 w-31 min-w-31 h-31 pointer md:radius-4 radius-3 a-self-center relative">
                {mediaItem?.type === 'image' ? (
                  <Image
                    key={`${variant.id}-${mediaItem.url}-${i}`}
                    className={classNames(
                      `l:w-35.2 l:min-w-35.2 l:h-35.2 w-31 min-w-31 h-31 pointer md:radius-4 radius-3 a-self-center g|object-fit:cover ${variant?.status === 'OUT_OF_STOCK' && 'out-of-stock'}`,
                      {
                        'border border-2 border-black':
                          selectedImage == mediaItem?.url,
                        [`border-${/*variant?.properties?.color?.toLocaleLowerCase() ||*/ '#0B9378'}`]:
                          selectedImage == mediaItem?.url,
                      }
                    )}
                    src={mediaItem?.url}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setRecentlyViewsId(variant.id);
                      setSelectedImage(mediaItem?.url);
                      setSelectedColor(variant?.properties?.color);
                    }}
                    alt="product-image"
                    hasLoader={true}
                    pulseClassName="md:radius-4 radius-3"
                  />
                ) : (
                  <VideoSrc
                    key={`${variant.id}-${mediaItem.url}-${i}`}
                    className={classNames(
                      `l:w-35.2 l:min-w-35.2 l:h-35.2 w-31 min-w-31 h-31 pointer md:radius-4 radius-3 a-self-center g|object-fit:cover ${variant?.status === 'OUT_OF_STOCK' && 'out-of-stock'}`,
                      {
                        'border border-2': selectedImage == mediaItem?.url,
                        [`border-${/*variant?.properties?.color?.toLocaleLowerCase() ||*/ '#0B9378'}`]:
                          selectedImage == mediaItem?.url,
                      }
                    )}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setSelectedImage(mediaItem?.url);
                    }}
                    src={mediaItem?.url}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <div
        id="product details"
        className="md:mt-16 mt-20 white-space-nowrap text-overflow-ellipsis flex flex-col gap-8"
      >
        <div
          title={product.name}
          className="md:text-16 text-15 weight-500 text-#000000E0 md:line-height-24 line-height-22 l:w-100p w-100 l:white-space-nowrap text-overflow-ellipsis flex flex-wrap a-items-center j-content-between"
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block',
            maxWidth: '100%',
          }}
        >
          <Link
            href={`/products/${product?.slug}`}
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block',
              maxWidth: '100%',
            }}
          >
            {product.name}
          </Link>
        </div>
        <div className="flex a-items-center gap-10 l:gap-18 text-dimgrey py-6 border-y border-#00000014">
          <Link
            href={`/${product.store?.slug}`}
            target="_blank"
            className="flex gap-6 a-items-center color-#00000099 capitalize"
          >
            <PiStorefront className="md:w-16 w-14 md:h-16 h-14" />
            <p className="md:text-12 text-10 weight-400 md:line-height-20 line-height-12.1">
              {product?.store?.name}
            </p>
          </Link>
          {!!product.reviewRating && (
            <div className="flex gap-3 items-center">
              <AiFillStar className="w-12" />
              <span className="l:text-16 text-12">{product.reviewRating}</span>
            </div>
          )}
        </div>
        <div ref={rowRef} className="flex j-content-between gap-15">
          <div
            ref={priceRef}
            className="flex md:gap-8 md:a-items-center md:flex-row flex-col"
          >
            <p className="md:text-16 text-12 weight-600 md:line-height-24 line-height-20">
              {isDiscounted
                ? formatNumberAsPrice(selectedVariant?.discountedPrice)
                : formatNumberAsPrice(
                    selectedVariant?.finalPrice ?? product.finalPrice ?? 0
                  )}
            </p>
            {isDiscounted && (
              <p className="md:text-12 text-10 weight-400 md:line-height-20 color-#00000099 line-through">
                {formatNumberAsPrice(
                  selectedVariant?.finalPrice ?? product.finalPrice ?? 0
                )}
              </p>
            )}
          </div>

          <div className="text-9 sm:text-10 text-grey flex gap-6 a-items-center relative">
            {/* <MiniReview
              id={selectedVariant?.id}
              slug={product?.slug}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              reviews={allReviews.filter(
                (review: any) => review.productVariantId === selectedVariant?.id
              )}
              reviewStat={
                reviewStat.find((stat: any) => stat.id === selectedVariant?.id)
                  ?.reviewStat
              }
              loading={statsLoading}
              color={selectedColor}
            /> */}
            <div className="absolute opacity-0 pointer-events-none z-0">
              {visibleTags.map((tag: any, i: number) => (
                <span
                  key={i}
                  ref={(el) => {
                    if (el) tagRefs.current[i] = el;
                  }}
                  className="text-green md:text-12 text-10 inline-block mx-2"
                >
                  #{tag.label}
                </span>
              ))}
            </div>

            <div
              ref={tagsContainerRef}
              className="flex gap-6 overflow-hidden whitespace-nowrap max-w-full relative z-1"
            >
              {visibleTags
                .slice(0, visibleTagCount)
                .map((tag: any, i: number) => (
                  <span
                    key={i}
                    ref={(el) => {
                      if (el) tagRefs.current[i] = el;
                    }}
                    className="text-green md:text-12 text-10 inline-block radius-5 mx-2 my-1 pointer hover:underline lowercase"
                    onClick={() => {
                      console.log(selectedCategory);
                      //to be fixed later (on fix on the backend)
                      setSelectedCategory({
                        ...selectedCategory,
                        name: tag.label,
                      });
                    }}
                  >
                    #{tag.label}
                  </span>
                ))}
            </div>

            {isOverflowing && (
              <div ref={chevronRef}>
                <LuChevronRight
                  className="w-14 h-14 min-w-14 color-#0B9378 mt-6 cursor-pointer relative z-1"
                  onClick={() => setShowAllTags(true)}
                />
              </div>
            )}

            {showAllTags && (
              <div
                className="absolute b-3 r-5 sm:r-1 mt-6 bg-white g|box-shadow:0px|_|1px|_|3px|_|0px|_|rgba(0,0,0,0.1); radius-5 p-10 z-3"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-wrap gap-6 max-w-220">
                  {visibleTags.map((tag: any, i: number) => (
                    <span
                      key={i}
                      className="text-green text-12 lowercase pointer hover:underline"
                      onClick={() => {
                        console.log(selectedCategory);
                        //to be fixed later (on fix on the backend)
                        setSelectedCategory({
                          ...selectedCategory,
                          name: tag.label,
                        });
                      }}
                    >
                      #{tag.label}
                    </span>
                  ))}
                </div>

                {/* <p
                  className="text-10 text-grey mt-8 pointer"
                  onClick={() => setShowAllTags(false)}
                >
                  Close
                </p> */}
              </div>
            )}
          </div>
        </div>
      </div>
      {openSingleProductModal && (
        <ProductDetailModal
          openSingleProductModal={openSingleProductModal}
          handleCloseProductModal={handleCloseProductModal}
          position="homepage"
          variantSelectedImage={isToAddProperties ? selectedImage : ''}
          product={selectedVariant.product ?? product}
          variant={
            isToAddProperties
              ? {
                  ...selectedVariant,
                  product,
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

export default ProductTile;
