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
        compact ? 'gap-[12px] py-[24px] px-[16px]' : 'gap-[20px] py-[48px] px-[24px] rounded-[16px] bg-[#FAFAFA]',
        !compact && 'border border-[#00000014]',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <span
        className={cx(
          'flex items-center justify-center rounded-full bg-[#FFF3F1] text-[#D4280C]',
          compact ? 'w-[40px] h-[40px] min-w-[40px]' : 'w-[56px] h-[56px]'
        )}
      >
        <TbAlertCircle
          className={compact ? 'w-[22px] h-[22px]' : 'w-[32px] h-[32px]'}
          style={{ width: compact ? 22 : 32, height: compact ? 22 : 32, flexShrink: 0 }}
          aria-hidden
        />
      </span>
      <div className={cx('flex flex-col gap-[6px]', compact ? 'max-w-[100%]' : 'max-w-[400px]')}>
        <h3
          className={cx(
            'font-semibold text-[#000000E0]',
            compact ? 'text-[15px] md:text-[16px]' : 'text-[18px]'
          )}
        >
          {title}
        </h3>
        <p className="text-[14px] font-normal text-[#00000099]">{description}</p>
      </div>
      {extra}
      {onRetry && (
        <Button
          type="button"
          onClick={onRetry}
          className="px-[24px] py-[8px] min-w-[120px] flex items-center justify-center gap-[8px]"
        >
          <TbRefresh
            className="w-[18px] h-[18px]"
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
