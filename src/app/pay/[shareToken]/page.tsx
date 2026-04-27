import SharedPaymentPage from '@/modules/views/shared-payment/SharedPaymentPage';
import config from 'env';
import type { Metadata } from 'next';
import endpoints from '@/modules/lib/utility/endpoints';
import { buildEndpoint } from '@/modules/lib/utility/utility';

type SharePageParams = {
  shareToken?: string | string[];
};

const getToken = (shareToken?: string | string[]) =>
  Array.isArray(shareToken) ? shareToken[0] : shareToken || '';

const getSharedSummary = async (shareToken: string) => {
  if (!shareToken) return null;

  try {
    const response = await fetch(
      `${config.API_HOST}/${buildEndpoint(endpoints.PAYMENT_SHARE_SUMMARY, {
        shareToken,
      })}`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    return null;
  }
};

export async function generateMetadata({
  params,
}: {
  params: SharePageParams;
}): Promise<Metadata> {
  const shareToken = getToken(params.shareToken);
  const summary = await getSharedSummary(shareToken);

  const firstItem = summary?.stores?.[0]?.items?.[0];
  const firstImage = firstItem?.variantImage;
  const title = 'Asoebi shared checkout payment';
  const description =
    summary?.message ||
    `Help complete this order payment on Asoebi${firstItem?.productName ? ` - starting with ${firstItem.productName}` : ''}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: firstImage ? [{ url: firstImage }] : undefined,
    },
    twitter: {
      card: firstImage ? 'summary_large_image' : 'summary',
      title,
      description,
      images: firstImage ? [firstImage] : undefined,
    },
  };
}

const Page = async ({ params }: { params: SharePageParams }) => {
  const shareToken = getToken(params.shareToken);
  return <SharedPaymentPage shareToken={shareToken} />;
};

export default Page;
