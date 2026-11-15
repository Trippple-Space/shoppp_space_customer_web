'use client';

import BaseNavBar from '@/modules/lib/components/nav-bar/BaseNavBar';
import DataFetchErrorPanel from '@/modules/lib/components/data-fetch-error/DataFetchErrorPanel';
import {
  classifyFetchError,
  getProductDetailsErrorCopy,
} from '@/modules/lib/utility/fetch-error';
import { paths } from '@/modules/lib/utility/paths';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useMemo } from 'react';

const ProductLoadError: FC<{ message?: string }> = ({ message }) => {
  const router = useRouter();
  const kind = useMemo(
    () => classifyFetchError(message ? new Error(message) : new Error('Request failed')),
    [message]
  );
  const copy = useMemo(() => getProductDetailsErrorCopy(kind), [kind]);

  const onRetry = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <main className="min-h-screen bg-[#FFFFFF]">
      <BaseNavBar links={undefined} parent={undefined} />
      <div
        className="w-full flex flex-col items-center justify-center px-[24px] pt-[40px] pb-[40px]"
        style={{ minHeight: 'calc(100vh - 88px)', marginTop: 88 }}
      >
        <div className="w-full max-w-[480px]">
          <DataFetchErrorPanel
            title={copy.title}
            description={copy.description}
            onRetry={onRetry}
            retryLabel="Try again"
            extra={
              <Link
                href={paths.homepage}
                className="text-[14px] font-medium text-[#1677FF] hover:underline"
              >
                Back to home
              </Link>
            }
          />
        </div>
      </div>
    </main>
  );
};

export default ProductLoadError;
