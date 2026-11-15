'use client';

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import Image from '../image/Image';
import VideoSrc from '../video-src/VideoSrc';
import { checkMediaType } from '../../utility/utility';
import {
  VariantMediaPreviewItem,
  preloadProductMediaUrl,
} from '../../utility/product-media';
import {
  TILE_MEDIA_FADE_MS,
  TILE_MEDIA_FADE_S,
} from './product-tile-auto-rotate';

const FADE_TRANSITION = `opacity ${TILE_MEDIA_FADE_S}s cubic-bezier(0.42, 0, 0.58, 1)`;

interface MediaSlot {
  url: string;
  outOfStock: boolean;
}

interface TileMediaLayerProps {
  url: string;
  outOfStock: boolean;
  imgRef?: React.Ref<HTMLImageElement>;
  showLoader?: boolean;
  onLoaded?: () => void;
}

function TileMediaLayer({
  url,
  outOfStock,
  imgRef,
  showLoader = false,
  onLoaded,
}: TileMediaLayerProps) {
  if (!url) return null;

  const mediaType = checkMediaType(url) ?? 'image';
  const stockClass = outOfStock ? 'out-of-stock' : '';
  const pulseClassName = 'rounded-[10px] lg:rounded-[15px]';

  if (mediaType === 'video') {
    return (
      <VideoSrc
        className={`absolute w-full h-full self-center object-cover cursor-pointer transition-none ${stockClass}`}
        src={url}
        hasLoader={showLoader}
        pulseClassName={pulseClassName}
        onLoaded={onLoaded}
      />
    );
  }

  return (
    <Image
      ref={imgRef as React.Ref<HTMLImageElement> | undefined}
      className={`absolute w-full h-full self-center object-cover cursor-pointer transition-none ${stockClass}`}
      src={url}
      alt="product-image"
      width={10000}
      hasLoader={showLoader}
      pulseClassName={pulseClassName}
      style={{ transition: 'none' }}
      onLoadComplete={onLoaded}
    />
  );
}

function slotFromItem(item?: VariantMediaPreviewItem): MediaSlot {
  return {
    url: item?.media?.url ?? '',
    outOfStock: item?.variant?.status === 'OUT_OF_STOCK',
  };
}

interface ProductTileMediaCarouselProps {
  items: VariantMediaPreviewItem[];
  activeIndex: number;
  imgRef?: React.Ref<HTMLImageElement>;
}

