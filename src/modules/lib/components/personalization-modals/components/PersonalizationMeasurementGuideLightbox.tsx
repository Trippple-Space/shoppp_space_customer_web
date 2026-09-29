'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from '@/modules/lib/components/image/Image';
import { AiOutlineClose } from 'react-icons/ai';

interface PersonalizationMeasurementGuideLightboxProps {
  isOpen: boolean;
  illustration: string;
  onClose: () => void;
}

const PersonalizationMeasurementGuideLightbox = ({
  isOpen,
  illustration,
  onClose,
}: PersonalizationMeasurementGuideLightboxProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-20 flex flex-col"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.88)' }}
      data-modal-ignore-outside-click="true"
      role="dialog"
      aria-modal="true"
      aria-label="Measurement guide"
    >
      <div className="flex-shrink-0 flex a-items-center j-content-between gap-12 px-16 sm:px-24 py-14">
        <p className="text-13 sm:text-14 weight-600 color-white">
          Measurement guide
        </p>

        <button
          type="button"
          onClick={onClose}
          className="w-32 h-32 flex a-items-center j-content-center border-none bg-#FFFFFF4D radius-6 cursor-pointer color-white"
          aria-label="Close measurement guide"
        >
          <AiOutlineClose className="w-16 h-16" />
        </button>
      </div>

      <div
        className="flex-grow-1 flex a-items-center j-content-center p-16 sm:p-24 overflow-hidden"
        style={{ minHeight: 0 }}
      >
        <div
          className="bg-white radius-12 p-16 sm:p-20 w-full max-w-400 overflow-y-auto overflow-x-hidden no-scrollbar"
          style={{
            maxHeight: 'calc(100dvh - 96px)',
            touchAction: 'pan-x pan-y pinch-zoom',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <Image
            src={illustration}
            alt="Body measurement guide"
            type="icon"
            className="w-100p h-auto g|object-fit:contain"
            width={360}
            height={520}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default PersonalizationMeasurementGuideLightbox;
