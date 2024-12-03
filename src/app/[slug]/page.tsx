import { productService } from '@/modules/lib/utility/services/product.service';
import { storeService } from '@/modules/lib/utility/services/store.service'
import Storefront from '@/modules/views/storefront/Storefront'
import StorefrontAbout from '@/modules/views/storefront/StorefrontAbout'
import StorefrontLayout from '@/modules/views/storefront/StorefrontLayout';
import React from 'react'


export default async function storeFront({ params }: { params: { slug: string } }) {

  
  const store = await storeService.fetchStoreBySlug(params.slug, {});
  return <StorefrontLayout store={store} >
    <StorefrontAbout store={store} />
    </StorefrontLayout>
}