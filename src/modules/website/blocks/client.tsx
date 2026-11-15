'use client';

/**
 * The ONLY client boundaries of a published Sanee page (docs/host-integration-shoppp.md §6.6): variant
 * selection, live price for the selected variant, add-to-cart, cart indicator, search. Everything else is
 * server-rendered. Nothing here imports @sanee/editor.
 */
import { useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import { create } from 'zustand';
import { formatMinor } from '../money';
import type { PublicProduct, PublicVariant } from '../types';

type Chosen = Record<string, string>;

/** Variant choices per product, shared by the VariantSelector, Price and AddToCart blocks on one page. */
const useSelection = create<{
  chosen: Record<string, Chosen>;
  choose: (productId: string, option: string, value: string) => void;
}>((set) => ({
  chosen: {},
  choose: (productId, option, value) =>
    set((s) => ({
      chosen: {
        ...s.chosen,
        [productId]: { ...s.chosen[productId], [option]: value },
      },
    })),
}));

export function pickVariant(
  product: PublicProduct,
  chosen: Chosen | undefined,
  explicitVariantId?: string | null
): PublicVariant | undefined {
  if (explicitVariantId) {
    const v = product.variants.find((x) => x.id === explicitVariantId);
    if (v) return v;
  }
  const picked = chosen ?? {};
  const match = product.variants.find((v) =>
    product.options.every(
      (o) => !picked[o.name] || v.optionValues[o.name] === picked[o.name]
    )
  );
  return (
    match ?? product.variants.find((v) => v.inStock) ?? product.variants[0]
  );
}

const ink = 'var(--shoppp-ink, #02102D)';
const brand = 'var(--sanee-color-primary, #0357EE)';

export function VariantSelector({
  product,
  display = 'buttons',
}: {
  product: PublicProduct;
  display?: 'buttons' | 'dropdown';
}) {
  const chosen = useSelection((s) => s.chosen[product.id]);
  const choose = useSelection((s) => s.choose);
  if (product.options.length === 0) return null;
  const current = pickVariant(product, chosen);
  return (
    <div className="shoppp-variants" style={{ display: 'grid', gap: 12 }}>
      {product.options.map((option) => {
        const selected =
          chosen?.[option.name] ?? current?.optionValues[option.name];
        return (
          <fieldset
            key={option.name}
            style={{ border: 0, padding: 0, margin: 0 }}
          >
            <legend
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: ink,
                marginBottom: 6,
              }}
            >
              {option.name}
            </legend>
            {display === 'dropdown' ? (
              <select
                aria-label={option.name}
                value={selected}
                onChange={(e) =>
                  choose(product.id, option.name, e.target.value)
                }
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(2,16,45,.2)',
                }}
              >
                {option.values.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {option.values.map((value) => {
                  const active = value === selected;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => choose(product.id, option.name, value)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        border: `1px solid ${active ? brand : 'rgba(2,16,45,.2)'}`,
                        background: active ? brand : '#fff',
                        color: active ? '#fff' : ink,
                        fontWeight: 500,
                      }}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            )}
          </fieldset>
        );
      })}
    </div>
  );
}

export function PriceView({
  product,
  variantId,
  showCompareAt = true,
  currency,
  locale,
  style,
}: {
  product: PublicProduct;
  variantId?: string | null;
  showCompareAt?: boolean;
  currency: string;
  locale: string;
  style?: CSSProperties;
}) {
  const chosen = useSelection((s) => s.chosen[product.id]);
  const variant = pickVariant(product, chosen, variantId);
  if (!variant) return null;
  const compare =
    showCompareAt &&
    variant.compareAtPriceMinor &&
    variant.compareAtPriceMinor > variant.priceMinor;
  return (
    <span
      style={{
        display: 'inline-flex',
        gap: 8,
        alignItems: 'baseline',
        ...style,
      }}
    >
      <strong style={{ color: ink }}>
        {formatMinor(variant.priceMinor, currency, locale)}
      </strong>
      {compare ? (
        <s style={{ color: 'rgba(2,16,45,.55)', fontSize: '0.85em' }}>
          {formatMinor(variant.compareAtPriceMinor as number, currency, locale)}
        </s>
      ) : null}
    </span>
  );
}

