import { productService } from '@/modules/lib/utility/services/product.service';
import ProductDetails from '@/modules/views/product-details/Product-details';
import React from 'react';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const product = await productService.fetchProductBySlug(params.slug, {});

    const extractProductProperties = () => {
      const sizes = new Set<string>();
      const colors = new Set<string>();
      const customProperties: Record<string, Set<string>> = {};

      product.variants.forEach((variant) => {
        if (variant.size) sizes.add(variant.size);

        if (variant.properties?.color) colors.add(variant.properties.color);

        if (variant.properties) {
          Object.entries(variant.properties).forEach(([key, value]) => {
            if (key === 'color') return;
            if (!customProperties[key]) customProperties[key] = new Set();
            customProperties[key].add(
              Array.isArray(value) ? value.join(', ') : String(value)
            );
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

    const customPropsString = Object.entries(customProperties)
      .map(([key, values]) => `${key}: ${values.join(', ')}`)
      .join('. ');

    return {
      title: `${product?.name} - Asoebi Africa`,
      description:
        `${product?.longDescription}. Available sizes: ${sizes.join(', ')}. Available colors: ${colors.join(', ')}. ${customPropsString}.` ||
        `${product?.name}. Available sizes: ${sizes.join(', ')}. Available colors: ${colors.join(', ')}. ${customPropsString}. - Check out this piece on Asoebi Africa`,
      openGraph: {
        title: `${product?.name} - Asoebi Africa`,
        description:
          `${product?.longDescription}. Available sizes: ${sizes.join(', ')}. Available colors: ${colors.join(', ')}. ${customPropsString}.` ||
          `${product?.name}. Available sizes: ${sizes.join(', ')}. Available colors: ${colors.join(', ')}. ${customPropsString}. - Check out this piece on Asoebi Africa`,
        url: `https://asoebi.africa/products/${params.slug}`,
        siteName: 'Asoebi Africa',
        images: [
          {
            url:
              product?.variants?.[0]?.media?.[0]?.url ||
              'asoebi-stacked-logo.svg',
            alt: product?.name,
            height: 630,
            width: 1200,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product?.name} - Asoebi Africa`,
        description:
          `${product?.longDescription}. Available sizes: ${sizes.join(', ')}. Available colors: ${colors.join(', ')}. ${customPropsString}.` ||
          `${product?.name}. Available sizes: ${sizes.join(', ')}. Available colors: ${colors.join(', ')}. ${customPropsString}. - Check out this piece on Asoebi Africa`,
        images: [
          product?.variants?.[0]?.media?.[0]?.url || 'asoebi-stacked-logo.svg',
        ],
      },
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
        <ProductDetails product={product} />
      </div>
    );
  } catch (error) {
    // console.error('Error fetching product details:', error)
    return <div>Error fetching product details</div>;
  }
}
