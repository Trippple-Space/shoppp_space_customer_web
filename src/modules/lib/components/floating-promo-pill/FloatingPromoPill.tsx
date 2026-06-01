'use client';

import type { ReactNode } from 'react';
import { GoArrowRight } from 'react-icons/go';

import { useDelayedLabelVisible } from '@/modules/lib/components/floating-widgets/use-delayed-label';

import styles from './floating-promo-pill.module.scss';

export type FloatingPromoPillProps = {
  label: string;
  icon: ReactNode;
  variant: 'instagram' | 'suggestion';
  orchestrated?: boolean;
  pillExpanded?: boolean;
  faded?: boolean;
  href?: string;
  /** When set, clicking the label/arrow (once visible) runs this instead of navigation */
  onLabelActivate?: () => void;
  ariaLabel?: string;
};

export default function FloatingPromoPill({
  label,
  icon,
  variant,
  orchestrated = false,
  pillExpanded = false,
  faded = false,
  href,
  onLabelActivate,
  ariaLabel,
}: FloatingPromoPillProps) {
  const labelActive = orchestrated && pillExpanded && !faded;
  const labelVisible = useDelayedLabelVisible(labelActive);

  const labelClass = labelVisible ? styles.labelVisible : styles.labelHidden;

  const pillClassName = [
    styles.pill,
    styles.orchestrated,
    pillExpanded ? styles.pillOpen : styles.pillClosed,
    faded && styles.faded,
  ]
    .filter(Boolean)
    .join(' ');

  const iconWrapClass =
    variant === 'instagram'
      ? styles.iconWrapInstagram
      : styles.iconWrapSuggestion;

  const handleLabelActivate = (e: React.MouseEvent) => {
    if (!onLabelActivate || !labelVisible) return;
    e.preventDefault();
    e.stopPropagation();
    onLabelActivate();
  };

  const iconNode = <>{icon}</>;

  const labelContent = (
    <>
      {href ? (
        <span className={[styles.iconWrap, iconWrapClass].join(' ')}>{iconNode}</span>
      ) : (
        <button
          type="button"
          className={[styles.iconWrap, iconWrapClass].join(' ')}
          onClick={(e) => {
            e.stopPropagation();
            onLabelActivate?.();
          }}
          disabled={faded}
          aria-label={ariaLabel ?? 'Open suggestion form'}
        >
          {iconNode}
        </button>
      )}

      <span
        className={[
          styles.text,
          labelClass,
          onLabelActivate && labelVisible ? styles.labelAction : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={onLabelActivate ? handleLabelActivate : undefined}
        role={onLabelActivate && labelVisible ? 'button' : undefined}
        tabIndex={onLabelActivate && labelVisible ? 0 : undefined}
      >
        {label}
      </span>

      <span
        className={[styles.arrow, labelClass, onLabelActivate && labelVisible ? styles.labelAction : '']
          .filter(Boolean)
          .join(' ')}
        onClick={onLabelActivate ? handleLabelActivate : undefined}
        role={onLabelActivate && labelVisible ? 'button' : undefined}
        tabIndex={onLabelActivate && labelVisible ? 0 : undefined}
        aria-hidden={onLabelActivate ? undefined : true}
      >
        <GoArrowRight />
      </span>
    </>
  );

  if (href) {
    return (
      <a
        className={pillClassName}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel ?? label}
        title={ariaLabel ?? label}
        aria-hidden={faded ? true : undefined}
        tabIndex={faded ? -1 : undefined}
      >
        {labelContent}
      </a>
    );
  }

  return (
    <div
      className={pillClassName}
      aria-label={ariaLabel ?? label}
      aria-hidden={faded ? true : undefined}
    >
      {labelContent}
    </div>
  );
}
