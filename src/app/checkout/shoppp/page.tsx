'use client';

import { Suspense } from 'react';
import config from 'env';
import ShopppCheckout from '@/modules/website/ShopppCheckout';

export default function ShopppCheckoutPage() {
  return (
    <Suspense fallback={<p style={{ padding: 32 }}>Loading checkout…</p>}>
      <ShopppCheckout apiHost={config.API_HOST} />
    </Suspense>
  );
}
