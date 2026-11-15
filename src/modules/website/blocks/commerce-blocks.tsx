import type { CSSProperties, ComponentType, ReactNode } from 'react';
import { isAllowedUrl } from '@sanee/core';
import type { SaneeNode } from '@sanee/core';
import config from 'env';
import { formatMinor, priceRange } from '../money';
import type { PublicCollection, PublicProduct, ResolvedSite } from '../types';
import {
  AddToCart,
  CartIndicator,
  PriceView,
  SearchBox,
  VariantSelector,
} from './client';

type BlockProps = { node: SaneeNode; children: ReactNode };
export type CommerceBlockRegistry = Record<string, ComponentType<BlockProps>>;

const ink = 'var(--shoppp-ink, #02102D)';
const muted = 'rgba(2,16,45,.62)';

const str = (v: unknown): string | undefined =>
  typeof v === 'string' && v ? v : undefined;
const num = (v: unknown, fallback: number, min: number, max: number) =>
  typeof v === 'number' && Number.isFinite(v)
    ? Math.min(Math.max(v, min), max)
    : fallback;

/** Re-check at render: a stored URL is only used when it passes the Sanee URL policy. */
const safeSrc = (url: string | null | undefined) =>
  url && isAllowedUrl(url) ? url : undefined;

/**
 * Host components for the Shoppp commerce blocks (versioned in the API: website/commerce/commerce-blocks.ts).
 * Pages only carry typed ids; every title, image, price and stock flag below is read from `data`, which the API
 * resolved from the LIVE catalog for this request.
 *
 * Built per request because Sanee passes blocks only `{ node, children }`; the closure carries the data.
 * These are server components except the explicit client islands in ./client.
 */
