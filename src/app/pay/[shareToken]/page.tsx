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

const getSharerFirstName = (summary: any): string | null => {
  const firstName =
    summary?.sharedByFirstName || '';

  if (typeof firstName !== 'string') return null;
  const trimmed = firstName.trim();
  if (!trimmed) return null;
  return trimmed.split(/\s+/)[0];
};

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
  params: Promise<SharePageParams>;
}): Promise<Metadata> {
  const shareToken = getToken((await params).shareToken);
  const summary = await getSharedSummary(shareToken);

  const firstItem = summary?.stores?.[0]?.items?.[0];
  const firstImage = firstItem?.variantImage;
  const sharerFirstName = getSharerFirstName(summary);
  const title = sharerFirstName
    ? `${sharerFirstName} wants you to complete a payment on Shoppp Space`
    : 'Complete a payment on Shoppp Space';
  const description =
    summary?.message ||
    `Help complete this order payment on Shoppp Space${firstItem?.productName ? ` - starting with ${firstItem.productName}` : ''}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: firstImage ? [{ url: firstImage }] : undefined,
      siteName: 'Shoppp Space',
      url: `https://shoppp.space/pay/${shareToken}`,
    },
    twitter: {
      card: firstImage ? 'summary_large_image' : 'summary',
      title,
      description,
      images: firstImage ? [firstImage] : undefined,
    },
  };
}

const Page = async ({ params }: { params: Promise<SharePageParams> }) => {
  const shareToken = getToken((await params).shareToken);
  return <SharedPaymentPage shareToken={shareToken} />;
};

export default Page;
