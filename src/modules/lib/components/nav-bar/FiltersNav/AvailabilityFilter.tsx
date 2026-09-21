import React, { useState } from 'react';
import BoxRadio from '../../box-radio/BoxRadio';
import { useFilterStore } from '@/modules/lib/utility/store/filter.store';

export const AVAILABILITY_OPTIONS = [
  { value: 'ready-to-wear', label: 'Ready to wear' },
  { value: 'preorder', label: 'Pre-order' },
  { value: 'custom-made', label: 'Custom-made' },
] as const;

export type AvailabilityOrderType =
  (typeof AVAILABILITY_OPTIONS)[number]['value'];

export const getAvailabilityLabel = (value: string) =>
  AVAILABILITY_OPTIONS.find((option) => option.value === value)?.label ?? value;

interface IAvailabilityFilter {
  setAvailabilityFilter?: (value: string) => void;
}

export const AvailabilityFilter: React.FC<IAvailabilityFilter> = ({
  setAvailabilityFilter,
}) => {
  const { allFilters } = useFilterStore();
  const [orderType, setOrderType] = useState<string>(
    allFilters.availability.orderType,
  );

  return (
    <ul className="flex flex-col">
      {AVAILABILITY_OPTIONS.map((option) => (
        <li key={option.value} className="flex gap-12 py-10">
          <div className="h-fit w-fit color-#6A6A6A hover:color-#000000E0">
            <BoxRadio
              label={option.label}
              className="filter"
              name="availability"
              id={option.value}
              checked={option.value === orderType}
              onChange={() => {
                setAvailabilityFilter?.(option.value);
                setOrderType(option.value);
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};
