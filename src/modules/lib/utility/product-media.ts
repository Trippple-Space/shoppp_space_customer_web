import {
  ProductCatalogue,
  ProductMedia,
  ProductVariant,
} from './types/product.interface';
import { checkMediaType, getImageDir } from './utility';

export interface VariantMediaPreviewItem {
  variant: ProductVariant;
  media: ProductMedia;
}

const normalizeMediaValue = (value: unknown): string => {
  return String(value ?? '').trim().toLowerCase();
};

export const getMediaUploadUrl = (media?: ProductMedia): string => {
  if (!media) return '';

  const value =
    (media as any)?.uploadUrl ||
    (media as any)?.uploadURL ||
    (media as any)?.upload_url ||
    (media as any)?.sharedUploadUrl ||
    (media as any)?.sourceUrl ||
    (media as any)?.originalUrl;

  return normalizeMediaValue(value);
};

export const getMediaDedupeKey = (media?: ProductMedia): string => {
  const uploadUrl = getMediaUploadUrl(media);
  if (uploadUrl) return `upload:${uploadUrl}`;

  const url = normalizeMediaValue(media?.url);
  return url ? `url:${url}` : '';
};

export const buildVariantMediaPreviewItems = (
  variants?: ProductVariant[]
): VariantMediaPreviewItem[] => {
  if (!variants?.length) return [];

  const seen = new Set<string>();
  const previewItems: VariantMediaPreviewItem[] = [];

  for (const variant of variants) {
    for (const media of variant?.media ?? []) {
      const key = getMediaDedupeKey(media);
      if (!key || seen.has(key)) continue;

      seen.add(key);
      previewItems.push({ variant, media });
    }
  }

  return previewItems;
};

export const buildProductGalleryMediaUrls = (
  variantPreviewItems: VariantMediaPreviewItem[],
  productCatalogues?: ProductCatalogue[] | null
): string[] => {
  return buildProductGallerySlides(variantPreviewItems, productCatalogues).map(
    (slide) => slide.url
  );
};

export interface ProductGallerySlide {
  url: string;
  isCatalogue: boolean;
  variant: ProductVariant;
}

export const buildProductGallerySlides = (
  variantPreviewItems: VariantMediaPreviewItem[],
  productCatalogues?: ProductCatalogue[] | null,
  fallbackVariant?: ProductVariant
): ProductGallerySlide[] => {
  const firstVariant =
    variantPreviewItems[0]?.variant ?? fallbackVariant ?? null;
  if (!firstVariant) return [];

  const slides: ProductGallerySlide[] = [];
  const seen = new Set<string>();

  const catalogues = [...(productCatalogues ?? [])].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );

  for (const catalogue of catalogues) {
    const url = catalogue.mediaUrl;
    if (!url || seen.has(url)) continue;
    seen.add(url);
    slides.push({
      url,
      isCatalogue: true,
      variant: firstVariant,
    });
  }

  for (const item of variantPreviewItems) {
    const url = item.media?.url;
    if (!url || seen.has(url)) continue;
    seen.add(url);
    slides.push({
      url,
      isCatalogue: false,
      variant: item.variant,
    });
  }

  return slides;
};

export const preloadProductMediaUrl = (
  url: string,
  onComplete: () => void
): (() => void) => {
  if (!url) return () => {};

  let cancelled = false;
  const scheduleComplete = () => {
    requestAnimationFrame(() => {
      if (!cancelled) onComplete();
    });
  };

  const mediaType = checkMediaType(url);

  if (mediaType === 'video') {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    const onLoadedData = () => scheduleComplete();
    video.addEventListener('loadeddata', onLoadedData);
    video.src = url;

    return () => {
      cancelled = true;
      video.removeEventListener('loadeddata', onLoadedData);
      video.src = '';
    };
  }

  const img = new window.Image();
  img.onload = scheduleComplete;
  img.onerror = scheduleComplete;
  img.src = getImageDir('images', url);

  return () => {
    cancelled = true;
    img.onload = null;
    img.onerror = null;
    img.src = '';
  };
};
