import {
  Product,
  ProductCatalogue,
  ProductMedia,
  ProductVariant,
} from './types/product.interface';
import { getVariantValue } from './hooks/use-transform-product';
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

export interface PageGallerySlide extends ProductGallerySlide {
  productId: string;
  product: Product;
}

const collectVariantProperties = (
  variants: ProductVariant[]
): Record<string, string[]> => {
  const allProperties: Record<string, string[]> = {};

  for (const variant of variants) {
    for (const [key, value] of Object.entries(variant?.properties ?? {})) {
      const stringValue = String(value).trim();
      if (!stringValue) continue;
      if (!allProperties[key]) allProperties[key] = [];
      if (!allProperties[key].includes(stringValue)) {
        allProperties[key].push(stringValue);
      }
    }
  }

  const sizes = Array.from(
    new Set(variants.map((variant) => variant.size).filter(Boolean))
  ) as string[];

  if (sizes.length) {
    allProperties.size = sizes;
  }

  return allProperties;
};

/** One representative variant per distinguishing property (matches tile thumbnails). */
export const getUniqueGalleryVariants = (product: Product): ProductVariant[] => {
  if (!product?.variants?.length) return [];

  const allPropertiesWithSize = collectVariantProperties(product.variants);
  const candidateKeys = [
    ...(allPropertiesWithSize.color?.length ? ['color'] : []),
    ...Object.keys(allPropertiesWithSize).filter(
      (key) => key !== 'color' && key !== 'size'
    ),
    ...(allPropertiesWithSize.size?.length ? ['size'] : []),
  ];

  const uniqueKey = candidateKeys.find((key) => {
    const values = new Set(
      product.variants
        .map((variant) => String(getVariantValue(variant, key) ?? '').trim())
        .filter(Boolean)
    );

    return values.size > 1;
  });

  if (!uniqueKey) {
    return product.variants;
  }

  const map = new Map<string, ProductVariant>();
  const rest: ProductVariant[] = [];

  for (const variant of product.variants) {
    const raw = getVariantValue(variant, uniqueKey);
    const value = String(raw ?? '')
      .trim()
      .toLowerCase();

    if (!value) {
      rest.push(variant);
      continue;
    }

    if (!map.has(value)) {
      map.set(value, variant);
    }
  }

  return Array.from(map.values()).concat(rest);
};

export const buildPageGallerySlides = (
  products: Product[]
): PageGallerySlide[] => {
  const slides: PageGallerySlide[] = [];

  for (const product of products) {
    const variantPreviewItems = buildVariantMediaPreviewItems(
      getUniqueGalleryVariants(product)
    );
    const productSlides = buildProductGallerySlides(
      variantPreviewItems,
      product.productCatalogues,
      product.variants?.[0]
    );

    for (const slide of productSlides) {
      slides.push({
        ...slide,
        productId: product.id,
        product,
      });
    }
  }

  return slides;
};

export interface ProductGalleryRange {
  productId: string;
  productName: string;
  startIndex: number;
  endIndex: number;
}

export const isPageGallerySlide = (
  slide: ProductGallerySlide
): slide is PageGallerySlide => {
  return 'productId' in slide && 'product' in slide;
};

export const buildProductGalleryRanges = (
  slides: ProductGallerySlide[]
): ProductGalleryRange[] => {
  const ranges: ProductGalleryRange[] = [];
  let current: ProductGalleryRange | null = null;

  slides.forEach((slide, index) => {
    if (!isPageGallerySlide(slide)) return;

    if (current?.productId === slide.productId) {
      current.endIndex = index;
      return;
    }

    if (current) ranges.push(current);

    current = {
      productId: slide.productId,
      productName:
        String(slide.product?.name ?? '').trim() || 'Product',
      startIndex: index,
      endIndex: index,
    };
  });

  if (current) ranges.push(current);

  return ranges;
};

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
