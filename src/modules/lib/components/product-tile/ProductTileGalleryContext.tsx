'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Product, ProductVariant } from '../../utility/types/product.interface';
import { CartItem } from '../../utility/types/cart.interface';
import {
  buildPageGallerySlides,
  buildProductGalleryRanges,
  PageGallerySlide,
} from '../../utility/product-media';
import ProductMediaGallery from './ProductMediaGallery';
import ShareProductModal from '@/modules/views/product-details/share-modal/shareProductModal';

export interface ProductTileGalleryApi {
  isSavedForVariant?: (variantId: string) => boolean;
  onToggleSaveVariant?: (variantId: string) => void;
  getCartItemForVariant?: (variant: ProductVariant) => CartItem | undefined;
  variantNeedsQuickLook?: (variant: ProductVariant) => boolean;
  onGalleryAddToCart?: (variant: ProductVariant) => void;
  onGalleryOpenQuickLook?: (variant: ProductVariant, mediaUrl: string) => void;
  onIncrementCartItem?: (cartItem: CartItem) => void;
  onDecrementCartItem?: (cartItem: CartItem) => void;
  isAuthenticated?: boolean;
  onAuthRequired?: () => void;
}

interface ProductTileGalleryContextValue {
  registerGalleryApi: (productId: string, api: ProductTileGalleryApi) => void;
  unregisterGalleryApi: (productId: string) => void;
  openGallery: (productId: string, mediaUrl?: string) => void;
  isGalleryOpen: boolean;
  bumpGalleryRevision: () => void;
}

const ProductTileGalleryContext =
  createContext<ProductTileGalleryContextValue | null>(null);

export function useProductTileGallery() {
  return useContext(ProductTileGalleryContext);
}

export function useRegisterProductTileGalleryApi(
  productId: string | undefined,
  api: ProductTileGalleryApi
) {
  const gallery = useProductTileGallery();

  useEffect(() => {
    if (!gallery || !productId) return;
    gallery.registerGalleryApi(productId, api);
    return () => gallery.unregisterGalleryApi(productId);
  }, [gallery, productId, api]);
}

export function ProductTileGalleryProvider({
  products,
  children,
}: {
  products: Product[];
  children: React.ReactNode;
}) {
  const apisRef = useRef(new Map<string, ProductTileGalleryApi>());
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [galleryRevision, setGalleryRevision] = useState(0);

  const bumpGalleryRevision = useCallback(() => {
    setGalleryRevision((revision) => revision + 1);
  }, []);

  const slides = useMemo(() => buildPageGallerySlides(products), [products]);
  const galleryRanges = useMemo(
    () => buildProductGalleryRanges(slides),
    [slides]
  );

  const registerGalleryApi = useCallback(
    (productId: string, api: ProductTileGalleryApi) => {
      apisRef.current.set(productId, api);
    },
    []
  );

  const unregisterGalleryApi = useCallback((productId: string) => {
    apisRef.current.delete(productId);
  }, []);

  const openGallery = useCallback(
    (productId: string, mediaUrl?: string) => {
      if (!slides.length) return;

      let index = slides.findIndex((slide) => slide.productId === productId);
      if (mediaUrl) {
        const specificIndex = slides.findIndex(
          (slide) => slide.productId === productId && slide.url === mediaUrl
        );
        if (specificIndex >= 0) index = specificIndex;
      }

      setGalleryIndex(index >= 0 ? index : 0);
      setGalleryOpen(true);
    },
    [slides]
  );

  const closeGallery = useCallback(() => {
    setGalleryOpen(false);
    setShowShareModal(false);
  }, []);

  const currentSlide = slides[galleryIndex] as PageGallerySlide | undefined;

  const resolveCurrentApi = useCallback(() => {
    if (!currentSlide) return undefined;
    return apisRef.current.get(currentSlide.productId);
  }, [currentSlide]);

  const getCartItemForVariant = useCallback(
    (variant: ProductVariant) => resolveCurrentApi()?.getCartItemForVariant?.(variant),
    [resolveCurrentApi, galleryIndex, galleryRevision]
  );

  const isSavedForVariant = useCallback(
    (variantId: string) =>
      resolveCurrentApi()?.isSavedForVariant?.(variantId) ?? false,
    [resolveCurrentApi, galleryIndex, galleryRevision]
  );

  const onToggleSaveVariant = useCallback(
    (variantId: string) => resolveCurrentApi()?.onToggleSaveVariant?.(variantId),
    [resolveCurrentApi, galleryIndex]
  );

  const variantNeedsQuickLook = useCallback(
    (variant: ProductVariant) =>
      resolveCurrentApi()?.variantNeedsQuickLook?.(variant) ?? false,
    [resolveCurrentApi, galleryIndex]
  );

  const onGalleryAddToCart = useCallback(
    (variant: ProductVariant) =>
      resolveCurrentApi()?.onGalleryAddToCart?.(variant),
    [resolveCurrentApi, galleryIndex]
  );

  const onGalleryOpenQuickLook = useCallback(
    (variant: ProductVariant, mediaUrl: string) =>
      resolveCurrentApi()?.onGalleryOpenQuickLook?.(variant, mediaUrl),
    [resolveCurrentApi, galleryIndex]
  );

  const onIncrementCartItem = useCallback(
    (cartItem: CartItem) =>
      resolveCurrentApi()?.onIncrementCartItem?.(cartItem),
    [resolveCurrentApi, galleryIndex]
  );

  const onDecrementCartItem = useCallback(
    (cartItem: CartItem) =>
      resolveCurrentApi()?.onDecrementCartItem?.(cartItem),
    [resolveCurrentApi, galleryIndex]
  );

  const requireAuthForSave = !resolveCurrentApi()?.isAuthenticated;
  const onAuthRequired = () => resolveCurrentApi()?.onAuthRequired?.();

  const contextValue = useMemo(
    () => ({
      registerGalleryApi,
      unregisterGalleryApi,
      openGallery,
      isGalleryOpen: galleryOpen,
      bumpGalleryRevision,
    }),
    [
      registerGalleryApi,
      unregisterGalleryApi,
      openGallery,
      galleryOpen,
      bumpGalleryRevision,
    ]
  );

  return (
    <ProductTileGalleryContext.Provider value={contextValue}>
      {children}
      {slides.length > 0 && (
        <>
          <ProductMediaGallery
            isOpen={galleryOpen}
            onClose={closeGallery}
            slides={slides}
            initialIndex={galleryIndex}
            onIndexChange={setGalleryIndex}
            enableCrossProductPrompts={galleryRanges.length > 1}
            isSavedForVariant={isSavedForVariant}
            onToggleSaveVariant={onToggleSaveVariant}
            requireAuthForSave={requireAuthForSave}
            onAuthRequired={onAuthRequired}
            onShare={() => setShowShareModal(true)}
            getCartItemForVariant={getCartItemForVariant}
            variantNeedsQuickLook={variantNeedsQuickLook}
            onAddToCart={onGalleryAddToCart}
            onOpenQuickLook={onGalleryOpenQuickLook}
            onIncrementCartItem={onIncrementCartItem}
            onDecrementCartItem={onDecrementCartItem}
          />
          <ShareProductModal
            modalOpen={showShareModal}
            handleCloseModal={() => setShowShareModal(false)}
            modalZIndex={10001}
          />
        </>
      )}
    </ProductTileGalleryContext.Provider>
  );
}
