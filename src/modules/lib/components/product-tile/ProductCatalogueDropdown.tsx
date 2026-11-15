'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaCirclePlay } from 'react-icons/fa6';
import { Product, ProductCatalogue, ProductVariant } from '../../utility/types/product.interface';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  size,
  limitShift,
  useHover,
  useDismiss,
  useInteractions,
  safePolygon,
  FloatingPortal,
} from '@floating-ui/react';
import Image from '../image/Image';
import ProductMediaGallery from './ProductMediaGallery';
import ShareProductModal from '@/modules/views/product-details/share-modal/shareProductModal';
import {
  buildProductGallerySlides,
  VariantMediaPreviewItem,
} from '../../utility/product-media';
import { CartItem } from '../../utility/types/cart.interface';
import catalogueStyles from './product-catalogue-dropdown.module.css';
import { useProductTileGallery } from './ProductTileGalleryContext';

export function CatalogueMediaItem({
  item,
  onClick,
}: {
  item: ProductCatalogue;
  onClick?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (item.mediaType !== 'video' || !videoRef.current) return;
    const el = videoRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.play().catch(() => { });
          } else {
            el.pause();
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [item.mediaType, item.id]);

  if (item.mediaType === 'video') {
    return (
      <div
        className={catalogueStyles.catalogueMediaItem}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
      >
        <div className={catalogueStyles.catalogueMediaItemMedia}>
          <video
            ref={videoRef}
            src={item.mediaUrl}
            muted
            loop
            playsInline
            className="w-full h-full block object-cover"
            style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
          />
          <span className={catalogueStyles.catalogueMediaItemOverlay} aria-hidden />
        </div>
      </div>
    );
  }

  return (
    <div
      className={catalogueStyles.catalogueMediaItem}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      <div className={catalogueStyles.catalogueMediaItemMedia}>
        <Image
          ref={imgRef}
          className={`absolute w-full h-full self-center object-cover`}
          src={item.mediaUrl}
          alt={item.caption ?? 'Catalogue'}
          hasLoader={true}
          width={10000}
        />
        <span className={catalogueStyles.catalogueMediaItemOverlay} aria-hidden />
      </div>
    </div>
  );
}

export interface ProductCatalogueDropdownProps {
  productCatalogues?: ProductCatalogue[] | null;
  variantPreviewItems?: VariantMediaPreviewItem[];
  product?: Product;
  isAuthenticated?: boolean;
  onAuthRequired?: () => void;
  onGalleryOpenChange?: (open: boolean) => void;
  isSavedForVariant?: (variantId: string) => boolean;
  onToggleSaveVariant?: (variantId: string) => void;
  getCartItemForVariant?: (variant: ProductVariant) => CartItem | undefined;
  variantNeedsQuickLook?: (variant: ProductVariant) => boolean;
  onGalleryAddToCart?: (variant: ProductVariant) => void;
  onGalleryOpenQuickLook?: (variant: ProductVariant, mediaUrl: string) => void;
  onIncrementCartItem?: (cartItem: CartItem) => void;
  onDecrementCartItem?: (cartItem: CartItem) => void;
}

