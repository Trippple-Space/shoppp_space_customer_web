import { productService } from '@/modules/lib/utility/services/product.service'
import ProductDetails from '@/modules/views/product-details/Product-details'
import React from 'react'
import Head from 'next/head'
import type { Metadata } from 'next'

export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise<Metadata> {
  try {
    const product = await productService.fetchProductBySlug(params.slug, {})


    return {
      title: `${product?.name} - Asoebi Africa`,
      description:
        `${product?.longDescription}` ||
        `${product?.name} - Check out this piece on Asoebi Africa`,
      openGraph: {
        title: `${product?.name} - Asoebi Africa`,
        description:
          `${product?.longDescription}` ||
          `${product?.name} - Check out this piece on Asoebi Africa`,
        url: `https://staging.asoebi.africa/products/${params.slug}`,
        siteName: 'Asoebi Africa',
        images: [
          {
            url:
              product?.variants?.[0]?.media?.[0]?.url || 'new-asoebi-logo.svg',
            alt: product?.name,
            height: 630,
            width: 1200
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product?.name} - Asoebi Africa`,
        description:
          `${product?.longDescription}` ||
          `${product?.name} - Check out this piece on Asoebi Africa`,
        images: [
          product?.variants?.[0]?.media?.[0]?.url || 'new-asoebi-logo.svg'
        ]
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Product Not Found - Asoebi Africa',
      description: 'This product could not be found'
    }
  }
}


export default async function product_details({
  params
}: {
  params: { slug: string }
}) {
  try {
    const product = await productService.fetchProductBySlug(params.slug, {})

    return (
      <>
        <Head>
          <title>{product.name} - Asoebi Africa</title>
          <meta name="description" content={product.longDescription || `${product.name} - Check out this piece on Asoebi Africa`} />
          <meta property="og:title" content={`${product.name} - Asoebi Africa`} />
          <meta property="og:description" content={product.longDescription || `${product.name} - Check out this piece on Asoebi Africa`} />
          <meta property="og:url" content={`https://staging.asoebi.africa/products/${params.slug}`} />
          <meta property="og:image" content={product.variants?.[0]?.media?.[0]?.url || 'new-asoebi-logo.svg'} />
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:title" content={`${product.name} - Asoebi Africa`} />
          <meta property="twitter:description" content={product.longDescription || `${product.name} - Check out this piece on Asoebi Africa`} />
          <meta property="twitter:image" content={product.variants?.[0]?.media?.[0]?.url || 'new-asoebi-logo.svg'} />
        </Head>
        <div>
          <ProductDetails product={product} />
        </div>
      </>
    )
  } catch (error) {
    console.error('Error fetching product details:', error)
    return <div>Error fetching product details</div>
  }
}
