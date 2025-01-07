import { productService } from '@/modules/lib/utility/services/product.service'
import ProductDetails from '@/modules/views/product-details/Product-details'
import React from 'react'

export default async function product_details({
  params
}: {
  params: { slug: string }
}) {
  try {
    const product = await productService.fetchProductBySlug(params.slug, {})

    return (
        <div>
          <ProductDetails product={product} />
        </div>
    )
  } catch (error) {
    console.error('Error fetching product details:', error)
    return <div>Error fetching product details</div>
  }
}
