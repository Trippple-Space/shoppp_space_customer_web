import StoreAnalytics from '@/modules/views/storeanalytics/Storeanalytics';
import React, { Suspense } from 'react';

export default async function homepage() {
  return (
    <Suspense>
      <StoreAnalytics />
    </Suspense>
  );
}
