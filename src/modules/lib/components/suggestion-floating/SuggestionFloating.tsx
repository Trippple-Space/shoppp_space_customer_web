'use client';

import { useEffect, useRef, useState } from 'react';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { IoMdSend } from 'react-icons/io';

import FloatingPromoPill from '@/modules/lib/components/floating-promo-pill/FloatingPromoPill';
import useSuggestion from '@/modules/lib/utility/hooks/use-suggestion';

import styles from './SuggestionFloating.module.scss';

type SuggestionFloatingProps = {
  onFormOpenChange?: (open: boolean) => void;
  orchestrated?: boolean;
  pillExpanded?: boolean;
  faded?: boolean;
};

export default function SuggestionFloating({
  onFormOpenChange,
  orchestrated = false,
  pillExpanded = false,
  faded = false,
}: SuggestionFloatingProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { message, setMessage, handleSubmit, canSubmit } = useSuggestion();

  const openForm = () => setIsFormOpen(true);

  const closeForm = () => {
    setIsFormOpen(false);
    setMessage('');
  };

  useEffect(() => {
    onFormOpenChange?.(isFormOpen);
  }, [isFormOpen, onFormOpenChange]);

  useEffect(() => {
    if (orchestrated && faded) {
      setIsFormOpen(false);
    }
  }, [orchestrated, faded]);

  useEffect(() => {
    if (isFormOpen) {
      inputRef.current?.focus();
    }
  }, [isFormOpen]);

  const handleSend = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const sent = await handleSubmit();
    if (sent) {
      closeForm();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSubmit) {
        void handleSubmit().then((sent) => {
          if (sent) closeForm();
        });
      }
    }
    if (e.key === 'Escape') {
      closeForm();
    }
  };

  if (isFormOpen) {
    return (
      <div className={styles.formPill}>
        <button
          type="button"
          className={styles.iconWrap}
          onClick={closeForm}
          aria-label="Close suggestion box"
        >
          <HiOutlineLightBulb className={styles.icon} aria-hidden="true" />
        </button>

        <textarea
          ref={inputRef}
          className={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What would you like us to improve?"
          rows={2}
          aria-label="Your suggestion"
        />

        <button
          type="button"
          className={styles.sendBtn}
          onClick={handleSend}
          disabled={!canSubmit}
          aria-label="Send suggestion"
        >
          <IoMdSend className={styles.sendIcon} aria-hidden="true" />
        </button>
      </div>
    );
  }

  if (!orchestrated) {
    return null;
  }

  return (
    <FloatingPromoPill
      variant="suggestion"
      label="Share a suggestion"
      icon={<HiOutlineLightBulb />}
      orchestrated
      pillExpanded={pillExpanded}
      faded={faded}
      onLabelActivate={openForm}
      ariaLabel="Share a suggestion"
    />
  );
}
