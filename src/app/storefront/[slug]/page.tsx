import { storeService } from '@/modules/lib/utility/services/store.service'
import Storefront from '@/modules/views/storefront/Storefront'
import React from 'react'


export default async function storeFront({ params }: { params: { slug: string } }) {
  const store = await storeService.fetchStoreBySlug(params.slug, {})
  console.log({store})
  return <Storefront store={store}  />
}