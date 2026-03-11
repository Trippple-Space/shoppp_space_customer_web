import Homepage from '@/modules/views/homepage/Homepage';
import React, { Suspense } from 'react';
import { getCollections } from '@/modules/lib/utility/server/collections.server';
import config from 'env';

export const dynamic = 'force-dynamic';

const page = async () => {
  const initialCollections = await getCollections('global', config.API_HOST);

  return (
    <Suspense fallback={<div />}>
      <Homepage initialCollections={initialCollections} />
    </Suspense>
  );
};

export default page;
