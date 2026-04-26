'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { paths } from '@/modules/lib/utility/paths';

const STORAGE_KEY = 'asoebi_cookie_consent';

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
      className="fixed b-0 l-0 r-0 flex flex-wrap items-center justify-center gap-6 px-16 py-10 text-center md:flex-nowrap md:justify-between md:gap-10"
      style={{
        background: '#f5f5f5',
        color: '#333',
        boxShadow: '0 -1px 3px rgba(0,0,0,0.08)',
        zIndex: 99999999999998,
      }}
      role="dialog"
      aria-label="Cookie consent"
    >
      <p className="text-13 md:text-14 text-dimgrey">
        By continuing to use this site, you consent to our use of cookies and
        similar technologies as described in our{' '}
        <Link
          href={paths.legal_document}
          className="underline underline-on-hover weight-500"
        >
          Privacy and cookies
        </Link>{' '}
        policy.
      </p>
      <button
        type="button"
        onClick={handleAccept}
        className="shrink-0 rounded-6 bg-black px-16 py-8 text-13 font-medium text-white hover:opacity-90"
      >
        Accept
      </button>
    </div>
  );
}
