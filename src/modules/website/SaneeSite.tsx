import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { SaneePage, releaseMetadata } from '@sanee/react';
import { defaultBlocks } from '@sanee/blocks';
import config from 'env';
import { createCommerceBlocks } from './blocks/commerce-blocks';
import { ShopppCartBridge } from './blocks/client';
import type { ResolvedSite } from './types';

/**
 * Renders a PUBLISHED Sanee release on the storefront (docs/host-integration-shoppp.md §6).
 * Server component: the page HTML is rendered on the server; only the commerce islands in ./blocks/client are
 * client components. This tree never imports @sanee/editor (enforced by `npm run check:no-editor`).
 */
export function SaneeSite({ resolved }: { resolved: ResolvedSite }) {
  const { release, site, data, store } = resolved;
  const blocks = { ...defaultBlocks, ...createCommerceBlocks(resolved) };
  const theme = {
    '--shoppp-ink': site.hostTheme.inkColor ?? '#02102D',
  } as CSSProperties;
  const contact = data.merchant.contact;
  return (
    <div style={theme} data-store={store.slug} data-release={release.id}>
      <ShopppCartBridge storeId={store.id} apiHost={config.API_HOST} />
      <SaneePage
        release={release}
        components={blocks}
        hostTheme={site.hostTheme}
        data={{
          locale: data.locale,
          currency: data.currency,
          merchant: data.merchant as never,
          commerce: data.commerce as never,
          navigation: data.navigation as never,
        }}
      />
      <footer
        style={{
          maxWidth: 1152,
          margin: '0 auto',
          padding: '32px 32px 48px',
          color: 'rgba(2,16,45,.62)',
          fontSize: 14,
        }}
      >
        <div>
          © {new Date().getFullYear()} {data.merchant.name}
          {contact.email ? (
            <>
              {' '}
              · <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </>
          ) : null}
          {contact.phone ? (
            <>
              {' '}
              ·{' '}
              <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}>
                {contact.phone}
              </a>
            </>
          ) : null}
          {contact.whatsapp ? (
            <>
              {' '}
              ·{' '}
              <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}>
                WhatsApp
              </a>
            </>
          ) : null}
        </div>
      </footer>
    </div>
  );
}

export function siteMetadata(resolved: ResolvedSite): Metadata {
  const meta = releaseMetadata(resolved.release);
  const title =
    resolved.page.path === '/'
      ? resolved.store.name
      : `${meta.title} · ${resolved.store.name}`;
  const description =
    meta.description || `${resolved.store.name} on Shoppp Space`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: resolved.store.name,
      images: resolved.store.thumbnail ? [resolved.store.thumbnail] : undefined,
    },
  };
}