export function createCommerceBlocks(
  resolved: ResolvedSite
): CommerceBlockRegistry {
  const { data, store } = resolved;
  const products = new Map<string, PublicProduct>(
    data.products.map((p) => [p.id, p])
  );
  const collections = new Map<string, PublicCollection>(
    data.collections.map((c) => [c.id, c])
  );
  const { currency, locale } = data;
  const checkoutEnabled = data.commerce.checkoutEnabled;
  const productOf = (node: SaneeNode) =>
    products.get(String(node.props.productId ?? '').toLowerCase());

  function Card({
    product,
    showPrice = true,
    showAvailability = true,
    aspect = 'square',
  }: {
    product: PublicProduct;
    showPrice?: boolean;
    showAvailability?: boolean;
    aspect?: string;
  }) {
    const ratio =
      aspect === 'portrait'
        ? '4 / 5'
        : aspect === 'landscape'
          ? '4 / 3'
          : '1 / 1';
    const image = safeSrc(product.thumbnail);
    return (
      <article
        className="shoppp-product-card"
        style={{ display: 'grid', gap: 10 }}
      >
        <a
          href={`/products/${product.slug}`}
          style={{
            color: ink,
            textDecoration: 'none',
            display: 'grid',
            gap: 10,
          }}
        >
          <div
            style={{
              aspectRatio: ratio,
              background: '#EAF1FE',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={product.media[0]?.altText ?? product.title}
                loading="lazy"
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : null}
          </div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
            {product.title}
          </h3>
        </a>
        {showPrice ? (
          <div style={{ fontWeight: 600 }}>
            {priceRange(
              product.minPriceMinor,
              product.maxPriceMinor,
              currency,
              locale
            )}
          </div>
        ) : null}
        {showAvailability ? (
          <div
            style={{ fontSize: 13, color: product.inStock ? '#0A7A3D' : muted }}
          >
            {product.inStock ? 'In stock' : 'Sold out'}
          </div>
        ) : null}
      </article>
    );
  }

  const ProductCard = ({ node }: BlockProps) => {
    const product = productOf(node);
    if (!product) return null;
    return (
      <Card
        product={product}
        showPrice={node.props.showPrice !== false}
        showAvailability={node.props.showAvailability !== false}
        aspect={str(node.props.imageAspect)}
      />
    );
  };

  const ProductGrid = ({ node }: BlockProps) => {
    const cols = num(node.props.columns, 4, 1, 6);
    const ids = data.grids[node.id] ?? [];
    const list = ids
      .map((id) => products.get(id))
      .filter((p): p is PublicProduct => !!p);
    if (list.length === 0) return null;
    const style: CSSProperties = {
      display: 'grid',
      gap: 24,
      gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${Math.round(960 / cols)}px), 1fr))`,
    };
    return (
      <div className="shoppp-product-grid" style={style}>
        {list.map((p) => (
          <Card
            key={p.id}
            product={p}
            showPrice={node.props.showPrice !== false}
          />
        ))}
      </div>
    );
  };

  const collectionHref = (c: PublicCollection) =>
    `?collection=${encodeURIComponent(c.slug)}`;

  const CollectionGrid = ({ node }: BlockProps) => {
    const cols = num(node.props.columns, 3, 1, 6);
    const list = (data.collectionLists[node.id] ?? [])
      .map((id) => collections.get(id))
      .filter((c): c is PublicCollection => !!c);
    if (list.length === 0) return null;
    return (
      <div
        className="shoppp-collection-grid"
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${Math.round(900 / cols)}px), 1fr))`,
        }}
      >
        {list.map((c) => (
          <a
            key={c.id}
            href={collectionHref(c)}
            style={{
              padding: 24,
              borderRadius: 12,
              background: '#EAF1FE',
              color: ink,
              textDecoration: 'none',
              display: 'grid',
              gap: 6,
            }}
          >
            <strong style={{ fontSize: 18 }}>{c.title}</strong>
            {c.description ? (
              <span style={{ color: muted, fontSize: 14 }}>
                {c.description}
              </span>
            ) : null}
          </a>
        ))}
      </div>
    );
  };

  const FeaturedProduct = ({ node }: BlockProps) => {
    const product = productOf(node);
    if (!product) return null;
    const mediaId = str(node.props.mediaId);
    const media =
      product.media.find((m) => m.id === mediaId) ?? product.media[0];
    const image = safeSrc(media?.url);
    const right = node.props.layout === 'image-right';
    return (
      <section
        className="shoppp-featured"
        style={{
          display: 'grid',
          gap: 32,
          alignItems: 'center',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        }}
      >
        <div
          style={{
            order: right ? 2 : 1,
            aspectRatio: '1 / 1',
            background: '#EAF1FE',
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={media?.altText ?? product.title}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : null}
        </div>
        <div style={{ order: right ? 1 : 2, display: 'grid', gap: 16 }}>
          <h2 style={{ margin: 0, fontSize: 32, color: ink }}>
            {product.title}
          </h2>
          <PriceView
            product={product}
            currency={currency}
            locale={locale}
            style={{ fontSize: 22 }}
          />
          {node.props.showDescription !== false && product.description ? (
            <p style={{ margin: 0, color: muted, lineHeight: 1.6 }}>
              {product.description}
            </p>
          ) : null}
          <VariantSelector product={product} />
          <div>
            <AddToCart
              product={product}
              checkoutEnabled={checkoutEnabled}
              storeId={store.id}
            />
          </div>
        </div>
      </section>
    );
  };

  const Price = ({ node }: BlockProps) => {
    const product = productOf(node);
    if (!product) return null;
    return (
      <PriceView
        product={product}
        variantId={str(node.props.variantId)}
        showCompareAt={node.props.showCompareAt !== false}
        currency={currency}
        locale={locale}
      />
    );
  };

  const Availability = ({ node }: BlockProps) => {
    const product = productOf(node);
    if (!product) return null;
    const variant = product.variants.find(
      (v) => v.id === str(node.props.variantId)
    );
    const inStock = variant ? variant.inStock : product.inStock;
    return (
      <span style={{ fontSize: 14, color: inStock ? '#0A7A3D' : muted }}>
        {inStock ? 'In stock' : 'Sold out'}
      </span>
    );
  };

  const VariantSelectorBlock = ({ node }: BlockProps) => {
    const product = productOf(node);
    if (!product) return null;
    return (
      <VariantSelector
        product={product}
        display={node.props.style === 'dropdown' ? 'dropdown' : 'buttons'}
      />
    );
  };

  const AddToCartBlock = ({ node }: BlockProps) => {
    const product = productOf(node);
    if (!product) return null;
    return (
      <AddToCart
        product={product}
        variantId={str(node.props.variantId)}
        label={str(node.props.label)}
        checkoutEnabled={checkoutEnabled}
        storeId={store.id}
      />
    );
  };

  const CartIndicatorBlock = ({ node }: BlockProps) => (
    <CartIndicator
      showCount={node.props.showCount !== false}
      checkoutEnabled={checkoutEnabled}
      storeId={store.id}
    />
  );

  const SearchBoxBlock = ({ node }: BlockProps) => (
    <SearchBox
      placeholder={str(node.props.placeholder)}
      storeId={store.id}
      apiHost={config.API_HOST}
      currency={currency}
      locale={locale}
    />
  );

  const CollectionFilter = ({ node }: BlockProps) => {
    const list = (data.collectionLists[node.id] ?? [])
      .map((id) => collections.get(id))
      .filter((c): c is PublicCollection => !!c);
    if (list.length === 0) return null;
    const pill = (active: boolean): CSSProperties => ({
      padding: '6px 14px',
      borderRadius: 999,
      textDecoration: 'none',
      fontSize: 14,
      fontWeight: 500,
      border: '1px solid rgba(2,16,45,.2)',
      background: active ? ink : '#fff',
      color: active ? '#fff' : ink,
    });
    return (
      <nav
        aria-label="Collections"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
      >
        <a href="?" style={pill(!data.activeCollection)}>
          All
        </a>
        {list.map((c) => (
          <a
            key={c.id}
            href={collectionHref(c)}
            style={pill(data.activeCollection === c.slug)}
            aria-current={data.activeCollection === c.slug ? 'true' : undefined}
          >
            {c.title}
          </a>
        ))}
      </nav>
    );
  };

  return {
    ProductCard,
    ProductGrid,
    CollectionGrid,
    FeaturedProduct,
    Price,
    Availability,
    VariantSelector: VariantSelectorBlock,
    AddToCart: AddToCartBlock,
    CartIndicator: CartIndicatorBlock,
    SearchBox: SearchBoxBlock,
    CollectionFilter,
  };
}

export { formatMinor };
