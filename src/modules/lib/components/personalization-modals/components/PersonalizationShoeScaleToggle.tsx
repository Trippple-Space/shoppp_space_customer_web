'use client';

import { cx } from '@/modules/lib/utility/utility';
import type { ShoeSizeScale } from '@/modules/lib/utility/store/personalization.store';

const SCALES: ShoeSizeScale[] = ['EU', 'UK', 'US'];

interface PersonalizationShoeScaleToggleProps {
  value: ShoeSizeScale;
  onChange: (value: ShoeSizeScale) => void;
}

const PersonalizationShoeScaleToggle = ({
  value,
  onChange,
}: PersonalizationShoeScaleToggleProps) => (
  <div className="inline-flex a-items-center bg-#F5F5F5 radius-99 p-2 gap-2">
    {SCALES.map((option) => {
      const active = value === option;
      return (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cx(
            'border-none pointer px-12 py-5 radius-99 text-11 weight-500 uppercase g|transition:all|_0.2s|_ease',
            active
              ? 'bg-white color-#0B9378 weight-600'
              : 'bg-transparent color-#6A6A6A',
          )}
        >
          {option}
        </button>
      );
    })}
  </div>
);

export default PersonalizationShoeScaleToggle;
