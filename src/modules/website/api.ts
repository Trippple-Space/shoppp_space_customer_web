import config from 'env';
import type { ResolvedSite } from './types';

export type ResolveResult =
  | { status: 'ok'; site: ResolvedSite }
  | { status: 'not_found' }
  | { status: 'fetch_failed' };

/**
 * Server-side read of the PUBLISHED page for a store slug/host + path. Only the production release is ever
 * returned (drafts and previews live behind the merchant API). Cached briefly; tagged so a publish can
 * revalidate it (POST /api/revalidate/website).
 */
export async function resolvePublishedPage(params: {
  slug?: string;
  host?: string;
  path?: string;
  collection?: string;
}): Promise<ResolveResult> {
  const url = new URL(`${config.API_HOST}/public/website/resolve`);
  if (params.slug) url.searchParams.set('slug', params.slug);
  if (params.host) url.searchParams.set('host', params.host);
  url.searchParams.set('path', params.path || '/');
  if (params.collection) url.searchParams.set('collection', params.collection);
  const tag = `website:${(params.slug ?? params.host ?? '').toLowerCase()}`;
  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 30, tags: ['website', tag] },
    });
    if (res.status === 404) return { status: 'not_found' };
    if (!res.ok) return { status: 'fetch_failed' };
    return { status: 'ok', site: (await res.json()) as ResolvedSite };
  } catch (error) {
    console.error('Error resolving published page:', error);
    return { status: 'fetch_failed' };
  }
}
