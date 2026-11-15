import type { PageRelease } from '@sanee/core';

export interface PublicVariant {
  id: string;
  sku: string | null;
  optionValues: Record<string, string>;
  priceMinor: number;
  compareAtPriceMinor: number | null;
  mediaId: string | null;
  inStock: boolean;
}

/** Storefront product: live prices, no cost or stock counts. Pages only hold the id. */
export interface PublicProduct {
  id: string;
  title: string;
  slug: string;
  brand: string | null;
  description: string | null;
  options: Array<{ name: string; values: string[] }>;
  media: Array<{
    id: string;
    url: string;
    altText: string | null;
    position: number;
  }>;
  variants: PublicVariant[];
  thumbnail: string | null;
  minPriceMinor: number | null;
  maxPriceMinor: number | null;
  inStock: boolean;
}

export interface PublicCollection {
  id: string;
  title: string;
  slug: string;
  description: string | null;
}

export interface StorefrontData {
  products: PublicProduct[];
  grids: Record<string, string[]>;
  collections: PublicCollection[];
  collectionLists: Record<string, string[]>;
  activeCollection: string | null;
  locale: string;
  currency: string;
  merchant: {
    name: string;
    contact: { email?: string; phone?: string; whatsapp?: string };
  };
  commerce: { mode: string; checkoutEnabled: boolean };
  navigation: { pages: Array<{ title: string; path: string }> };
}

/** `GET /public/website/resolve` */
export interface ResolvedSite {
  store: {
    id: string;
    slug: string;
    name: string;
    currency: string;
    country: string | null;
    thumbnail: string | null;
  };
  site: {
    hostTheme: Record<string, string>;
    commerceMode: string;
    locale: string;
  };
  page: { id: string; path: string; title: string };
  release: PageRelease;
  data: StorefrontData;
}
