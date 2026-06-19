'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaCirclePlay } from 'react-icons/fa6';
import { ProductCatalogue } from '../../utility/types/product.interface';
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
  buildProductGalleryMediaUrls,
  VariantMediaPreviewItem,
} from '../../utility/product-media';
import catalogueStyles from './product-catalogue-dropdown.module.css';

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
            className="w-100p h-100p block g|object-fit:cover"
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
          className={`absolute w-full h-full a-self-center g|object-fit:cover`}
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
  isOutOfStock?: boolean;
  isSaved?: boolean;
  onSave?: () => void;
  isAuthenticated?: boolean;
  onAuthRequired?: () => void;
  onAddToCart?: () => void;
  showAddToCart?: boolean;
  addToCartDisabled?: boolean;
}

export function ProductCatalogueDropdown({
  productCatalogues,
  variantPreviewItems = [],
  isOutOfStock = false,
  isSaved = false,
  onSave,
  isAuthenticated = false,
  onAuthRequired,
  onAddToCart,
  showAddToCart = false,
  addToCartDisabled = false,
}: ProductCatalogueDropdownProps) {
  const [open, setOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);

  const cataloguesSorted = useMemo(() => {
    const list = productCatalogues ?? [];
    if (!list.length) return [];
    return [...list].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [productCatalogues]);

  const galleryMediaUrls = useMemo(
    () => buildProductGalleryMediaUrls(variantPreviewItems, productCatalogues),
    [variantPreviewItems, productCatalogues]
  );

  const openGalleryAt = (mediaUrl: string) => {
    const idx = galleryMediaUrls.findIndex((url) => url === mediaUrl);
    setGalleryIndex(idx >= 0 ? idx : 0);
    setGalleryOpen(true);
    setOpen(false);
  };

  const openFullGallery = () => {
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
        className="l:w-35.2 l:min-w-35.2 l:h-35.2 w-31 min-w-31 h-31 flex a-items-center j-content-center radius-3 md:radius-4 border border-#00000014 outline-none bg-#00000006 hover:bg-#0000000D transition-colors shrink-0"
        aria-label="Open product media gallery"
      >
        <FaCirclePlay className="l:w-18 w-16 l:h-18 h-16 color-#0B9378 ml-1" />
      </button>
      <FloatingPortal>
        <div
          ref={refs.setFloating}
          className='sm:p-10 p-5 sm:pt-14'
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
          <div className="p-12 sm:pt-0 pt-5">
            <h3 className="text-14 weight-600 color-#0B9378 uppercase tracking-wider">Catalogue</h3>
          </div>
          <div
            className="p-10 grid grid-3-cols-1fr sm:grid-4-cols-1fr xl:grid-5-cols-1fr gap-3"
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

      <ProductMediaGallery
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        mediaUrls={galleryMediaUrls}
        initialIndex={galleryIndex}
        isOutOfStock={isOutOfStock}
        isSaved={isSaved}
        onSave={onSave}
        requireAuthForSave={!isAuthenticated}
        onAuthRequired={onAuthRequired}
        onShare={() => setShowShareModal(true)}
        onAddToCart={() => {
          setGalleryOpen(false);
          onAddToCart?.();
        }}
        showAddToCart={showAddToCart}
        addToCartDisabled={addToCartDisabled}
      />

      <ShareProductModal
        modalOpen={showShareModal}
        handleCloseModal={() => setShowShareModal(false)}
        modalZIndex={10001}
      />
    </>
  );
}

export default ProductCatalogueDropdown;
