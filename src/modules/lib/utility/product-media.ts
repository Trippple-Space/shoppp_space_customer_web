import {
  ProductCatalogue,
  ProductMedia,
  ProductVariant,
} from './types/product.interface';

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
  const productImages = variantPreviewItems
    .map((item) => item.media.url)
    .filter(Boolean);
  const catalogueImages =
    (productCatalogues ?? [])
      .map((catalogue) => catalogue.mediaUrl)
      .filter(Boolean) ?? [];

  const combined = [...productImages, ...catalogueImages];
  return combined.length ? Array.from(new Set(combined)) : [];
};
