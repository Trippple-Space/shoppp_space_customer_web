'use client';

import {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

const TRACK_INSET_Y = 14;
const SCROLLBAR_WIDTH = 6;
const TRACK_COLOR = '#EAEAEA';
const THUMB_COLOR = '#B3B3B3';
const MIN_THUMB_HEIGHT = 44;

interface PersonalizationMeasurementsScrollProps {
  children: ReactNode;
}

const PersonalizationMeasurementsScroll = ({
  children,
}: PersonalizationMeasurementsScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ height: 0, top: 0 });
  const [canScroll, setCanScroll] = useState(false);

  const updateThumb = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const scrollable = scrollHeight > clientHeight + 1;
    setCanScroll(scrollable);

    if (!scrollable) {
      setThumb({ height: 0, top: 0 });
      return;
    }

    const trackHeight = clientHeight - TRACK_INSET_Y * 2;
    const thumbHeight = Math.max(
      (clientHeight / scrollHeight) * trackHeight,
      MIN_THUMB_HEIGHT
    );
    const maxThumbTop = trackHeight - thumbHeight;
    const scrollRatio = scrollTop / (scrollHeight - clientHeight);

    setThumb({
      height: thumbHeight,
      top: maxThumbTop * scrollRatio,
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateThumb();

    const observer = new ResizeObserver(updateThumb);
    observer.observe(el);

    return () => observer.disconnect();
  }, [updateThumb, children]);

  return (
    <div
      className="relative flex-grow-1 h-full w-full"
      style={{ minHeight: 0, flex: '1 1 0' }}
    >
      <div
        ref={scrollRef}
        onScroll={updateThumb}
        className="personalization-measurements-scroll-inner h-full overflow-y-auto no-scrollbar"
        style={{ paddingRight: SCROLLBAR_WIDTH + 12 }}
      >
        {children}
      </div>

      {canScroll && (
        <div
          className="absolute r-0 pointer-none"
          style={{
            top: TRACK_INSET_Y,
            bottom: TRACK_INSET_Y,
            width: SCROLLBAR_WIDTH,
          }}
          aria-hidden
        >
          <div
            className="absolute t-0 l-0 w-100p h-100p radius-999"
            style={{ backgroundColor: TRACK_COLOR }}
          />
          <div
            className="absolute l-0 w-100p radius-999"
            style={{
              backgroundColor: THUMB_COLOR,
              height: thumb.height,
              top: thumb.top,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PersonalizationMeasurementsScroll;
