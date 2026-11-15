export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { resolvePublishedPage } from '@/modules/website/api';
import { isReservedPath } from '@/modules/website/reserved-paths';
import { SaneeSite, siteMetadata } from '@/modules/website/SaneeSite';
import StorefrontFetchError from '@/modules/views/storefront/StorefrontFetchError';

type Props = {
  params: Promise<{ slug: string; sitePath: string[] }>;
  searchParams: Promise<{ collection?: string }>;
};

const pathOf = (sitePath: string[]) =>
  `/${sitePath.map(decodeURIComponent).join('/')}`;

/**
 * Inner pages of a published Sanee site: adaeze.shoppp.space/about -> /adaeze/about (see middleware).
 * Only pages that have a PRODUCTION release exist here; drafts and previews are 404.
 */
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug, sitePath } = await params;
  const { collection } = await searchParams;
  const path = pathOf(sitePath);
  if (isReservedPath(path)) return { title: 'Not found' };
  const published = await resolvePublishedPage({
    slug,
    path,
    collection,
  });
  return published.status === 'ok'
    ? siteMetadata(published.site)
    : { title: 'Page not found' };
}

export default async function SitePage({ params, searchParams }: Props) {
  const { slug, sitePath } = await params;
  const { collection } = await searchParams;
  const path = pathOf(sitePath);
  if (isReservedPath(path)) notFound();
  const published = await resolvePublishedPage({
    slug,
    path,
    collection,
  });
  if (published.status === 'fetch_failed')
    return <StorefrontFetchError reason="network" />;
  if (published.status === 'not_found') notFound();
  return <SaneeSite resolved={published.site} />;
}
