import Homepage from '@/modules/views/homepage/Homepage';
import React, { Suspense } from 'react';
import { getCollections } from '@/modules/lib/utility/server/collections.server';
import { getCategories } from '@/modules/lib/utility/server/categories.server';
import config from 'env';

export const dynamic = 'force-dynamic';

const page = async () => {
  const initialCollections = await getCollections('global', config.API_HOST);
  const initialCategories = await getCategories(config.API_HOST, {
    type: 'fabrics',
    label: 'GLOBAL',
  });

  return (
    <Suspense fallback={<div />}>
      <Homepage
        initialCollections={initialCollections}
        initialCategories={initialCategories}
      />
    </Suspense>
  );
};

export default page;
