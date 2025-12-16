import classNames from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import Link from 'next/link';
import { Product, ProductVariant } from '../../utility/types/product.interface';
import { useCart } from '../../utility/hooks/use-cart';
import { checkMediaType, cx, formatNumberAsPrice } from '../../utility/utility';
import QuantitySelector from '../quantity-selector/QuantitySelector';
import Image from '../image/Image';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import useTransformProduct, {
  getVariantValue,
} from '../../utility/hooks/use-transform-product';
import colorNames from '@/modules/lib/utility/json-data/colors.json';
import VideoSrc from '../video-src/VideoSrc';

interface ProductDetailModalProp {
  openSingleProductModal: boolean;
  handleCloseProductModal: () => void;
  variant?: ProductVariant;
  product: Product;
  position: string;
  variantSelectedImage?: string;
}

const ProductDetailModal = ({
  product,
  variant,
  handleCloseProductModal,
  openSingleProductModal,
  position,
  variantSelectedImage,
}: ProductDetailModalProp) => {
  const {
    addToCart,
    cart,
    increment,
    decrement,
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

  const [selectedProperties, setSelectedProperties] = useState<
    Record<string, string>
  >(variant?.properties || {});

  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );

  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    variant?.media?.[0]?.url || product?.variants[0]?.media?.[0]?.url
  );
  const [imageSource, setImageSource] = useState<
    'default' | 'variant' | 'preview'
  >('default');

  const [isHover, setIsHover] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);

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

  const variantsForRequirementCheck = useMemo(() => {
    return filteredVariants.length > 0
      ? filteredVariants
      : (product?.variants ?? []);
  }, [filteredVariants, product?.variants]);

  const contextualRequiredProperties = useMemo(() => {
    const props = new Set<string>();

    variantsForRequirementCheck.forEach((variant) => {
      Object.keys(variant.properties || {}).forEach((key) => {
        props.add(key);
      });

      if (variant.size) {
        props.add('size');
      }
    });

    return Array.from(props);
  }, [variantsForRequirementCheck]);

  const hasSelectedAllRequiredProperties = useMemo(() => {
    return contextualRequiredProperties.every((prop) => activeFilters[prop]);
  }, [contextualRequiredProperties, activeFilters]);

  const isSelectionComplete = useMemo(() => {
    return hasSelectedAllRequiredProperties && filteredVariants.length === 1;
  }, [hasSelectedAllRequiredProperties, filteredVariants]);

  const selectedVariant = useMemo(() => {
    if (!isSelectionComplete) return undefined;
    return filteredVariants[0];
  }, [filteredVariants, isSelectionComplete]);

  useEffect(() => {
    if (!isSelectionComplete && imageSource === 'variant') {
      setSelectedImage(
        variant?.media?.[0]?.url || product?.variants[0]?.media?.[0]?.url
      );
      setImageSource('default');
    }
  }, [isSelectionComplete, imageSource, variant?.media, product?.variants]);

  useEffect(() => {
    if (selectedVariant?.media?.[0]?.url) {
      setSelectedImage(selectedVariant.media[0].url);
      setImageSource('variant');
    }
  }, [selectedVariant]);

  useEffect(() => {
    document.body.style.overflow = openSingleProductModal ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [openSingleProductModal]);

  useEffect(() => {
    if (!openSingleProductModal) return;

    if (variant) {
      const filters = buildFiltersFromVariant(variant);
      setActiveFilters(filters);

      const firstMedia = variant.media?.[0]?.url;
      if (firstMedia) {
        setSelectedImage(firstMedia);
        setImageSource('variant');
      }
    } else {
      setActiveFilters({});
      setSelectedImage(product?.variants[0]?.media?.[0]?.url);
      setImageSource('default');
    }
  }, [openSingleProductModal, variant]);

  const uniqueVariantsFromProductImages = variantSelectedImage
    ? [variant]
    : availableColors
        ?.map((color) => groupedData?.[color]?.[0])
        .filter(Boolean);

  const selectedVariantItemInCart = cart.cartItems.find(
    (item) => item.variant.id === selectedVariant?.id
  );

  const displayPrice = selectedVariant?.finalPrice || product?.finalPrice;
  const descriptionLength = product?.longDescription?.split(' ')?.length || 0;
  const maxDisplayDescLength = 20;
  const mediaType = checkMediaType(selectedImage ?? '') ?? 'image';

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
    setActiveFilters({});
    setSelectedImage(product.variants[0]?.media?.[0]?.url);
    setImageSource('default');
  };

  const handlePreviousImage = () => {
    if (!selectedVariant || !uniqueVariantsFromProductImages?.length) return;

    const index = uniqueVariantsFromProductImages.findIndex(
      (v) => v?.id === selectedVariant.id
    );
    const prev =
      index > 0
        ? uniqueVariantsFromProductImages[index - 1]
        : uniqueVariantsFromProductImages[
            uniqueVariantsFromProductImages.length - 1
          ];

    setSelectedProperties(prev?.properties);
  };

  const handleNextImage = () => {
    if (!selectedVariant || !uniqueVariantsFromProductImages?.length) return;

    const index = uniqueVariantsFromProductImages.findIndex(
      (v) => v?.id === selectedVariant.id
    );
    const next =
      uniqueVariantsFromProductImages[
        (index + 1) % uniqueVariantsFromProductImages.length
      ];

    setSelectedProperties(next?.properties);
  };

  const buildFiltersFromVariant = (variant: ProductVariant) => {
    const filters: Record<string, string> = {};

    Object.entries(variant.properties || {}).forEach(([key, value]) => {
      if (value) {
        filters[key] = String(value);
      }
    });

    if (variant.size) {
      filters.size = String(variant.size);
    }

    return filters;
  };

  return (
    <div>
      {openSingleProductModal && (
        <>
          <div
            className="fixed inset-0 bg-#00000073 w-100p h-100p z-10 block"
            onClick={handleCloseProductModal}
          >
            <>
              <div className="relative no-scrollbar w-full h-full flex flex-col j-content-center a-items-center">
                <div
                  className={`fixed bg-white z-20 w-94p sm:w-80p l:w-65p  xl:w-50p  radius-8 no-scrollbar`}
                  style={{
                    height: 'fit-content',
                    maxHeight: 'calc(100vh - 80px)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="overflow-hidden no-scrollbar relative"
                    style={{
                      height: 'fit-content',
                      maxHeight: 'calc(100vh - 80px)',
                    }}
                  >
                    <div className="flex j-content-end text-right p-10 w-full bg-white z-10 radius-6">
                      <IoMdClose
                        className="sm:w-25 w-20 sm:h-25 h-20 pointer"
                        onClick={handleCloseProductModal}
                      />
                    </div>
                    <div
                      className="overflow-auto no-scrollbar pb-20"
                      style={{
                        height: 'fit-content',
                        maxHeight: 'calc(100vh - 100px)',
                      }}
                    >
                      <div className="l:flex grid  j-content-center gap-30 sm:px-30 px-10 pb-30 overflow-auto">
                        <div className="l:w-50p w-full  overflow-hidden">
                          <div className="w-100p">
                            <div className="flex flex-col gap-20">
                              <div
                                className="relative"
                                onMouseOver={() => setIsHover(true)}
                                onMouseOut={() => setIsHover(false)}
                              >
                                {isHover &&
                                  position === 'homepage' &&
                                  !variantSelectedImage && (
                                    <div
                                      className={`absolute z-10 b-45p ${(product?.variants?.length || 0) > 1 ? 'bg-white color-black pointer' : 'color-#A9A9A9 bg-#D3D3D3 cursor-not-allowed'} l-20  p-15 radius-99 flex a-items-center j-content-center icon-box-shadow`}
                                      onClick={handlePreviousImage}
                                    >
                                      <MdArrowBackIos className="w-full relative l-3" />
                                    </div>
                                  )}
                                <div
                                  className={`w-full ${variantSelectedImage ? 'l:h-400 h-250' : 'h-350'}`}
                                >
                                  {mediaType === 'image' ? (
                                    <Image
                                      ref={imgRef}
                                      src={selectedImage ?? ''}
                                      alt={product?.name || 'Product'}
                                      className={`object-fit w-full h-full ${selectedVariant?.status === 'OUT_OF_STOCK' ? 'greyscale' : ''}`}
                                      width={10000}
                                    />
                                  ) : (
                                    <VideoSrc
                                      className={`object-fit w-full h-full ${selectedVariant?.status === 'OUT_OF_STOCK' ? 'greyscale' : ''}`}
                                      src={selectedImage ?? ''}
                                    />
                                  )}
                                </div>

                                {isHover &&
                                  position === 'homepage' &&
                                  !variantSelectedImage && (
                                    <div
                                      className={`absolute z-10 b-45p ${(product?.variants?.length || 0) > 1 ? 'bg-white color-black pointer' : 'color-#A9A9A9 bg-#D3D3D3 cursor-not-allowed'} r-20 p-15 radius-99 flex a-items-center j-content-center icon-box-shadow `}
                                      onClick={handleNextImage}
                                    >
                                      <MdArrowForwardIos className="w-fit" />
                                    </div>
                                  )}
                              </div>
                              {!variantSelectedImage &&
                                (uniqueVariantsFromProductImages?.length ?? 0) >
                                  0 && (
                                  <div className="flex gap-10 py-5 overflow-x-auto a-items-center no-scrollbar w-full">
                                    {uniqueVariantsFromProductImages.map(
                                      (vari) =>
                                        vari?.media?.map((mediaItem: any) => (
                                          <div
                                            key={`${vari.id}-${mediaItem.url}`}
                                            onClick={() => {
                                              const isSameVariant =
                                                selectedVariant?.id === vari.id;
                                              const isSameImage =
                                                selectedImage === mediaItem.url;

                                              if (
                                                isSameVariant &&
                                                isSameImage
                                              ) {
                                                resetToDefault();
                                                return;
                                              }

                                              setActiveFilters(
                                                buildFiltersFromVariant(vari)
                                              );
                                              setSelectedImage(mediaItem.url);
                                              setImageSource('preview');
                                            }}
                                            className="w-90 min-w-90 h-90 pointer"
                                          >
                                            {mediaType === 'image' ? (
                                              <Image
                                                src={mediaItem.url}
                                                alt="product-image"
                                                className={cx(
                                                  `object-fit w-full h-full overflow-hidden ${
                                                    vari.status ===
                                                    'OUT_OF_STOCK'
                                                      ? 'greyscale'
                                                      : ''
                                                  }`,
                                                  {
                                                    'border border-green border-2':
                                                      selectedVariant?.media.find(
                                                        (img) =>
                                                          img.url ===
                                                          mediaItem.url
                                                      ),
                                                  }
                                                )}
                                                width={10000}
                                              />
                                            ) : (
                                              <VideoSrc
                                                src={mediaItem.url}
                                                className={cx(
                                                  `object-fit w-full h-full overflow-hidden ${
                                                    vari.status ===
                                                    'OUT_OF_STOCK'
                                                      ? 'greyscale'
                                                      : ''
                                                  }`,
                                                  {
                                                    'border border-green border-2':
                                                      selectedVariant?.media.find(
                                                        (img) =>
                                                          img.url ===
                                                          mediaItem.url
                                                      ),
                                                  }
                                                )}
                                              />
                                            )}
                                          </div>
                                        ))
                                    )}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>

                        <div className="l:w-50p w-full">
                          <div className="flex flex-col gap-10">
                            <p className="weight-400">
                              {product?.name} -{' '}
                              {product?.longDescription
                                ?.split(' ')
                                ?.slice(0, maxDisplayDescLength)
                                .join(' ')}
                              {descriptionLength > maxDisplayDescLength
                                ? '...'
                                : ''}
                            </p>
                            <div>
                              <p className="weight-400 text-grey-500 text-14">
                                {' '}
                                sold by {product?.store?.name}{' '}
                              </p>
                            </div>
                            <p className="weight-400"> in {product?.type} </p>
                            <p className="weight-600 text-30 text-black">
                              {' '}
                              {formatNumberAsPrice(displayPrice || 0)}{' '}
                            </p>
                            {/* <p className="weight-600 text-13 text-black capitalize">
                                {' '}
                                Color: {selectedVariant?.properties?.color}{' '}
                              </p> */}
                          </div>

                          <div className="mt-10 flex flex-col">
                            {allPropertiesWithSize.color?.length > 0 && (
                              <div className="mt-12">
                                <p className="text-left text-14 weight-400">
                                  Select color:
                                </p>

                                <div className="mt-10 flex gap-6 a-items-center">
                                  {allPropertiesWithSize.color.map((color) => {
                                    const hex =
                                      colorMap[color.replaceAll(' ', '')];
                                    const active =
                                      activeFilters.color === color;
                                    const compatible = isOptionCompatible(
                                      'color',
                                      color
                                    );

                                    return (
                                      <div
                                        key={color}
                                        onClick={() =>
                                          toggleFilter('color', color)
                                        }
                                        className={classNames(
                                          'w-32 h-32 round border transition',
                                          {
                                            'border-2 border-black': active,
                                            'opacity-40 cursor-not-allowed':
                                              !compatible,
                                          }
                                        )}
                                        style={{ background: hex || color }}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {Object.entries(allPropertiesWithSize).map(
                              ([prop, values]) => {
                                if (prop === 'color') return null;

                                return (
                                  <div key={prop} className="mt-12">
                                    <p className="text-left text-12 weight-400 color-#000000B2 mb-12">
                                      Select {prop}:
                                    </p>

                                    <div className="flex gap-6 overflow-auto">
                                      {values.map((value) => {
                                        const active =
                                          activeFilters[prop] === value;
                                        const compatible = isOptionCompatible(
                                          prop,
                                          value
                                        );

                                        return (
                                          <button
                                            key={value}
                                            onClick={() =>
                                              toggleFilter(prop, value)
                                            }
                                            className={cx(
                                              'px-10 py-7 radius-6 border-2 transition whitespace-nowrap text-12',
                                              active &&
                                                'bg-#DEFFF9! color-#0B9378! border-#0B9378',
                                              !active &&
                                                compatible &&
                                                'bg-#F3F3F3',
                                              !compatible &&
                                                'bg-#F3F3F3 opacity-40 cursor-not-allowed'
                                            )}
                                          >
                                            {value}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              }
                            )}

                            <div className="grid mt-20 mb-10 gap-10">
                              {!selectedVariantItemInCart ? (
                                <button
                                  className={classNames(
                                    'disabled:bg-#F3F3F3 disabled:cursor-not-allowed pointer font-roboto text-grey-900 border-hidden px-10 py-10 radius-5 l:px-22 l:py-12 l:radius-10',
                                    {
                                      'bg-#F3F3F3':
                                        selectedVariant &&
                                        selectedVariant.status ===
                                          'OUT_OF_STOCK',
                                      'bg-#0B9378':
                                        selectedVariant &&
                                        selectedVariant.status !==
                                          'OUT_OF_STOCK',
                                    }
                                  )}
                                  disabled={
                                    !selectedVariant ||
                                    selectedVariant.status === 'OUT_OF_STOCK'
                                  }
                                  onClick={() => {
                                    if (isAuthenticated) {
                                      if (
                                        !localStorage.getItem('seenMiniCart')
                                      ) {
                                        window.dispatchEvent(
                                          new Event('showMiniCartOnboarding')
                                        );
                                        localStorage.setItem(
                                          'seenMiniCart',
                                          'true'
                                        );
                                      }
                                      if (
                                        selectedVariant &&
                                        selectedVariant.status !==
                                          'OUT_OF_STOCK'
                                      ) {
                                        addToCart(
                                          selectedVariant?.id ?? '0',
                                          selectedVariant?.minPurchaseQuantity ||
                                            1
                                        );
                                      }
                                    } else {
                                      localStorage.setItem(
                                        'variantId',
                                        selectedVariant?.id.toString() ?? '0'
                                      );
                                      localStorage.setItem(
                                        'variantIdMinimumPurchase',
                                        selectedVariant?.minPurchaseQuantity.toString() ||
                                          '1'
                                      );
                                      isLoginModal();
                                    }
                                  }}
                                >
                                  <div
                                    className={classNames(
                                      `l:block weight-500 ${selectedVariant && selectedVariant.status === 'OUT_OF_STOCK' ? 'color-black' : 'color-white'}`
                                    )}
                                  >
                                    {!selectedVariant
                                      ? 'Select options'
                                      : selectedVariant.status ===
                                          'OUT_OF_STOCK'
                                        ? 'Out of stock'
                                        : 'Add to cart'}
                                  </div>
                                </button>
                              ) : (
                                <div className="mb-10">
                                  <QuantitySelector
                                    decrement={() =>
                                      decrement(selectedVariantItemInCart)
                                    }
                                    increment={() =>
                                      increment(selectedVariantItemInCart)
                                    }
                                    cartItem={selectedVariantItemInCart}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="text-left text-12 flex a-items-center weight-400">
                              <Link
                                href={`/products/${product?.slug}`}
                                className="cursor-pointer flex a-items-center"
                                onClick={handleCloseProductModal}
                              >
                                <span>All details</span>
                                <MdArrowForwardIos className="w-fit mt-2" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetailModal;
