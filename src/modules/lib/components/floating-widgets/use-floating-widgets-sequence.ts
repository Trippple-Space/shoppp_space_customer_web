'use client';

import { useEffect, useRef, useState } from 'react';

import { PILL_LABEL_DELAY_MS } from './use-delayed-label';

/**
 * Timings aligned with the original pill keyframes:
 * ~2s shell expand, ~1.5s label delay, ~6s hold, ~2s collapse, collapsed dwell, crossfade.
 */
export const FLOATING_PILL_TIMING = {
  expand: 2000,
  holdOpen: 6000,
  collapse: 2000,
  holdClosed: 52000,
  crossfade: 1200,
} as const;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export type FloatingPillOrchestration = {
  instagramPillExpanded: boolean;
  instagramFaded: boolean;
  suggestionPillExpanded: boolean;
  suggestionFaded: boolean;
};

const INITIAL: FloatingPillOrchestration = {
  instagramPillExpanded: false,
  instagramFaded: false,
  suggestionPillExpanded: false,
  suggestionFaded: true,
};

export function useFloatingWidgetsSequence(paused: boolean) {
  const [state, setState] = useState<FloatingPillOrchestration>(INITIAL);
  const runIdRef = useRef(0);

  useEffect(() => {
    if (paused) return;

    const runId = ++runIdRef.current;
    let cancelled = false;

    const isStale = () => cancelled || runId !== runIdRef.current;

    const set = (patch: Partial<FloatingPillOrchestration>) => {
      if (!isStale()) {
        setState((prev) => ({ ...prev, ...patch }));
      }
    };

    const runOpenPhase = async (widget: 'instagram' | 'suggestion') => {
      const { expand, holdOpen, collapse, holdClosed } = FLOATING_PILL_TIMING;
      const expandedKey =
        widget === 'instagram' ? 'instagramPillExpanded' : 'suggestionPillExpanded';

      set({ [expandedKey]: true } as Partial<FloatingPillOrchestration>);
      await wait(expand);
      if (isStale()) return;
      await wait(PILL_LABEL_DELAY_MS + holdOpen);
      if (isStale()) return;

      set({ [expandedKey]: false } as Partial<FloatingPillOrchestration>);
      await wait(collapse + holdClosed);
    };

    const runSequence = async () => {
      const { crossfade } = FLOATING_PILL_TIMING;

      while (!isStale()) {
        set({
          instagramFaded: false,
          suggestionFaded: true,
          suggestionPillExpanded: false,
        });
        await runOpenPhase('instagram');
        if (isStale()) return;

        set({
          instagramFaded: true,
          suggestionFaded: false,
          suggestionPillExpanded: false,
        });
        await wait(crossfade);
        if (isStale()) return;

        await runOpenPhase('suggestion');
        if (isStale()) return;

        set({
          suggestionFaded: true,
          instagramFaded: false,
          instagramPillExpanded: false,
        });
        await wait(crossfade);
        if (isStale()) return;
      }
    };

    void runSequence();

    return () => {
      cancelled = true;
    };
  }, [paused]);

  return state;
}