export function AddToCart({
  product,
  variantId,
  label = 'Add to cart',
  checkoutEnabled,
  storeId,
}: {
  product: PublicProduct;
  variantId?: string | null;
  label?: string;
  checkoutEnabled: boolean;
  storeId: string;
}) {
  const chosen = useSelection((s) => s.chosen[product.id]);
  const variant = pickVariant(product, chosen, variantId);
  const soldOut = !variant?.inStock;
  const disabled = !checkoutEnabled || soldOut || !variant;
  const text = soldOut
    ? 'Sold out'
    : !checkoutEnabled
      ? 'Checkout opens soon'
      : label;
  return (
    <button
      type="button"
      disabled={disabled}
      aria-disabled={disabled}
      title={
        !checkoutEnabled ? 'This store is in catalog-only mode' : undefined
      }
      onClick={() => {
        if (disabled || !variant) return;
        // Tranche 4 (payments/cart) listens for this; until then checkout is off and the button is disabled.
        window.dispatchEvent(
          new CustomEvent('shoppp:add-to-cart', {
            detail: {
              storeId,
              productId: product.id,
              variantId: variant.id,
              quantity: 1,
            },
          })
        );
      }}
      style={{
        padding: '12px 22px',
        borderRadius: 8,
        border: 0,
        fontWeight: 600,
        fontSize: 16,
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: disabled ? 'rgba(2,16,45,.12)' : brand,
        color: disabled ? 'rgba(2,16,45,.6)' : '#fff',
      }}
    >
      {text}
    </button>
  );
}

