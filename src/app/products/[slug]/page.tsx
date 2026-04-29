import { productService } from '@/modules/lib/utility/services/product.service';
import ProductDetails from '@/modules/views/product-details/Product-details';
import React, { Suspense } from 'react';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const product = await productService.fetchProductBySlug(params.slug, {});

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
      sizes.length > 0 ? `Available sizes: ${sizes.join(', ')}\n` : '',
      colors.length > 0 ? `Available colors: ${colors.join(', ')}\n` : '',
      customPropsString ? `${customPropsString}\n` : '',
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
    const product = await productService.fetchProductBySlug(params.slug, {});

    return (
      <div>
        <Suspense fallback={null}>
          <ProductDetails product={product} />
        </Suspense>
      </div>
    );
  } catch (error) {
    // console.error('Error fetching product details:', error)
    return <div>Error fetching product details</div>;
  }
}
