import { ProductVariant } from '@/modules/lib/utility/types/product.interface';
import { isFitSelectionKey } from './resolve-selected-fit-label';
import { ProductFitRecommendationData } from '../types/product-fit-recommendation';

const SIZE_ALIASES: Record<string, string> = {
  small: 's',
  sm: 's',
  medium: 'm',
  md: 'm',
  med: 'm',
  large: 'l',
  lg: 'l',
  xlarge: 'xl',
  extralarge: 'xl',
  xxlarge: 'xxl',
  extraextralarge: 'xxl',
  xxxlarge: 'xxxl',
  xsmall: 'xs',
  onesize: 'os',
  osfa: 'os',
};

export const collectFitOptionValues = (
  variants: ProductVariant[] = []
): string[] => {
  const values = new Set<string>();

  for (const variant of variants) {
    const size = variant.size?.trim();
    if (size) values.add(size);

    const properties = variant.properties;
    if (!properties || typeof properties !== 'object') continue;

    for (const [key, value] of Object.entries(properties)) {
      if (!isFitSelectionKey(key) || value == null) continue;
      const text = String(value).trim();
      if (text) values.add(text);
    }
  }

  return Array.from(values);
};

export const hasFitSelectableOptions = (variants: ProductVariant[] = []) =>
  collectFitOptionValues(variants).length > 0;

const normalizeFitToken = (value: string) => {
  let token = value.trim().toLowerCase();
  token = token.replace(/\b(uk|us|eu|au)\b/gi, '');
  token = token.replace(/[^a-z0-9]/g, '');
  if (token === 'extrasmall') return 'xs';
  return SIZE_ALIASES[token] || token;
};

export const findMatchingFitOption = (
  recommended: string | null | undefined,
  options: string[]
): string | null => {
  const rec = recommended?.trim();
  if (!rec || !options.length) return null;

  const exact = options.find(
    (option) => option.trim().toLowerCase() === rec.toLowerCase()
  );
  if (exact) return exact;

  const recToken = normalizeFitToken(rec);
  if (!recToken) return null;

  const matches = options.filter(
    (option) => normalizeFitToken(option) === recToken
  );
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) {
    return (
      matches.find((option) =>
        option.toLowerCase().includes(rec.toLowerCase())
      ) ?? matches[0]
    );
  }

  return null;
};

const replaceLabel = (text: string, from: string, to: string) => {
  if (!text || !from || from.toLowerCase() === to.toLowerCase()) return text;
  const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`\\b${escaped}\\b`, 'ig'), to);
};

export const alignRecommendationToVendorOptions = (
  recommendation: ProductFitRecommendationData,
  options: string[]
): ProductFitRecommendationData | null => {
  if (recommendation.status === 'no_fit') return recommendation;

  const recommended =
    recommendation.recommendedSizeLabel?.trim() ||
    recommendation.sizeLabel?.trim();
  if (!recommended) return recommendation;

  const matched = findMatchingFitOption(recommended, options);
  if (!matched) return null;

  if (matched.toLowerCase() === recommended.trim().toLowerCase()) {
    return recommendation;
  }

  return {
    ...recommendation,
    recommendedSizeLabel: matched,
    sizeLabel: findMatchingFitOption(recommendation.sizeLabel, options) ?? recommendation.sizeLabel,
    headline: replaceLabel(recommendation.headline, recommended, matched),
    subheadline: replaceLabel(recommendation.subheadline, recommended, matched),
    statusBadge: replaceLabel(recommendation.statusBadge, recommended, matched),
    description: replaceLabel(recommendation.description, recommended, matched),
    message: recommendation.message
      ? replaceLabel(recommendation.message, recommended, matched)
      : recommendation.message,
  };
};
