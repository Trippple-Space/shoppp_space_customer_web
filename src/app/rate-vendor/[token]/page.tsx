import RateVendorPage from '@/modules/views/rate-vendor/RateVendorPage';

type PageProps = {
  params: { token?: string | string[] };
};

export default function Page({ params }: PageProps) {
  const token = Array.isArray(params.token) ? params.token[0] : params.token ?? '';
  return <RateVendorPage token={token} />;
}
