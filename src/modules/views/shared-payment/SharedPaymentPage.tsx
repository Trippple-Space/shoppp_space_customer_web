'use client';

import Footer from '@/modules/lib/components/footer/Footer';
import Image from '@/modules/lib/components/image/Image';
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar';
import PuffLoader from '@/modules/lib/components/puff-loader/PuffLoader';
import VideoSrc from '@/modules/lib/components/video-src/VideoSrc';
import { paymentService } from '@/modules/lib/utility/services/payment.service';
import {
  SharedCheckoutItem,
  SharedCheckoutSummaryResponse,
} from '@/modules/lib/utility/types/payment.interface';
import {
  checkMediaType,
  displayStockUnit,
  formatNumberAsPrice,
} from '@/modules/lib/utility/utility';
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
  const subtotal = useMemo(() => {
    if (!summary) return 0;
    return summary.cartSubTotal ?? summary.cartTotal;
  }, [summary]);
  const discountValue = useMemo(() => {
    if (!summary) return 0;
    return Math.max(summary.cartTotalDiscountValue ?? 0, 0);
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
    const mediaType = checkMediaType(item.variantImage ?? '') ?? 'image';
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
      <div key={key} className="flex gap-[12px] items-center">
        <div className="w-[73px] h-[75px] min-w-[73px] min-h-[75px] rounded-[6px] overflow-hidden border border-[#00000014] bg-[#F5F5F5] flex items-center justify-center">
          {item.variantImage ? (
            mediaType === 'video' ? (
              <VideoSrc
                className="w-[73px] h-[75px] min-w-[73px] min-h-[75px] object-fit"
                src={item.variantImage}
                hasLoader={true}
              />
            ) : (
            <Image
              src={item.variantImage}
              alt={item.productName || 'Product image'}
              className="w-[73px] h-[75px] min-w-[73px] min-h-[75px] object-fit"
            />
            )
          ) : (
            <span className="text-[12px] text-[#00000066]">No image</span>
          )}
        </div>
        <div className="min-w-0 grow flex flex-col gap-[4px] overflow-hidden">
          <p className="min-w-0 w-full truncate font-semibold text-[14px] leading-[22px] text-[#000000E0]">
            {item.productName}
          </p>
          <p className="font-normal sm:text-[14px] text-[13.5px] leading-[20px] text-[#0000008C]">
            Quantity:{' '}
            {`${item.quantity} ${displayStockUnit('piece')}${item.quantity > 1 ? 's' : ''}`}
          </p>
          {resolvedSize && (
            <p className="font-normal text-[13px] leading-[18px] text-[#0000008C]">
              Size: {resolvedSize}
            </p>
          )}
          {visibleProperties.map(([propertyKey, propertyValue]) => (
            <p
              key={propertyKey}
              className="font-normal text-[13px] leading-[18px] capitalize text-[#0000008C]"
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
        <p className="self-end sm:self-auto font-semibold sm:text-[16px] text-[14px] leading-[24px] text-[#000000E0]">
          {formatNumberAsPrice(item.lineTotal)}
        </p>
      </div>
    );
  };

  return (
    <>
      <HomepageNavBar />
      <div className="bg-[#F5F5F5] min-h-screen sm:py-[40px] py-[20px] sm:pb-[96px] pb-[76px] sm:px-[16px] px-[8px] mt-[64px]">
        <div className="mx-auto max-w-[760px] bg-white rounded-[12px] p-[10px] sm:p-[24px] md:p-[32px] flex flex-col gap-[20px]">
          <h1 className="text-[24px] leading-[32px] font-semibold">Shared payment</h1>

          {loading && (
            <div className="flex items-center justify-center py-[24px]">
              <PuffLoader loading size={28} />
            </div>
          )}

          {!loading && errorMessage && (
            <div className="border border-[#FECACA] bg-[#FEF2F2] rounded-[10px] p-[20px] flex flex-col gap-[12px]">
              <div className="flex items-center gap-[10px]">
                <div className="w-[28px] h-[28px] rounded-[100ppx] bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center font-bold">
                  !
                </div>
                <p className="text-[18px] leading-[26px] font-semibold text-[#991B1B]">
                  Payment link unavailable
                </p>
              </div>
              <p className="text-[15px] leading-[22px] text-[#B91C1C]">{errorMessage}</p>
              <p className="text-[14px] leading-[20px] text-[#991B1BCC]">
                Please confirm the link is correct or request a new one from the user.
              </p>
            </div>
          )}

          {!loading && !errorMessage && summary && (
            <>
              <div className="flex flex-col gap-[10px]">
                <div className="flex items-center gap-[8px]">
                  <span
                    className={`text-[12px] leading-[18px] font-semibold px-[10px] py-[4px] rounded-[999px] ${
                      summary.paid
                        ? 'bg-[#ECFDF3] text-[#027A48]'
                        : 'bg-[#EFF8FF] text-[#175CD3]'
                    }`}
                  >
                    {summary.status.replace('_', ' ') || (summary.paid ? 'PAID' : 'PENDING')}
                  </span>
                </div>
                {summary.message && (
                  <p className="text-[14px] text-[#00000099] leading-[20px]">{summary.message}</p>
                )}
              </div>

              {Array.isArray(summary.stores) && summary.stores.length > 0 && (
                <div className="border border-[#00000014] rounded-[10px] p-[10px] sm:p-[16px] flex flex-col gap-[16px]">
                  {summary.stores.map((store) => (
                    <div key={store.storeId} className="flex flex-col gap-[10px]">
                      <p className="text-[16px] font-semibold leading-[24px] text-[#00000099]">
                        {store.storeName}
                      </p>
                      <div className="flex flex-col gap-[8px]">
                        {store.items.map((item, index) =>
                          renderLineItem(item, `${store.storeId}-${item.variantId}-${index}`)
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!summary.paid && (
                <div className="border border-[#00000014] rounded-[10px] p-[10px] sm:p-[16px] flex flex-col gap-[10px]">
                  <div className="flex justify-between text-[14px] leading-[20px]">
                    <span>Subtotal</span>
                    <span>{formatNumberAsPrice(subtotal)}</span>
                  </div>
                  {discountValue > 0 && (
                    <div className="flex justify-between text-[14px] leading-[20px]">
                      <span>Discount</span>
                      <span>- {formatNumberAsPrice(discountValue)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[14px] leading-[20px]">
                    <span>Delivery fee</span>
                    <span>{formatNumberAsPrice(summary.deliveryFee)}</span>
                  </div>
                  {/* <div className="flex justify-between text-[14px] leading-[20px]">
                    <span>Cart total</span>
                    <span>{formatNumberAsPrice(summary.cartTotal)}</span>
                  </div> */}
                  <div className="flex justify-between text-[16px] leading-[24px] font-semibold border-t border-[#00000014] pt-[10px]">
                    <span>Total to pay</span>
                    <span>{formatNumberAsPrice(totalToPay)}</span>
                  </div>
                </div>
              )}

              {summary.paid ? (
                <div className="border border-[#A6F4C5] bg-[#ECFDF3] rounded-[10px] p-[18px] flex flex-col gap-[8px]">
                  <p className="text-[18px] leading-[26px] text-[#027A48] font-semibold">
                    Payment already completed
                  </p>
                  <p className="text-[14px] leading-[22px] text-[#027A48CC]">
                    This checkout has already been paid. You do not need to make another payment.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-[12px]">
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    className="border border-[#0000001F] rounded-[8px] px-[14px] py-[12px] text-[14px] leading-[20px] outline-none"
                  />
                  <button
                    onClick={handlePay}
                    disabled={paying}
                    className={`border-none text-white text-[16px] font-medium leading-[22px] px-[24px] py-[12px] rounded-[6px] md:flex items-center justify-center ${
                      paying ? 'bg-[#D1D5DB] text-[#6B7280] cursor-not-allowed' : 'bg-[#0357EE] cursor-pointer'
                    }`}
                  >
                    Proceed to payment
                    <PuffLoader loading={paying} size={14} className="ml-[8px]" />
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