export function ProductCatalogueDropdown({
  productCatalogues,
  variantPreviewItems = [],
  product,
  isAuthenticated = false,
  onAuthRequired,
  onGalleryOpenChange,
  isSavedForVariant,
  onToggleSaveVariant,
  getCartItemForVariant,
  variantNeedsQuickLook,
  onGalleryAddToCart,
  onGalleryOpenQuickLook,
  onIncrementCartItem,
  onDecrementCartItem,
}: ProductCatalogueDropdownProps) {
  const pageGallery = useProductTileGallery();
  const [open, setOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const usePageGallery = !!pageGallery;

  const cataloguesSorted = useMemo(() => {
    const list = productCatalogues ?? [];
    if (!list.length) return [];
    return [...list].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [productCatalogues]);

  const gallerySlides = useMemo(
    () =>
      buildProductGallerySlides(
        variantPreviewItems,
        productCatalogues,
        product?.variants?.[0]
      ),
    [variantPreviewItems, productCatalogues, product?.variants]
  );

  useEffect(() => {
    onGalleryOpenChange?.(usePageGallery ? pageGallery.isGalleryOpen : galleryOpen);
  }, [
    galleryOpen,
    onGalleryOpenChange,
    pageGallery?.isGalleryOpen,
    usePageGallery,
  ]);

  const openGalleryAt = (mediaUrl: string) => {
    if (usePageGallery && product?.id) {
      pageGallery.openGallery(product.id, mediaUrl);
      setOpen(false);
      return;
    }

    const idx = gallerySlides.findIndex((slide) => slide.url === mediaUrl);
    setGalleryIndex(idx >= 0 ? idx : 0);
    setGalleryOpen(true);
    setOpen(false);
  };

  const openFullGallery = () => {
    if (usePageGallery && product?.id) {
      pageGallery.openGallery(product.id);
      setOpen(false);
      return;
    }

    setGalleryIndex(0);
    setGalleryOpen(true);
    setOpen(false);
  };

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'top-start',
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({
        fallbackPlacements: ['top-end', 'bottom-end', 'bottom-start'],
      }),
      shift({ padding: 8, limiter: limitShift() }),
      size({
        padding: 8,
        apply({ availableWidth, elements }) {
          const width = Math.min(Math.max(availableWidth, 180), 480);
          Object.assign(elements.floating.style, {
            width: `${width}px`,
            maxWidth: `${width}px`,
          });
        },
      }),
    ],
  });
  const hover = useHover(context, {
    handleClose: safePolygon(),
  });
  const dismiss = useDismiss(context, { outsidePress: true });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, dismiss]);

  if (cataloguesSorted.length === 0) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        ref={refs.setReference}
        {...getReferenceProps({
          onClick(event) {
            event.preventDefault();
            openFullGallery();
          },
        })}
        className="lg:w-[35.2px] lg:min-w-[35.2px] lg:h-[35.2px] w-[31px] min-w-[31px] h-[31px] flex items-center justify-center rounded-[3px] md:rounded-[4px] border border-[#00000014] outline-none bg-[#00000006] hover:bg-[#0000000D] transition-colors shrink-0"
        aria-label="Open product media gallery"
      >
        <FaCirclePlay className="lg:w-[18px] w-[16px] lg:h-[18px] h-[16px] text-[#0357EE] ml-[1px]" />
      </button>
      <FloatingPortal>
        <div
          ref={refs.setFloating}
          className='sm:p-[10px] p-[5px] sm:pt-[14px]'
          style={{
            ...floatingStyles,
            maxHeight: 'min(80vh, 560px)',
            overflow: 'auto',
            zIndex: 9999,
            borderRadius: 16,
            boxShadow: '0 14px 28px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)',
            background: 'linear-gradient(180deg, #fefefe 0%, #f8f9fa 100%)',
            border: '1px solid rgba(0,0,0,0.06)',
            visibility: open ? 'visible' : 'hidden',
            opacity: open ? 1 : 0,
            pointerEvents: open ? 'auto' : 'none',
          }}
          aria-hidden={!open}
          {...getFloatingProps()}
        >
          <div className="p-[12px] sm:pt-0 pt-[5px]">
            <h3 className="text-[14px] font-semibold text-[#0357EE] uppercase tracking-wider">Catalogue</h3>
          </div>
          <div
            className="p-[10px] grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-5 gap-[3px]"
          >
            {cataloguesSorted.map((item) => (
              <div
                key={item.id}
                style={{ minWidth: 0 }}
              >
                <CatalogueMediaItem
                  item={item}
                  onClick={() => openGalleryAt(item.mediaUrl)}
                />
              </div>
            ))}
          </div>
        </div>
      </FloatingPortal>

      {!usePageGallery && (
        <ProductMediaGallery
          isOpen={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          slides={gallerySlides}
          initialIndex={galleryIndex}
          productLabel={product?.name ? String(product.name) : undefined}
          isSavedForVariant={isSavedForVariant}
          onToggleSaveVariant={onToggleSaveVariant}
          requireAuthForSave={!isAuthenticated}
          onAuthRequired={onAuthRequired}
          onShare={() => setShowShareModal(true)}
          getCartItemForVariant={getCartItemForVariant}
          variantNeedsQuickLook={variantNeedsQuickLook}
          onAddToCart={onGalleryAddToCart}
          onOpenQuickLook={onGalleryOpenQuickLook}
          onIncrementCartItem={onIncrementCartItem}
          onDecrementCartItem={onDecrementCartItem}
        />
      )}

      {!usePageGallery && (
        <ShareProductModal
          modalOpen={showShareModal}
          handleCloseModal={() => setShowShareModal(false)}
          modalZIndex={10001}
        />
      )}
    </>
  );
}

export default ProductCatalogueDropdown;
