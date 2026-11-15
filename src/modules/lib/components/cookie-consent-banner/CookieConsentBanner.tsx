'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { paths } from '@/modules/lib/utility/paths';

const STORAGE_KEY = 'shoppp_cookie_consent';

export default function CookieConsentBanner() {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEY)) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, 'true');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div
      data-cookie-consent="true"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-0 left-0 right-0 flex flex-wrap items-center justify-center gap-[6px] px-[16px] py-[10px] text-center md:flex-nowrap md:justify-between md:gap-[10px]"
      style={{
        background: '#f5f5f5',
        color: '#333',
        boxShadow: '0 -1px 3px rgba(0,0,0,0.08)',
        zIndex: 99999999999998,
      }}
      role="dialog"
      aria-label="Cookie consent"
    >
      <p className="text-[13px] md:text-[14px] text-[#333333]">
        By continuing to use this site, you consent to our use of cookies and
        similar technologies as described in our{' '}
        <Link
          href={paths.legal_document}
          className="underline underline-on-hover font-medium"
        >
          Privacy and cookies
        </Link>{' '}
        policy.
      </p>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleAccept();
        }}
        className="shrink-0 rounded-6 bg-black px-[16px] py-[8px] text-[13px] font-medium text-white hover:opacity-90"
      >
        Accept
      </button>
    </div>
  );
}