export function CartIndicator({
  showCount = true,
  checkoutEnabled,
  storeId,
}: {
  showCount?: boolean;
  checkoutEnabled: boolean;
  storeId: string;
}) {
  const count = useShopppCart((s) => s.count);
  useEffect(() => {
    const saved = readStoredCart(storeId);
    if (saved) useShopppCart.getState().setCount(saved.itemCount);
  }, [storeId]);
  return (
    <a
      href={
        checkoutEnabled
          ? `/checkout/shoppp?store=${encodeURIComponent(storeId)}`
          : undefined
      }
      aria-label="Cart"
      aria-disabled={!checkoutEnabled}
      title={checkoutEnabled ? 'Cart' : 'Checkout opens soon'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        color: ink,
        textDecoration: 'none',
        opacity: checkoutEnabled ? 1 : 0.55,
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M6 6h15l-1.5 9h-12z" />
        <path d="M6 6 5 3H2" />
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
      </svg>
      {showCount ? <span style={{ fontWeight: 600 }}>{count}</span> : null}
    </a>
  );
}

interface SearchHit {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  minPriceMinor: number | null;
}

export function SearchBox({
  placeholder = 'Search products',
  storeId,
  apiHost,
  currency,
  locale,
}: {
  placeholder?: string;
  storeId: string;
  apiHost: string;
  currency: string;
  locale: string;
}) {
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<SearchHit[] | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return setHits(null);
    setBusy(true);
    try {
      const res = await fetch(
        `${apiHost}/public/stores/${encodeURIComponent(storeId)}/catalog/products?q=${encodeURIComponent(term)}&limit=8`
      );
      const body = (await res.json()) as { items?: SearchHit[] };
      setHits(body.items ?? []);
    } catch {
      setHits([]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      role="search"
      onSubmit={submit}
      style={{ position: 'relative', maxWidth: 420 }}
    >
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: 8,
          border: '1px solid rgba(2,16,45,.2)',
        }}
      />
      {hits ? (
        <ul
          style={{
            position: 'absolute',
            zIndex: 10,
            left: 0,
            right: 0,
            margin: '6px 0 0',
            padding: 6,
            listStyle: 'none',
            background: '#fff',
            border: '1px solid rgba(2,16,45,.12)',
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(2,16,45,.12)',
          }}
        >
          {busy ? <li style={{ padding: 8 }}>Searching…</li> : null}
          {!busy && hits.length === 0 ? (
            <li style={{ padding: 8 }}>No products found</li>
          ) : null}
          {hits.map((h) => (
            <li key={h.id}>
              <a
                href={`/products/${h.slug}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: 8,
                  color: ink,
                  textDecoration: 'none',
                }}
              >
                <span>{h.title}</span>
                {h.minPriceMinor !== null ? (
                  <span>{formatMinor(h.minPriceMinor, currency, locale)}</span>
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </form>
  );
}

interface StoredCartLine {
  variantId: string;
  quantity: number;
}

interface StoredCart {
  token: string;
  itemCount: number;
  lines: StoredCartLine[];
}

const cartKey = (storeId: string) => `shoppp.cart.${storeId}`;

export function readStoredCart(storeId: string): StoredCart | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(cartKey(storeId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredCart;
    if (!parsed?.token) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeStoredCart(storeId: string, cart: StoredCart) {
  window.localStorage.setItem(cartKey(storeId), JSON.stringify(cart));
}

/** Count shared by the cart indicator and the add-to-cart bridge. */
export const useShopppCart = create<{
  count: number;
  setCount: (count: number) => void;
}>((set) => ({
  count: 0,
  setCount: (count) => set({ count }),
}));

const cartQueue = new Map<string, Promise<void>>();

async function addVariantToCart(
  storeId: string,
  apiHost: string,
  variantId: string,
  quantity: number
): Promise<number> {
  const host = apiHost.replace(/\/$/, '');
  const base = `${host}/public/stores/${encodeURIComponent(storeId)}/commerce/carts`;
  let stored = readStoredCart(storeId);

  const open = async () => {
    const res = await fetch(base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    });
    if (!res.ok) throw new Error('Could not open a cart');
    const created = (await res.json()) as { token: string };
    stored = { token: created.token, itemCount: 0, lines: [] };
    writeStoredCart(storeId, stored);
  };

  if (!stored) await open();
  const current =
    stored?.lines.find((line) => line.variantId === variantId)?.quantity ?? 0;
  const patch = async (token: string, nextQuantity: number) =>
    fetch(`${base}/${encodeURIComponent(token)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lines: [{ variantId, quantity: nextQuantity }],
      }),
    });

  let res = await patch(stored!.token, current + quantity);
  if (res.status === 404 || res.status === 409) {
    window.localStorage.removeItem(cartKey(storeId));
    stored = null;
    await open();
    res = await patch(stored!.token, quantity);
  }
  if (!res.ok) throw new Error('Could not add to cart');
  const view = (await res.json()) as {
    lines?: Array<{ variantId: string; quantity: number }>;
  };
  const lines = (view.lines ?? []).map((line) => ({
    variantId: line.variantId,
    quantity: line.quantity,
  }));
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  writeStoredCart(storeId, { token: stored!.token, itemCount, lines });
  return itemCount;
}

/**
 * Listens for `shoppp:add-to-cart` from the Sanee AddToCart block and writes the line
 * through the public cart API. One bridge per published page.
 */
export function ShopppCartBridge({
  storeId,
  apiHost,
}: {
  storeId: string;
  apiHost: string;
}) {
  const setCount = useShopppCart((s) => s.setCount);
  useEffect(() => {
    const saved = readStoredCart(storeId);
    if (saved) setCount(saved.itemCount);
    const onAdd = (event: Event) => {
      const detail = (
        event as CustomEvent<{
          storeId?: string;
          variantId?: string;
          quantity?: number;
        }>
      ).detail;
      if (!detail?.variantId) return;
      if (detail.storeId && detail.storeId !== storeId) return;
      const variantId = detail.variantId;
      const quantity = detail.quantity ?? 1;
      const prev = cartQueue.get(storeId) ?? Promise.resolve();
      const next = prev
        .catch(() => undefined)
        .then(() => addVariantToCart(storeId, apiHost, variantId, quantity))
        .then((count) => setCount(count))
        .catch(() => undefined);
      cartQueue.set(storeId, next);
    };
    window.addEventListener('shoppp:add-to-cart', onAdd);
    return () => window.removeEventListener('shoppp:add-to-cart', onAdd);
  }, [storeId, apiHost, setCount]);
  return null;
}
