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
        'flex flex-col items-center justify-center text-center',
        compact ? 'gap-12 py-24 px-16' : 'gap-20 py-48 px-24 rounded-16 bg-#FAFAFA',
        !compact && 'border border-#00000014',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <span
        className={cx(
          'flex items-center justify-center rounded-full bg-#FFF3F1 text-#D4280C',
          compact ? 'w-40 h-40' : 'w-56 h-56'
        )}
      >
        <TbAlertCircle className={compact ? 'w-22 h-22' : 'w-32 h-32'} aria-hidden />
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
        <p className="text-14 weight-400 color-#00000099 leading-relaxed">{description}</p>
      </div>
      {extra}
      {onRetry && (
        <Button
          type="button"
          onClick={onRetry}
          className="px-24 py-8 min-w-120 flex items-center justify-center gap-8"
        >
          <TbRefresh className="w-18 h-18" aria-hidden />
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default DataFetchErrorPanel;
