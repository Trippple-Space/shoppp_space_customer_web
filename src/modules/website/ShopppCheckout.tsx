'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  readStoredCart,
  writeStoredCart,
} from '@/modules/website/blocks/client';

interface Quote {
  subtotalKobo: number;
  discountKobo: number;
  shippingKobo: number;
  taxKobo: number;
  totalKobo: number;
}

interface CartLine {
  variantId: string;
  title: string;
  variantTitle: string;
  quantity: number;
  unitPriceKobo: number;
}

interface CartView {
  token: string;
  currency: string;
  lines: CartLine[];
  quote: Quote;
  deliveryMethodId: string | null;
  discountCode: string | null;
}

interface DeliveryOptions {
  zones: Array<{
    id: string;
    name: string;
    flatRateKobo: number;
    freeAboveKobo: number | null;
  }>;
  pickups: Array<{ id: string; name: string }>;
}

interface Placed {
  order: {
    id: string;
    number: number;
    statusToken: string;
    paymentStatus: string;
    totalKobo: number;
    currency: string;
  };
  payment: {
    reference: string;
    provider: string;
    authorizationUrl: string | null;
    status: string;
  };
}

function formatKobo(kobo: number, currency: string) {
  const major = kobo / 100;
  if (currency === 'NGN') {
    return `₦${major.toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `${major.toFixed(2)} ${currency}`;
}

export default function ShopppCheckout({ apiHost }: { apiHost: string }) {
  const params = useSearchParams();
  const storeId = params.get('store') ?? '';
  const host = apiHost.replace(/\/$/, '');
  const [cart, setCart] = useState<CartView | null>(null);
  const [options, setOptions] = useState<DeliveryOptions | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('Lagos');
  const [state, setState] = useState('Lagos');
  const [country, setCountry] = useState('NG');
  const [methodId, setMethodId] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [placed, setPlaced] = useState<Placed | null>(null);
  const [returned, setReturned] = useState<string | null>(null);

  useEffect(() => {
    if (!storeId) return;
    const stored = readStoredCart(storeId);
    if (!stored) {
      setError('Your cart is empty.');
      return;
    }
    const base = `${host}/public/stores/${encodeURIComponent(storeId)}/commerce`;
    void (async () => {
      const [cartRes, optRes] = await Promise.all([
        fetch(`${base}/carts/${encodeURIComponent(stored.token)}`),
        fetch(`${base}/delivery-options`),
      ]);
      if (!cartRes.ok) {
        setError('Cart could not be loaded.');
        return;
      }
      const view = (await cartRes.json()) as CartView;
      setCart(view);
      setMethodId(view.deliveryMethodId ?? '');
      setDiscountCode(view.discountCode ?? '');
      if (optRes.ok) setOptions((await optRes.json()) as DeliveryOptions);
    })();
  }, [storeId, host]);

  async function refresh(token: string, body: Record<string, unknown>) {
    const res = await fetch(
      `${host}/public/stores/${encodeURIComponent(storeId)}/commerce/carts/${encodeURIComponent(token)}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message ?? 'Could not update the cart');
    }
    setCart(data as CartView);
    return data as CartView;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!cart || !storeId) return;
    setBusy(true);
    setError(null);
    try {
      const view = await refresh(cart.token, {
        contact: { email, name, phone },
        address: { line1, city, state, country },
        deliveryMethodId: methodId || null,
        discountCode: discountCode || null,
      });
      const res = await fetch(
        `${host}/public/stores/${encodeURIComponent(storeId)}/commerce/checkouts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key':
              typeof crypto !== 'undefined' && 'randomUUID' in crypto
                ? crypto.randomUUID()
                : `checkout-${Date.now()}`,
          },
          body: JSON.stringify({
            token: view.token,
            contact: { email, name, phone },
            address: { line1, city, state, country },
            deliveryMethodId: methodId || null,
            discountCode: discountCode || null,
            acknowledgedTotalKobo: view.quote.totalKobo,
            provider: 'paystack',
          }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message ?? 'Checkout failed');
      }
      const result = data as Placed;
      setPlaced(result);
      writeStoredCart(storeId, { token: view.token, itemCount: 0, lines: [] });
      if (result.payment.authorizationUrl) {
        window.location.assign(result.payment.authorizationUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setBusy(false);
    }
  }

  async function onReturn() {
    if (!placed) return;
    setBusy(true);
    try {
      const res = await fetch(`${host}/public/commerce/payments/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: placed.payment.reference }),
      });
      const data = await res.json();
      setReturned(
        data.accepted
          ? 'Payment accepted.'
          : `Return recorded. Payment is still ${data.paymentStatus}. A provider webhook confirms it.`
      );
    } catch {
      setReturned('Could not record the return.');
    } finally {
      setBusy(false);
    }
  }

  if (!storeId) {
    return <p style={{ padding: 32 }}>Open checkout from the store cart.</p>;
  }

  return (
    <main
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '32px 20px 64px',
        color: '#02102D',
        fontFamily: 'inherit',
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Checkout</h1>
      {error ? (
        <p role="alert" style={{ color: '#9B1C1C' }}>
          {error}
        </p>
      ) : null}
      {placed ? (
        <section>
          <p>
            Order #{placed.order.number} is {placed.order.paymentStatus}. Total{' '}
            {formatKobo(placed.order.totalKobo, placed.order.currency)}.
          </p>
          <p>
            <a
              href={`/checkout/shoppp/status?token=${encodeURIComponent(placed.order.statusToken)}`}
            >
              View order status
            </a>
          </p>
          {!placed.payment.authorizationUrl ? (
            <button type="button" onClick={onReturn} disabled={busy}>
              I&apos;ve returned from payment
            </button>
          ) : null}
          {returned ? <p>{returned}</p> : null}
        </section>
      ) : (
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
          {(cart?.lines ?? []).map((line) => (
            <div key={line.variantId}>
              {line.title}
              {line.variantTitle ? ` (${line.variantTitle})` : ''} × {line.quantity}
            </div>
          ))}
          <label>
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ display: 'block', width: '100%', padding: 8 }}
            />
          </label>
          <label>
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ display: 'block', width: '100%', padding: 8 }}
            />
          </label>
          <label>
            Phone
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ display: 'block', width: '100%', padding: 8 }}
            />
          </label>
          <label>
            Address
            <input
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              style={{ display: 'block', width: '100%', padding: 8 }}
            />
          </label>
          <label>
            City
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{ display: 'block', width: '100%', padding: 8 }}
            />
          </label>
          <label>
            State
            <input
              value={state}
              onChange={(e) => setState(e.target.value)}
              style={{ display: 'block', width: '100%', padding: 8 }}
            />
          </label>
          <label>
            Country
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={{ display: 'block', width: '100%', padding: 8 }}
            />
          </label>
          <label>
            Delivery
            <select
              value={methodId}
              onChange={(e) => setMethodId(e.target.value)}
              style={{ display: 'block', width: '100%', padding: 8 }}
            >
              <option value="">No delivery charge</option>
              {(options?.zones ?? []).map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name} ({formatKobo(zone.flatRateKobo, cart?.currency ?? 'NGN')})
                </option>
              ))}
              {(options?.pickups ?? []).map((pickup) => (
                <option key={pickup.id} value={pickup.id}>
                  Pickup: {pickup.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Discount code
            <input
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              style={{ display: 'block', width: '100%', padding: 8 }}
            />
          </label>
          {cart ? (
            <p>
              Subtotal {formatKobo(cart.quote.subtotalKobo, cart.currency)}
              {' · '}
              Discount {formatKobo(cart.quote.discountKobo, cart.currency)}
              {' · '}
              Shipping {formatKobo(cart.quote.shippingKobo, cart.currency)}
              {' · '}
              <strong>
                Total {formatKobo(cart.quote.totalKobo, cart.currency)}
              </strong>
            </p>
          ) : (
            <p>Loading cart…</p>
          )}
          <button
            type="submit"
            disabled={busy || !cart || cart.lines.length === 0}
            style={{
              padding: '12px 18px',
              background: '#0357EE',
              color: '#fff',
              border: 0,
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            {busy ? 'Placing order…' : 'Place order'}
          </button>
        </form>
      )}
    </main>
  );
}
