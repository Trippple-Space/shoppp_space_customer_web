'use client';

import { MARKETPLACE_OPENS_DATE } from '@/modules/lib/utility/constants';
import { useEffect, useState } from 'react';

const BANNER_HEIGHT = 44;
const SCROLL_THRESHOLD = 10;

export default function GlobalLaunchBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setShowBanner(window.scrollY > SCROLL_THRESHOLD);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  if (!showBanner) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[99999] flex items-center justify-center px-16 py-10 text-center text-14 leading-20 font-medium md:text-15 md:leading-22 animate-in slide-in-from-bottom-2 duration-200"
      style={{
        background: '#fedf94',
        color: 'black',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        minHeight: BANNER_HEIGHT,
        zIndex: 99999999999999,
      }}
      role="banner"
    >
      <span>
        Asoebi Africa marketplace opens officially by {MARKETPLACE_OPENS_DATE}.
        You might not be able to make purchases yet. Feel free to join our beta testers and explore the site.
      </span>
    </div>
  );
}
