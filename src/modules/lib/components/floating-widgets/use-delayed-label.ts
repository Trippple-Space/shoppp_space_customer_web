'use client';

import { useEffect, useState } from 'react';

/** Delay before label text appears after the pill starts expanding */
export const PILL_LABEL_DELAY_MS = 1500;

export function useDelayedLabelVisible(active: boolean, delayMs = PILL_LABEL_DELAY_MS) {
  const [labelVisible, setLabelVisible] = useState(false);

  useEffect(() => {
    if (!active) {
      setLabelVisible(false);
      return;
    }

    const id = window.setTimeout(() => setLabelVisible(true), delayMs);
    return () => window.clearTimeout(id);
  }, [active, delayMs]);

  return labelVisible;
}
