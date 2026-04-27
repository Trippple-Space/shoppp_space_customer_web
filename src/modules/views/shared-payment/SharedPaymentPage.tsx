'use client';

import Footer from '@/modules/lib/components/footer/Footer';
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar';
import PuffLoader from '@/modules/lib/components/puff-loader/PuffLoader';
import { paymentService } from '@/modules/lib/utility/services/payment.service';
import {
  SharedCheckoutItem,
  SharedCheckoutSummaryResponse,
} from '@/modules/lib/utility/types/payment.interface';
import { formatNumberAsPrice } from '@/modules/lib/utility/utility';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface SharedPaymentPageProps {
  shareToken: string;
}

const SharedPaymentPage = ({ shareToken }: SharedPaymentPageProps) => {
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [summary, setSummary] = useState<SharedCheckoutSummaryResponse | null>(null);
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await paymentService.getSharedCheckoutSummary(shareToken);
        setSummary(response);
      } catch (error) {
        setErrorMessage('Unable to load this shared payment link.');
      } finally {
        setLoading(false);
      }
    };

    if (!shareToken) {
      setErrorMessage('Invalid share token.');
      setLoading(false);
      return;
    }

    fetchSummary();
  }, [shareToken]);

  const totalToPay = useMemo(() => {
    if (!summary) return 0;
    return summary.totalToPaySmallestUnit / 100;
  }, [summary]);

  const handlePay = async () => {
    if (!summary || summary.paid) return;
    if (!email.trim()) {
      toast.error('Email is required to continue.');
      return;
    }

    try {
      setPaying(true);
      const response = await paymentService.getSharedPaystackLink(shareToken, {
        email: email.trim(),
      });
      const parsedUrl = new URL(response.paymentLink);
      if (!parsedUrl.hostname.includes('paystack.com')) {
        throw new Error('Invalid paystack url');
      }
      window.location.assign(parsedUrl.toString());
    } catch (error) {
      toast.error('Unable to start payment. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  const renderLineItem = (item: SharedCheckoutItem, key: string) => {
    const size = Object.keys(item.size || {}).length
      ? ` (${Object.values(item.size).join(', ')})`
      : '';

    return (
      <div key={key} className="flex space-between gap-12 text-14 line-height-20">
        <div className="color-#000000CC">
          {item.quantity}x {item.productName}
          {size}
        </div>
        <div className="weight-500">{formatNumberAsPrice(item.lineTotal)}</div>
      </div>
    );
  };

  return (
    <>
      <HomepageNavBar />
      <div className="bg-#F5F5F5 min-h-100vh py-40 px-16">
        <div className="mx-auto max-w-760 bg-white radius-12 p-24 md:p-32 flex flex-col gap-20">
          <h1 className="text-24 line-height-32 weight-600">Shared payment</h1>

          {loading && (
            <div className="flex a-items-center j-content-center py-24">
              <PuffLoader loading size={28} />
            </div>
          )}

          {!loading && errorMessage && (
            <p className="text-16 line-height-24 color-#B91C1C">{errorMessage}</p>
          )}

          {!loading && !errorMessage && summary && (
            <>
              <div className="flex flex-col gap-6">
                <p className="text-14 color-#00000099 line-height-20">
                  Status: <span className="weight-600 color-#000000D9">{summary.status}</span>
                </p>
                {summary.message && (
                  <p className="text-14 color-#00000099 line-height-20">{summary.message}</p>
                )}
              </div>

              <div className="border border-#00000014 radius-10 p-16 flex flex-col gap-16">
                {summary.stores.map((store) => (
                  <div key={store.storeId} className="flex flex-col gap-10">
                    <p className="text-16 weight-600 line-height-24">{store.storeName}</p>
                    <div className="flex flex-col gap-8">
                      {store.items.map((item, index) =>
                        renderLineItem(item, `${store.storeId}-${item.variantId}-${index}`)
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border border-#00000014 radius-10 p-16 flex flex-col gap-10">
                <div className="flex space-between text-14 line-height-20">
                  <span>Subtotal</span>
                  <span>{formatNumberAsPrice(summary.cartSubTotal)}</span>
                </div>
                <div className="flex space-between text-14 line-height-20">
                  <span>Delivery fee</span>
                  <span>{formatNumberAsPrice(summary.deliveryFee)}</span>
                </div>
                <div className="flex space-between text-14 line-height-20">
                  <span>Cart total</span>
                  <span>{formatNumberAsPrice(summary.cartTotal)}</span>
                </div>
                <div className="flex space-between text-16 line-height-24 weight-600 border-t border-#00000014 pt-10">
                  <span>Total to pay</span>
                  <span>{formatNumberAsPrice(totalToPay)}</span>
                </div>
              </div>

              {summary.paid ? (
                <p className="text-16 line-height-24 color-#0B9378 weight-500">
                  This payment has already been completed.
                </p>
              ) : (
                <div className="flex flex-col gap-12">
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    className="border border-#0000001F radius-8 px-14 py-12 text-14 line-height-20 outline-none"
                  />
                  <button
                    onClick={handlePay}
                    disabled={paying}
                    className={`border-none text-white text-16 weight-500 line-height-22 px-24 py-12 radius-6 m:flex a-items-center j-content-center ${
                      paying ? 'bg-#D1D5DB color-#6B7280 cursor-not-allowed' : 'bg-#0B9378 pointer'
                    }`}
                  >
                    Pay with Paystack
                    <PuffLoader loading={paying} size={14} className="ml-8" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SharedPaymentPage;
