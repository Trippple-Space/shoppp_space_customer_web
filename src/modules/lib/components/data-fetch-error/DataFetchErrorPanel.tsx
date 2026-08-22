'use client';

import Button from '@/modules/lib/components/button/Button';
import cx from 'classnames';
import { TbAlertCircle, TbRefresh } from 'react-icons/tb';
import { FC, ReactNode } from 'react';

type Props = {
  title: string;
  description: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  compact?: boolean;
  extra?: ReactNode;
};

const DataFetchErrorPanel: FC<Props> = ({
  title,
  description,
  onRetry,
  retryLabel = 'Try again',
  className,
  compact,
  extra,
}) => {
  return (
    <div
      className={cx(
        'flex flex-col a-items-center j-content-center text-center',
        compact ? 'gap-12 py-24 px-16' : 'gap-20 py-48 px-24 radius-16 bg-#FAFAFA',
        !compact && 'border border-#00000014',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <span
        className={cx(
          'flex a-items-center j-content-center round bg-#FFF3F1 color-#D4280C',
          compact ? 'w-40 h-40 min-w-40' : 'w-56 h-56'
        )}
      >
        <TbAlertCircle
          className={compact ? 'w-22 h-22' : 'w-32 h-32'}
          style={{ width: compact ? 22 : 32, height: compact ? 22 : 32, flexShrink: 0 }}
          aria-hidden
        />
      </span>
      <div className={cx('flex flex-col gap-6', compact ? 'max-w-100p' : 'max-w-400')}>
        <h3
          className={cx(
            'weight-600 color-#000000E0',
            compact ? 'text-15 md:text-16' : 'text-18'
          )}
        >
          {title}
        </h3>
        <p className="text-14 weight-400 color-#00000099">{description}</p>
      </div>
      {extra}
      {onRetry && (
        <Button
          type="button"
          onClick={onRetry}
          className="px-24 py-8 min-w-120 flex a-items-center j-content-center gap-8"
        >
          <TbRefresh
            className="w-18 h-18"
            style={{ width: 18, height: 18, flexShrink: 0 }}
            aria-hidden
          />
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default DataFetchErrorPanel;
