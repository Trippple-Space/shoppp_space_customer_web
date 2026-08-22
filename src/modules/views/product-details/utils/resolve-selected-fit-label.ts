import { ProductVariant } from '@/modules/lib/utility/types/product.interface';

/** Option keys that affect Fit Oracle size-chart matching (as sizeLabel). */
export const FIT_SELECTION_OPTION_KEYS = [
  'size',
  'necklace length',
  'bracelet length',
  'head size',
  'shoe size',
] as const;

const normalizeKey = (value: string) =>
  value.trim().toLowerCase().replace(/[_-]+/g, ' ');

export const isFitSelectionKey = (key: string) =>
  (FIT_SELECTION_OPTION_KEYS as readonly string[]).includes(normalizeKey(key));

/**
 * Stable signature of only fit-relevant filters (ignores color, etc.).
 * Used so recommendation refetch skips non-fit property changes.
 */
export const getFitSelectionSignature = (
  activeFilters: Record<string, string> = {},
  selectedVariant?: ProductVariant | null,
): string => {
  const parts: string[] = [];

  for (const [filterKey, value] of Object.entries(activeFilters)) {
    if (!isFitSelectionKey(filterKey) || !value?.trim()) continue;
    parts.push(`${normalizeKey(filterKey)}=${value.trim().toLowerCase()}`);
  }

  if (!parts.length && selectedVariant) {
    const size = selectedVariant.size?.trim();
    if (size) parts.push(`size=${size.toLowerCase()}`);

    const properties = selectedVariant.properties;
    if (properties && typeof properties === 'object') {
      for (const [propKey, value] of Object.entries(properties)) {
        if (!isFitSelectionKey(propKey) || value == null) continue;
        const text = String(value).trim();
        if (!text) continue;
        parts.push(`${normalizeKey(propKey)}=${text.toLowerCase()}`);
      }
    }
  }

  return parts.sort().join('|');
};

/**
 * Prefer an explicitly selected fit option (size / necklace length / …)
 * even when the full variant isn't resolved yet (e.g. color still missing).
 */
export const resolveSelectedFitLabel = (
  activeFilters: Record<string, string> = {},
  selectedVariant?: ProductVariant | null,
): string | undefined => {
  for (const key of FIT_SELECTION_OPTION_KEYS) {
    const fromFilter = Object.entries(activeFilters).find(
      ([filterKey, value]) =>
        normalizeKey(filterKey) === key && Boolean(value?.trim()),
    )?.[1];

    if (fromFilter?.trim()) {
      return fromFilter.trim();
    }
  }

  const variantSize = selectedVariant?.size?.trim();
  if (variantSize) return variantSize;

  const properties = selectedVariant?.properties;
  if (properties && typeof properties === 'object') {
    for (const key of FIT_SELECTION_OPTION_KEYS) {
      if (key === 'size') continue;
      const match = Object.entries(properties).find(
        ([propKey, value]) =>
          normalizeKey(propKey) === key &&
          value != null &&
          String(value).trim() !== '',
      );
      if (match) return String(match[1]).trim();
    }
  }

  return undefined;
};