export const ProductTileMediaCarousel = memo(function ProductTileMediaCarousel({
  items,
  activeIndex,
  imgRef,
}: ProductTileMediaCarouselProps) {
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const displayedIndexRef = useRef(0);
  const fadeGenerationRef = useRef(0);
  const pendingTargetRef = useRef<number | null>(null);
  const preloadCleanupRef = useRef<(() => void) | null>(null);
  const loadedUrlsRef = useRef(new Set<string>());

  const markUrlLoaded = useCallback((url: string) => {
    loadedUrlsRef.current.add(url);
  }, []);

  const shouldShowLoader = useCallback((url: string) => {
    return !loadedUrlsRef.current.has(url);
  }, []);

  const initialSlot = slotFromItem(items[0]);

  const [backSlot, setBackSlot] = useState<MediaSlot>(initialSlot);
  const [frontSlot, setFrontSlot] = useState<MediaSlot>(initialSlot);
  const [frontOpacity, setFrontOpacity] = useState(1);
  const [isFading, setIsFading] = useState(false);

  const preloadIndex = useCallback((index: number) => {
    preloadCleanupRef.current?.();
    const count = itemsRef.current.length;
    if (count <= 0) return;

    const normalized = ((index % count) + count) % count;
    const url = itemsRef.current[normalized]?.media?.url;
    if (!url) return;

    preloadCleanupRef.current = preloadProductMediaUrl(url, () => {
      markUrlLoaded(url);
    });
  }, [markUrlLoaded]);

  const completeFade = useCallback((generation: number) => {
    if (generation !== fadeGenerationRef.current) return;

    const target = pendingTargetRef.current;
    if (target === null) return;

    const item = itemsRef.current[target];
    const slot = slotFromItem(item);
    if (!slot.url) return;

    displayedIndexRef.current = target;
    pendingTargetRef.current = null;
    setFrontSlot(slot);
    setBackSlot(slot);
    setFrontOpacity(1);
    setIsFading(false);
    preloadIndex((target + 1) % itemsRef.current.length);
  }, [preloadIndex]);

  const startCrossfade = useCallback(
    (targetIndex: number) => {
      const item = itemsRef.current[targetIndex];
      const nextSlot = slotFromItem(item);
      if (!nextSlot.url) return;

      const generation = ++fadeGenerationRef.current;
      pendingTargetRef.current = targetIndex;
      preloadIndex(targetIndex);

      setBackSlot(nextSlot);
      setFrontOpacity(1);
      setIsFading(false);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (generation !== fadeGenerationRef.current) return;
          setIsFading(true);
          setFrontOpacity(0);
        });
      });

      window.setTimeout(() => {
        completeFade(generation);
      }, TILE_MEDIA_FADE_MS + 80);
    },
    [completeFade, preloadIndex]
  );

  const handleFrontTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLDivElement>) => {
      if (event.propertyName !== 'opacity' || !isFading) return;
      completeFade(fadeGenerationRef.current);
    },
    [completeFade, isFading]
  );

  useEffect(() => {
    const currentItems = itemsRef.current;
    if (!currentItems.length) return;

    const count = currentItems.length;
    const targetIndex = ((activeIndex % count) + count) % count;

    if (targetIndex === displayedIndexRef.current) return;

    const currentUrl = currentItems[displayedIndexRef.current]?.media?.url;
    const targetUrl = currentItems[targetIndex]?.media?.url;
    if (!targetUrl) return;

    if (!currentUrl || currentUrl === targetUrl) {
      const slot = slotFromItem(currentItems[targetIndex]);
      displayedIndexRef.current = targetIndex;
      pendingTargetRef.current = null;
      fadeGenerationRef.current += 1;
      setBackSlot(slot);
      setFrontSlot(slot);
      setFrontOpacity(1);
      setIsFading(false);
      preloadIndex((targetIndex + 1) % count);
      return;
    }

    startCrossfade(targetIndex);
  }, [activeIndex, preloadIndex, startCrossfade]);

  useEffect(() => {
    const currentItems = itemsRef.current;
    if (currentItems.length > 1) {
      preloadIndex(1);
    }
    return () => preloadCleanupRef.current?.();
  }, [items.length, preloadIndex]);

  if (!frontSlot.url) return null;

  const isIncomingBack = isFading || backSlot.url !== frontSlot.url;

  return (
    <div className="absolute w-full h-full top-0 left-0 z-0">
      <div className="absolute w-full h-full" aria-hidden={isFading}>
        <TileMediaLayer
          key={`back-${backSlot.url}`}
          url={backSlot.url}
          outOfStock={backSlot.outOfStock}
          showLoader={isIncomingBack && shouldShowLoader(backSlot.url)}
          onLoaded={() => markUrlLoaded(backSlot.url)}
        />
      </div>
      <div
        className="absolute w-full h-full"
        style={{
          opacity: frontOpacity,
          transition: isFading ? FADE_TRANSITION : 'none',
        }}
        onTransitionEnd={handleFrontTransitionEnd}
      >
        <TileMediaLayer
          key={`front-${frontSlot.url}`}
          url={frontSlot.url}
          outOfStock={frontSlot.outOfStock}
          imgRef={imgRef}
          showLoader={!isIncomingBack && shouldShowLoader(frontSlot.url)}
          onLoaded={() => markUrlLoaded(frontSlot.url)}
        />
      </div>
    </div>
  );
});
