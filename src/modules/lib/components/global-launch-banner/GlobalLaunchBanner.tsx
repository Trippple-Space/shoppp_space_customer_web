'use client';

import { MARKETPLACE_OPENS_DATE } from '@/modules/lib/utility/constants';
import { useEffect, useState } from 'react';

const BANNER_HEIGHT = 44;
const SCROLL_THRESHOLD = 10;

const TARGET_DATE = new Date('2026-03-30T00:00:00');

export default function GlobalLaunchBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isBeforeLaunch, setIsBeforeLaunch] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateVisibility = () => {
      setShowBanner(window.scrollY > SCROLL_THRESHOLD);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });

    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = TARGET_DATE.getTime() - now;

      setIsBeforeLaunch(distance > 0);

      if (distance <= 0) {
        setTimeLeft('00 : 00 : 00 : 00');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      const format = (n: number) => n.toString().padStart(2, '0');

      setTimeLeft(
        `${format(days)} : ${format(hours)} : ${format(minutes)} : ${format(seconds)}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isBeforeLaunch || !showBanner) return null;

  return (
    <div
      className="fixed lg:top-[69.7px] md:top-[66.5px] top-[64px] left-0 right-0 flex flex-col items-center justify-center gap-[6px] px-[16px] py-[10px] text-center animate-in slide-in-from-bottom-2 duration-200"
      style={{
        background: '#fedf94',
        color: 'black',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        minHeight: BANNER_HEIGHT,
        zIndex: 99999999999999,
      }}
      role="banner"
    >
      <span className="text-[13px] md:text-[14px] font-medium">
        Shoppp Space marketplace opens officially by {MARKETPLACE_OPENS_DATE}.
        You might not be able to make purchases yet. Feel free to join our beta testers and explore the site.
      </span>

      <div className="text-[20px] md:text-[26px] font-bold tracking-wider">
        {timeLeft}
      </div>
    </div>
  );
}