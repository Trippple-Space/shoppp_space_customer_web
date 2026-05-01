'use client';

import BaseNavBar from '@/modules/lib/components/nav-bar/BaseNavBar';
import DataFetchErrorPanel from '@/modules/lib/components/data-fetch-error/DataFetchErrorPanel';
import { getStoreFetchErrorCopy, type FetchErrorKind } from '@/modules/lib/utility/fetch-error';
import { useRouter } from 'next/navigation';
import { FC, useCallback } from 'react';

const StorefrontFetchError: FC<{ reason?: FetchErrorKind }> = ({ reason = 'unknown' }) => {
  const router = useRouter();
  const onRetry = useCallback(() => {
    router.refresh();
  }, [router]);

  const copy = getStoreFetchErrorCopy(reason);

  return (
    <main className="flex min-h-screen flex-col bg-#FFFFFF">
      <BaseNavBar links={undefined} parent={undefined} />
      <div className="flex flex-1 items-center justify-center px-24 py-48">
        <div className="w-full max-w-480">
          <DataFetchErrorPanel
            title={copy.title}
            description={copy.description}
            onRetry={onRetry}
            retryLabel="Refresh page"
          />
        </div>
      </div>
    </main>
  );
};

export default StorefrontFetchError;
