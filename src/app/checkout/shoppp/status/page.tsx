'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import config from 'env';

interface StatusView {
  number: number;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  currency: string;
  totalKobo: number;
  lines: Array<{ title: string; variantTitle: string; quantity: number }>;
}

function ShopppOrderStatusPage() {
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const [status, setStatus] = useState<StatusView | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    const host = config.API_HOST.replace(/\/$/, '');
    void fetch(
      `${host}/public/commerce/orders/${encodeURIComponent(token)}`
    )
      .then(async (res) => {
        if (!res.ok) throw new Error('Order not found');
        setStatus((await res.json()) as StatusView);
      })
      .catch((err: Error) => setError(err.message));
  }, [token]);

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: 32, color: '#02102D' }}>
      <h1>Order status</h1>
      {error ? <p>{error}</p> : null}
      {!token ? <p>Missing status token.</p> : null}
      {status ? (
        <section>
          <p>
            Order #{status.number} · {status.paymentStatus} · {status.fulfillmentStatus}
          </p>
          <ul>
            {status.lines.map((line) => (
              <li key={`${line.title}-${line.variantTitle}`}>
                {line.title}
                {line.variantTitle ? ` (${line.variantTitle})` : ''} × {line.quantity}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p style={{ padding: 32 }}>Loading order…</p>}>
      <ShopppOrderStatusPage />
    </Suspense>
  );
}
