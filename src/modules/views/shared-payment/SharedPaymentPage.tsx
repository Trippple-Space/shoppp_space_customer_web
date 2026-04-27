'use client';

import Footer from '@/modules/lib/components/footer/Footer';
import Image from '@/modules/lib/components/image/Image';
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar';
import PuffLoader from '@/modules/lib/components/puff-loader/PuffLoader';
import { paymentService } from '@/modules/lib/utility/services/payment.service';
import {
  SharedCheckoutItem,
  SharedCheckoutSummaryResponse,
} from '@/modules/lib/utility/types/payment.interface';
import { displayStockUnit, formatNumberAsPrice } from '@/modules/lib/utility/utility';
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
    const resolvedSize =
      typeof item.size === 'string'
        ? item.size
        : item.size && Object.keys(item.size).length > 0
          ? Object.values(item.size).join(', ')
          : '';
    const visibleProperties = Object.entries(item.properties ?? {}).filter(
      ([propertyKey, propertyValue]) => {
        if (
          propertyKey.toLowerCase() === 'size' ||
          propertyValue === null ||
          propertyValue === undefined
        ) {
          return false;
        }

        if (typeof propertyValue === 'string') {
          return propertyValue.trim().length > 0;
        }

        if (Array.isArray(propertyValue)) {
          return propertyValue.some((value) => String(value ?? '').trim().length > 0);
        }

        if (typeof propertyValue === 'object') {
          return Object.keys(propertyValue as Record<string, unknown>).length > 0;
        }

        return true;
      }
    );

    return (
      <div key={key} className="flex gap-12 a-items-center">
        <div className="w-73 h-75 radius-6 overflow-hidden border border-#00000014 bg-#F5F5F5 flex a-items-center j-content-center">
          {item.variantImage ? (
            <Image
              src={item.variantImage}
              alt={item.productName || 'Product image'}
              className="w-73 h-75 object-fit"
            />
          ) : (
            <span className="text-12 color-#00000066">No image</span>
          )}
        </div>
        <div className="flex-grow-1 flex flex-col gap-4 overflow-hidden">
          <p className="weight-600 text-14 line-height-22 color-#000000E0 text-overflow-ellipsis white-space-nowrap overflow-hidden">
            {item.productName}
          </p>
          <p className="weight-400 text-14 line-height-20 color-#0000008C">
            Quantity:{' '}
            {`${item.quantity} ${displayStockUnit('piece')}${item.quantity > 1 ? 's' : ''}`}
          </p>
          {resolvedSize && (
            <p className="weight-400 text-13 line-height-18 color-#0000008C">
              Size: {resolvedSize}
            </p>
          )}
          {visibleProperties.map(([propertyKey, propertyValue]) => (
            <p
              key={propertyKey}
              className="weight-400 text-13 line-height-18 capitalize color-#0000008C"
            >
              {propertyKey}:{' '}
              {Array.isArray(propertyValue)
                ? propertyValue.join(', ')
                : typeof propertyValue === 'object'
                  ? Object.values(propertyValue as Record<string, unknown>).join(', ')
                  : String(propertyValue)}
            </p>
          ))}
        </div>
        <p className="weight-600 text-16 line-height-24 color-#000000E0">
          {formatNumberAsPrice(item.lineTotal)}
        </p>
      </div>
    );
  };

  return (
    <>
      <HomepageNavBar />
      <div className="bg-#F5F5F5 min-h-100vh py-40 pb-96 px-16 mt-64">
        <div className="mx-auto max-w-760 bg-white radius-12 p-24 md:p-32 flex flex-col gap-20">
          <h1 className="text-24 line-height-32 weight-600">Shared payment</h1>

          {loading && (
            <div className="flex a-items-center j-content-center py-24">
              <PuffLoader loading size={28} />
            </div>
          )}

          {!loading && errorMessage && (
            <div className="border border-#FECACA bg-#FEF2F2 radius-10 p-20 flex flex-col gap-12">
              <div className="flex a-items-center gap-10">
                <div className="w-28 h-28 radius-100p bg-#FEE2E2 color-#B91C1C flex a-items-center j-content-center weight-700">
                  !
                </div>
                <p className="text-18 line-height-26 weight-600 color-#991B1B">
                  Payment link unavailable
                </p>
              </div>
              <p className="text-15 line-height-22 color-#B91C1C">{errorMessage}</p>
              <p className="text-14 line-height-20 color-#991B1BCC">
                Please confirm the link is correct or request a new one from the user.
              </p>
            </div>
          )}

          {!loading && !errorMessage && summary && (
            <>
              <div className="flex flex-col gap-10">
                <div className="flex a-items-center gap-8">
                  <span
                    className={`text-12 line-height-18 weight-600 px-10 py-4 radius-999 ${
                      summary.paid
                        ? 'bg-#ECFDF3 color-#027A48'
                        : 'bg-#EFF8FF color-#175CD3'
                    }`}
                  >
                    {summary.status.replace('_', ' ') || (summary.paid ? 'PAID' : 'PENDING')}
                  </span>
                </div>
                {summary.message && (
                  <p className="text-14 color-#00000099 line-height-20">{summary.message}</p>
                )}
              </div>

              {Array.isArray(summary.stores) && summary.stores.length > 0 && (
                <div className="border border-#00000014 radius-10 p-16 flex flex-col gap-16">
                  {summary.stores.map((store) => (
                    <div key={store.storeId} className="flex flex-col gap-10">
                      <p className="text-16 weight-600 line-height-24 color-#00000099">
                        {store.storeName}
                      </p>
                      <div className="flex flex-col gap-8">
                        {store.items.map((item, index) =>
                          renderLineItem(item, `${store.storeId}-${item.variantId}-${index}`)
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!summary.paid && (
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
              )}

              {summary.paid ? (
                <div className="border border-#A6F4C5 bg-#ECFDF3 radius-10 p-18 flex flex-col gap-8">
                  <p className="text-18 line-height-26 color-#027A48 weight-600">
                    Payment already completed
                  </p>
                  <p className="text-14 line-height-22 color-#027A48CC">
                    This checkout has already been paid. You do not need to make another payment.
                  </p>
                </div>
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
                    Proceed to payment
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
