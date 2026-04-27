'use client';

import SharedPaymentPage from '@/modules/views/shared-payment/SharedPaymentPage';
import { useParams } from 'next/navigation';
import React from 'react';

const Page = () => {
  const params = useParams();
  const shareToken = Array.isArray(params.shareToken)
    ? params.shareToken[0]
    : params.shareToken;

  return <SharedPaymentPage shareToken={shareToken || ''} />;
};

export default Page;
