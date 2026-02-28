'use client';

import { MARKETPLACE_OPENS_DATE } from '@/modules/lib/utility/constants';

const BANNER_HEIGHT = 44;

export default function GlobalLaunchBanner() {
  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-[99999] flex items-center justify-center px-16 py-10 text-center text-14 leading-20 font-medium md:text-15 md:leading-22"
        style={{
          background: 'linear-gradient(135deg, #0B9378 0%, #0a7a64 100%)',
          color: 'rgba(255,255,255,0.98)',
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
      {/* Spacer so main content is not hidden under the fixed banner */}
      <div style={{ height: BANNER_HEIGHT, flexShrink: 0 }} aria-hidden />
    </>
  );
}
