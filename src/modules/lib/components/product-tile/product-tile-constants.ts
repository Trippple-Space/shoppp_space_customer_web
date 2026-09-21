import { ConfigurationRecord } from '../../utility/types/product.interface';

export const TILE_PRICE_FADE = {
  duration: 1.1,
  ease: [0.42, 0, 0.58, 1] as const,
};

export const PRODUCT_TILE_PILL_STYLES = {
  preorder: {
    pillBackground: '#E6EDF4',
    pillColor: '#4018DE',
  },
  'custom-made': {
    pillBackground: '#F4EDE6',
    pillColor: '#DE7818',
  },
  'ready-to-wear': {
    pillBackground: 'rgba(11, 147, 120, 0.1)',
    pillColor: '#0B9378',
  },
  discount: {
    pillBackground: '#FFF1F0',
    pillColor: '#CF1322',
  },
} as const;

export const resolveConfigPillKind = (
  record: Pick<ConfigurationRecord, 'slug' | 'name' | 'description'>
): keyof Pick<
  typeof PRODUCT_TILE_PILL_STYLES,
  'preorder' | 'custom-made'
> => {
  const haystack = `${record.slug ?? ''} ${record.name ?? ''} ${record.description ?? ''}`
    .toLowerCase()
    .replace(/_/g, '-');

  if (haystack.includes('preorder') || haystack.includes('pre-order')) {
    return 'preorder';
  }

  return 'custom-made';
};
