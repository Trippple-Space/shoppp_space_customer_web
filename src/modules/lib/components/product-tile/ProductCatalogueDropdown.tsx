'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HiSquares2X2 } from 'react-icons/hi2';
import { ProductCatalogue } from '../../utility/types/product.interface';
import {
  useFloating,
  offset,
  flip,
  shift,
  useHover,
  useDismiss,
  useInteractions,
  safePolygon,
  FloatingPortal,
} from '@floating-ui/react';
import Image from '../image/Image';

export function CatalogueMediaItem({ item }: { item: ProductCatalogue }) {
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

  const wrapperStyle: React.CSSProperties = {
    overflow: 'hidden',
    background: 'rgba(0,0,0,0.04)',
    /* paddingBottom: 5 */
  };

  const tags: string[] = [];
  if (item.occasionType) tags.push(item.occasionType);
  if (item.locationType) tags.push(item.locationType);

  if (item.mediaType === 'video') {
    return (
      <div style={wrapperStyle}>
        <div style={{ aspectRatio: '1', overflow: 'hidden' }}>
          <video
            ref={videoRef}
            src={item.mediaUrl}
            muted
            loop
            playsInline
            className="w-100p h-100p block g|object-fit:cover"
            style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
          />
        </div>
        {/* (item.caption || tags.length > 0) && (
          <div className="px-8 py-6">
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {tags.map((t) => (
                  <span key={t} className="text-11 color-#0B9378 lowercase">
                    #{t.replace(/\s+/g, '_')}
                  </span>
                ))}
              </div>
            )}
            {item.caption && (
              <p className="text-11 color-#00000099">{item.caption}</p>
            )}
          </div>
        ) */}
      </div>
    );
  }

  return (
    <div style={wrapperStyle}>
      <div style={{ aspectRatio: '1', overflow: 'hidden', position: 'relative' }}>
        <Image
          ref={imgRef}
          className={`absolute w-full h-full a-self-center g|object-fit:cover`}
          src={item.mediaUrl}
          alt={item.caption ?? 'Catalogue'}
          hasLoader={true}
          width={10000}
        />
      </div>
      {/* (item.caption || tags.length > 0) && (
        <div className="px-8 py-6">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {tags.map((t) => (
                <span key={t} className="text-11 color-#0B9378 lowercase">
                  #{t.replace(/\s+/g, '_')}
                </span>
              ))}
            </div>
          )}
          {item.caption && (
            <p className="text-11 color-#00000099">{item.caption}</p>
          )}
        </div>
      ) */}
    </div>
  );
}

export interface ProductCatalogueDropdownProps {
  productCatalogues?: ProductCatalogue[] | null;
}

export function ProductCatalogueDropdown({ productCatalogues }: ProductCatalogueDropdownProps) {
  const [open, setOpen] = useState(false);

  const cataloguesSorted = useMemo(() => {
    const list = productCatalogues ?? [];
    if (!list.length) return [];
    return [...list].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [productCatalogues]);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'top-start',
    middleware: [offset(8), flip({ fallbackPlacements: ['bottom-start'] }), shift({ padding: 12 })],
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
        {...getReferenceProps()}
        className="l:w-35.2 l:min-w-35.2 l:h-35.2 w-31 min-w-31 h-31 flex a-items-center j-content-center radius-3 md:radius-4 border border-#00000014 outline-none bg-#00000006 hover:bg-#0000000D transition-colors shrink-0"
        aria-label="View Catalogue"
      >
        <HiSquares2X2 className="l:w-18 w-16 l:h-18 h-16 color-#0B9378" />
      </button>
      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            className='sm:p-10 p-5 sm:pt-14'
            style={{
              ...floatingStyles,
              minWidth: 'min(90vw, 560px)',
              maxWidth: 'min(92vw, 640px)',
              maxHeight: 'min(80vh, 560px)',
              overflow: 'auto',
              zIndex: 9999,
              borderRadius: 16,
              boxShadow: '0 14px 28px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)',
              background: 'linear-gradient(180deg, #fefefe 0%, #f8f9fa 100%)',
              border: '1px solid rgba(0,0,0,0.06)',
            }}
            {...getFloatingProps()}
          >
            <div className="p-12 sm:pt-0 pt-5">
              <h3 className="text-14 weight-600 color-#0B9378 uppercase tracking-wider">Catalogue</h3>
            </div>
            <div
              className="p-10 grid grid-3-cols-1fr sm:grid-4-cols-1fr xl:grid-5-cols-1fr gap-3"
            >
              {cataloguesSorted.map((item) => (
                <div key={item.id} style={{
                  minWidth: 0
                }}>
                  <CatalogueMediaItem item={item} />
                </div>
              ))}
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}

export default ProductCatalogueDropdown;
