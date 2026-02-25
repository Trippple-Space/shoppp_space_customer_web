import Explore from '@/modules/views/explore/Explore';
import React, { Suspense } from 'react';

export default async function homepage() {
  return (
    <Suspense>
      <Explore />
    </Suspense>
  );
}
