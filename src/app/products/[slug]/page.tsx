import ProductDetails from '@/modules/views/product-details/Product-details';
import ProductLoadError from '@/modules/views/product-details/ProductLoadError';
import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import endpoints from '@/modules/lib/utility/endpoints';
import config from 'env';
import { buildEndpoint } from '@/modules/lib/utility/utility';
import { Product } from '@/modules/lib/utility/types/product.interface';

export const dynamic = 'force-dynamic';
const PRODUCT_CACHE_TAG_PREFIX = 'product-details';
const PRODUCT_CACHE_DURATION_SECONDS = 60 * 60 * 24;

const getProductCacheTags = (slug: string) => [
  PRODUCT_CACHE_TAG_PREFIX,
  `${PRODUCT_CACHE_TAG_PREFIX}:${slug}`,
];

async function fetchProductCacheVersion(): Promise<number> {
  try {
    const response = await fetch(`${config.API_HOST}/products/cache-version`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return 0;
    }

    const payload = (await response.json()) as { version?: number };
    return typeof payload.version === 'number' ? payload.version : 0;
  } catch {
    return 0;
  }
}

async function fetchProductBySlugWithTag(slug: string): Promise<Product> {
  const cacheVersion = await fetchProductCacheVersion();
  const url = new URL(
    buildEndpoint(config.API_HOST + '/' + endpoints.PRODUCT, {
      slug,
    })
  );
  url.searchParams.set('cv', String(cacheVersion));

  const response = await fetch(url.toString(), {
    next: {
      tags: getProductCacheTags(slug),
      revalidate: PRODUCT_CACHE_DURATION_SECONDS,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const product = (await response.json()) as Product;
  return {
    ...product,
    variants: product.variants.sort((a, b) => {
      if (a.status === 'OUT_OF_STOCK' && b.status !== 'OUT_OF_STOCK') return 1;
      if (a.status !== 'OUT_OF_STOCK' && b.status === 'OUT_OF_STOCK') return -1;
      return 0;
    }),
  };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const product = await fetchProductBySlugWithTag(params.slug);

    const extractProductProperties = () => {
      const hasValue = (value: unknown) => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        if (Array.isArray(value)) {
          return value.some(
            (item) => typeof item === 'string' && item.trim().length > 0
          );
        }
        if (typeof value === 'object') return Object.keys(value).length > 0;
        return true;
      };

      const normalizeValue = (value: unknown) => {
        if (typeof value === 'string') return value.trim();
        if (Array.isArray(value)) {
          return value
            .map((item) =>
              typeof item === 'string' ? item.trim() : String(item).trim()
            )
            .filter(Boolean)
            .join(', ');
        }
        return String(value).trim();
      };

      const sizes = new Set<string>();
      const colors = new Set<string>();
      const customProperties: Record<string, Set<string>> = {};

      product.variants.forEach((variant) => {
        if (hasValue(variant?.size)) sizes.add(String(variant?.size).trim());

        if (hasValue(variant?.properties?.color)) {
          colors.add(String(variant?.properties?.color).trim());
        }

        if (variant?.properties) {
          Object.entries(variant?.properties).forEach(([key, value]) => {
            if (key === 'color' || key === 'size') return;
            if (!hasValue(value)) return;
            if (!customProperties[key]) customProperties[key] = new Set();
            const normalizedValue = normalizeValue(value);
            if (normalizedValue) customProperties[key].add(normalizedValue);
          });
        }
      });

      const formattedCustomProperties: Record<string, string[]> = {};
      Object.entries(customProperties).forEach(([key, valueSet]) => {
        formattedCustomProperties[key] = Array.from(valueSet);
      });

      return {
        sizes: Array.from(sizes),
        colors: Array.from(colors),
        customProperties: formattedCustomProperties,
      };
    };

    const { sizes, colors, customProperties } = extractProductProperties();

    const storeName = product?.store?.name?.trim() || 'Asoebi Africa';

    const customPropsString = Object.entries(customProperties)
      .filter(
        ([key, values]) => key.trim().length > 0 && Array.isArray(values) && values.length > 0
      )
      .map(([key, values]) => `${key}: ${values.join(', ')}`)
      .join('. ');

    const priceAmount =
      product?.variants?.[0]?.finalPrice ??
      product?.finalPrice ??
      product?.price ??
      0;
    const priceFormatted =
      priceAmount > 0 ? `₦${Number(priceAmount).toLocaleString('en')}` : '';
    const descriptionParts = [
      product?.longDescription?.trim() || product?.name?.trim(),
      sizes.length > 0 ? `Available sizes: ${sizes.join(', ')}` : '',
      colors.length > 0 ? `Available colors: ${colors.join(', ')}` : '',
      customPropsString ? `${customPropsString}` : '',
    ].filter(Boolean);

    const descriptionBase =
      descriptionParts.join('\n') ||
      `${product?.name}\nCheck out this piece on ${storeName}.`;

    const descriptionWithPrice = priceFormatted
      ? `Price: ${priceFormatted}\n${descriptionBase}`
      : descriptionBase;

    const getFirstImagePreviewUrl = () => {
      for (const variant of product?.variants ?? []) {
        for (const mediaItem of variant?.media ?? []) {
          const mediaUrl = mediaItem?.url?.trim();
          if (!mediaUrl) continue;
          if (mediaItem?.type === 'image') return mediaUrl;
        }
      }
      return 'asoebi-stacked-logo.svg';
    };

    const previewImageUrl = getFirstImagePreviewUrl();

    return {
      title: `${product?.name} - ${storeName}`,
      description: descriptionWithPrice,
      openGraph: {
        title: `${product?.name} - ${storeName}`,
        description: descriptionWithPrice,
        url: `https://asoebi.africa/products/${params.slug}`,
        siteName: storeName,
        images: [
          {
            url: previewImageUrl,
            alt: product?.name,
            height: 630,
            width: 1200,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product?.name} - ${storeName}`,
        description: descriptionWithPrice,
        images: [previewImageUrl],
      },
      ...(priceAmount > 0 && {
        other: {
          'og:price:amount': String(priceAmount),
          'og:price:currency': 'NGN',
        },
      }),
    };
  } catch (error) {
    //console.error('Error generating metadata:', error)
    return {
      title: 'Product Not Found - Asoebi Africa',
      description: 'This product could not be found',
    };
  }
}

export default async function product_details({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const product = await fetchProductBySlugWithTag(params.slug);

    return (
      <div>
        <Suspense fallback={null}>
          <ProductDetails product={product} />
        </Suspense>
      </div>
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : typeof error === 'string' ? error : 'Request failed';
    return <ProductLoadError message={message} />;
  }
}
