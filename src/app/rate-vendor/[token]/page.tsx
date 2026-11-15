import RateVendorPage from '@/modules/views/rate-vendor/RateVendorPage';

type PageProps = {
  params: Promise<{ token?: string | string[] }>;
};

export default async function Page({ params }: PageProps) {
  const { token: tokenParam } = await params;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam ?? '';
  return <RateVendorPage token={token} />;
}
