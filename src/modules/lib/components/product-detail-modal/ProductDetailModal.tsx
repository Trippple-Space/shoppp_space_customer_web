import classNames from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import Link from 'next/link';
import { Product, ProductVariant } from '../../utility/types/product.interface';
import { useCart } from '../../utility/hooks/use-cart';
import { cx, formatNumberAsPrice } from '../../utility/utility';
import QuantitySelector from '../quantity-selector/QuantitySelector';
import Image from '../image/Image';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import useTransformProduct, {
  buildFiltersFromVariant,
  getVariantValue,
  requiredKeysForVariant,
} from '../../utility/hooks/use-transform-product';
import colorNames from '@/modules/lib/utility/json-data/colors.json';
import VideoSrc from '../video-src/VideoSrc';
import {
  buildUserConfigurations,
  DisplayProductConfigurations,
  isEmptyValue,
} from './productConfigurationsHelper';
import { createPortal } from 'react-dom';

interface ProductDetailModalProp {
  openSingleProductModal: boolean;
  handleCloseProductModal: () => void;
  variant?: ProductVariant;
  product?: Product;
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

  const imgRef = useRef<HTMLImageElement>(null);
  const didInitFromVariantRef = useRef(false);

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

  const selectedVariantItemInCart = cart.cartItems.find(
    (item) => item.variant.id === selectedVariant?.id
  );

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
    if (imageSource === 'preview') {
      const isCurrentMediaInVariant = selectedVariant.media?.some(
        (m: { url?: string }) => m.url === selectedImage
      );
      if (isCurrentMediaInVariant) return;
    }
    setSelectedImage(selectedVariant.media[0].url);
    setImageSource('variant');
    setSelectedMediaType(selectedVariant.media[0]?.type);
  }, [selectedVariant, imageSource, selectedImage]);

  useEffect(() => {
    document.body.style.overflow = openSingleProductModal ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
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

  const displayPrice = selectedVariant?.finalPrice || product?.finalPrice;
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
    if (!uniqueVariantsFromProductImages?.length) return;

    let currentIndex = uniqueVariantsFromProductImages.findIndex((v) =>
      v?.media?.some((m) => m.url === selectedImage)
    );
    if (currentIndex === -1 && selectedVariant) {
      currentIndex = uniqueVariantsFromProductImages.findIndex(
        (v) => v?.id === selectedVariant?.id
      );
    }

    const prevIndex =
      currentIndex >= 0 && currentIndex > 0
        ? currentIndex - 1
        : uniqueVariantsFromProductImages.length - 1;

    const prevVariant = uniqueVariantsFromProductImages[prevIndex];

    if (!prevVariant) return;

    const firstMedia = prevVariant.media?.[0];
    setForcedVariantId(prevVariant.id);
    setActiveFilters(buildFiltersFromVariant(prevVariant));
    setSelectedImage(firstMedia?.url);
    setSelectedMediaType(firstMedia?.type);
    setImageSource('variant');
  };

  const handleNextImage = () => {
    if (!uniqueVariantsFromProductImages?.length) return;

    let currentIndex = uniqueVariantsFromProductImages.findIndex((v) =>
      v?.media?.some((m) => m.url === selectedImage)
    );
    if (currentIndex === -1 && selectedVariant) {
      currentIndex = uniqueVariantsFromProductImages.findIndex(
        (v) => v?.id === selectedVariant?.id
      );
    }

    const nextIndex =
      currentIndex >= 0
        ? (currentIndex + 1) % uniqueVariantsFromProductImages.length
        : 0;

    const nextVariant = uniqueVariantsFromProductImages[nextIndex];

    if (!nextVariant) return;

    const firstMedia = nextVariant.media?.[0];
    setForcedVariantId(nextVariant.id);
    setActiveFilters(buildFiltersFromVariant(nextVariant));
    setSelectedImage(firstMedia?.url);
    setSelectedMediaType(firstMedia?.type);
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

  if (!openSingleProductModal) return null;

  return createPortal(
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
                            {(isHover || selectedMediaType === 'video') &&
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
                              className={`w-full ${variantSelectedImage ? 'l:h-400 h-250' : 'h-350'} relative`}
                            >
                              {selectedMediaType === 'image' || !selectedMediaType ? (
                                <Image
                                  ref={imgRef}
                                  src={selectedImage ?? ''}
                                  alt={product?.name || 'Product'}
                                  style={{ objectFit: 'contain' }}
                                  className={`w-full h-full ${selectedVariant?.status === 'OUT_OF_STOCK' ? 'greyscale' : ''}`}
                                  width={10000}
                                  hasLoader={true}
                                />
                              ) : (
                                <VideoSrc
                                  /* style={{ objectFit: 'contain' }} */
                                  className={`w-full h-full ${selectedVariant?.status === 'OUT_OF_STOCK' ? 'greyscale' : ''}`}
                                  src={selectedImage ?? ''}
                                  hasLoader={true}
                                />
                              )}
                            </div>

                            {(isHover || selectedMediaType === 'video') &&
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
                                {uniqueVariantsFromProductImages.map((vari) =>
                                  vari?.media?.map((mediaItem: any) => (
                                    <div
                                      key={`${vari.id}-${mediaItem.url}`}
                                      onClick={() => {
                                        const isSameVariant =
                                          selectedVariant?.id === vari.id;
                                        const isSameImage =
                                          selectedImage === mediaItem.url;

                                        if (isSameVariant && isSameImage) {
                                          resetToDefault();
                                          return;
                                        }

                                        setForcedVariantId(vari.id);
                                        setActiveFilters(
                                          buildFiltersFromVariant(vari)
                                        );
                                        setSelectedImage(mediaItem.url);
                                        setImageSource('preview');
                                        setSelectedMediaType(mediaItem?.type);
                                      }}
                                      className="w-90 min-w-90 h-90 pointer relative"
                                    >
                                      {mediaItem?.type === 'image' ? (
                                        <Image
                                          src={mediaItem.url}
                                          alt="product-image"
                                          className={cx(
                                            `object-fit w-full h-full overflow-hidden ${vari.status === 'OUT_OF_STOCK'
                                              ? 'greyscale'
                                              : ''
                                            }`,
                                            {
                                              'border border-green border-2':
                                                selectedVariant?.media.find(
                                                  (img) =>
                                                    img.url === mediaItem.url
                                                ),
                                            }
                                          )}
                                          width={10000}
                                          hasLoader={true}
                                        />
                                      ) : (
                                        <VideoSrc
                                          src={mediaItem.url}
                                          className={cx(
                                            `object-fit w-full h-full overflow-hidden ${vari.status === 'OUT_OF_STOCK'
                                              ? 'greyscale'
                                              : ''
                                            }`,
                                            {
                                              'border border-green border-2':
                                                selectedVariant?.media.find(
                                                  (img) =>
                                                    img.url === mediaItem.url
                                                ),
                                            }
                                          )}
                                          hasLoader={true}
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
                            sold by{' '}
                            <Link
                              href={`/${product?.store?.slug}`}
                              target="_blank"
                            >
                              {product?.store?.name}
                            </Link>{' '}
                          </p>
                        </div>
                        <p className="weight-400"> in {product?.type} </p>
                        <p className="weight-600 text-30 text-black">
                          {' '}
                          {formatNumberAsPrice(displayPrice || 0)}{' '}
                        </p>
                      </div>

                      <div className="mt-10 flex flex-col">
                        {allPropertiesWithSize?.color?.filter(
                          (v) => v.trim() !== ''
                        )?.length > 0 && (
                            <div className="mt-12">
                              <p className="text-left text-14 weight-400">
                                Select color:
                              </p>

                              <div className="mt-10 flex gap-6 a-items-center overflow-auto no-scrollbar">
                                {allPropertiesWithSize?.color.map((color) => {
                                  const hex = colorMap[color.replaceAll(' ', '')];
                                  const active = activeFilters.color === color;
                                  const compatible = isOptionCompatible(
                                    'color',
                                    color
                                  );

                                  return (
                                    <div
                                      key={color}
                                      onClick={() => toggleFilter('color', color)}
                                      className={classNames(
                                        'w-32 min-w-32 h-32 round border transition',
                                        {
                                          'border-3 border-#0B9378 border-solid':
                                            active,
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
                            const cleanValues = values.filter(
                              (v) => v.trim() !== ''
                            );

                            if (cleanValues.length === 0) return null;

                            return (
                              <div key={prop} className="mt-12">
                                <p className="text-left text-12 weight-400 color-#000000B2 mb-12">
                                  Select {prop}:
                                </p>

                                <div className="flex gap-6 overflow-auto no-scrollbar">
                                  {values.map((value) => {
                                    const active =
                                      activeFilters[prop] === value;
                                    const compatible = isOptionCompatible(
                                      prop,
                                      value
                                    );

                                    if (value === '') return;

                                    return (
                                      <button
                                        key={value}
                                        onClick={() =>
                                          toggleFilter(prop, value)
                                        }
                                        className={cx(
                                          'px-10 py-7 radius-6 border transition whitespace-nowrap text-12',
                                          active &&
                                          'bg-#DEFFF9! color-#0B9378! border-3 border-#0B9378 border-solid',
                                          !active && compatible && 'bg-#F3F3F3',
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

                        {!selectedVariant &&
                          (missingRequiredOptions.length > 0 ||
                            initialMissingOptions.length > 0) && (
                            <div className="flex flex-col gap-6 p-10 radius-6 bg-#FFF7E6 border border-#FFD699 mt-20">
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

                        {selectedVariant?.status !== 'OUT_OF_STOCK' && (
                          <div className="mt-20">
                            <DisplayProductConfigurations
                              configurationRecords={configurationRecords}
                              configurationValues={configurationValues}
                              handleConfigChange={handleConfigChange}
                              userConfigurations={
                                selectedVariantItemInCart?.userConfigurations
                              }
                              isEditingConfiguration={isEditingConfiguration}
                              onEditConfiguration={() =>
                                setIsEditingConfiguration(true)
                              }
                            />
                          </div>
                        )}

                        <div className="grid mt-20 mb-10 gap-10">
                          {!selectedVariantItemInCart ? (
                            <button
                              className={classNames(
                                'disabled:bg-#F3F3F3 disabled:cursor-not-allowed pointer font-roboto text-grey-900 border-hidden px-10 py-10 radius-5 l:px-22 l:py-12 l:radius-10',
                                {
                                  'bg-#F3F3F3':
                                    selectedVariant &&
                                    selectedVariant.status === 'OUT_OF_STOCK',
                                  'bg-#0B9378':
                                    selectedVariant &&
                                    selectedVariant.status !== 'OUT_OF_STOCK',
                                }
                              )}
                              disabled={
                                !selectedVariant ||
                                selectedVariant.status === 'OUT_OF_STOCK' ||
                                !areRequiredCustomerFieldsFilled
                              }
                              onClick={() => {
                                if (isAuthenticated) {
                                  if (!localStorage.getItem('seenMiniCart')) {
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
                                    selectedVariant.status !== 'OUT_OF_STOCK'
                                  ) {
                                    addToCart(
                                      selectedVariant?.id ?? '0',
                                      selectedVariant?.minPurchaseQuantity || 1,
                                      userConfigurations
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
                                  if (userConfigurations) {
                                    localStorage.setItem(
                                      'userConfigurations',
                                      JSON.stringify(userConfigurations)
                                    );
                                  }
                                  isLoginModal();
                                }
                              }}
                            >
                              <div
                                className={classNames(
                                  `l:block weight-500 ${selectedVariant ? (selectedVariant.status === 'OUT_OF_STOCK' ? 'color-black' : 'color-white') : 'color-gray'}`
                                )}
                              >
                                {!selectedVariant
                                  ? 'Add to cart'
                                  : selectedVariant.status === 'OUT_OF_STOCK'
                                    ? 'Out of stock'
                                    : 'Add to cart'}
                              </div>
                            </button>
                          ) : (
                            <div className="mb-10">
                              <QuantitySelector
                                decrement={() =>
                                  decrement(
                                    selectedVariantItemInCart,
                                    userConfigurations
                                  )
                                }
                                increment={() =>
                                  increment(
                                    selectedVariantItemInCart,
                                    userConfigurations
                                  )
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
    </>,
    document.body
  );
};

export default ProductDetailModal;
