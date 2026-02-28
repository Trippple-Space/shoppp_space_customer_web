import UpdateStore from '@/modules/views/store-owner/UpdateStore';
import React, { Suspense } from 'react';

export default async function homepage() {
  return (
    <Suspense>
      <UpdateStore />
    </Suspense>
  );
}
