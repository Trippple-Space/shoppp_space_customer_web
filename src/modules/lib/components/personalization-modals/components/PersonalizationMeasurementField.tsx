import { ChangeEvent } from 'react';
import { IoAdd, IoInformationCircleOutline, IoRemove } from 'react-icons/io5';
import { PersonalizationFieldErrorKey } from '../types';

interface PersonalizationMeasurementFieldProps {
  fieldKey: PersonalizationFieldErrorKey;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  showInfo?: boolean;
  step?: number;
  required?: boolean;
  error?: string;
}

const isValidMeasurementInput = (value: string) => /^\d*\.?\d*$/.test(value);

const PersonalizationMeasurementField = ({
  fieldKey,
  label,
  placeholder,
  value,
  onChange,
  showInfo = false,
  step = 1,
  required = false,
  error,
}: PersonalizationMeasurementFieldProps) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;

    if (next === '') {
      onChange('');
      return;
    }

    if (!isValidMeasurementInput(next)) {
      return;
    }

    const parsed = parseFloat(next);
    if (!Number.isNaN(parsed) && parsed < 0) {
      return;
    }

    onChange(next);
  };

  const adjustValue = (delta: number) => {
    const current = parseFloat(value) || 0;
    const next = Math.max(0, Number((current + delta).toFixed(2)));
    onChange(String(next));
  };

  return (
    <div className="flex flex-col gap-4" data-personalization-field={fieldKey}>
      <label className="flex a-items-center j-content-between gap-6 text-10 sm:text-11 weight-400 line-height-12.67 color-#6A6A6A">
        <span>
          {label}
          {required && <span className="color-red"> *</span>}
        </span>
        {showInfo && (
          <IoInformationCircleOutline className="w-16 h-16 color-#000000 mr-19" />
        )}
      </label>

      <div className="flex w-full gap-3 a-items-center">
        <input
          type="number"
          min={0}
          step={step}
          value={value}
          placeholder={placeholder}
          onChange={handleInputChange}
          className={`no-arrows flex-grow-1 min-w-0 h-34.67 border-solid border-0.67 radius-4 px-8 text-10.67 sm:text-11 line-height-14.67 color-#000000 outline-none bg-white placeholder:lowercase ${
            error ? 'border-red' : 'border-#6A6A6A4D'
          }`}
        />

        <div className="flex flex-col gap-2 flex-shrink-0 h-34.67">
          <button
            type="button"
            onClick={() => adjustValue(step)}
            className="w-16 h-16 flex a-items-center j-content-center border-none bg-#F5F5F5 radius-3 cursor-pointer color-#6A6A6A p-0"
            aria-label={`Increase ${label}`}
          >
            <IoAdd className="w-10 h-10" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => adjustValue(-step)}
            className="w-16 h-16 flex a-items-center j-content-center border-none bg-#F5F5F5 radius-3 cursor-pointer color-#6A6A6A p-0"
            aria-label={`Decrease ${label}`}
          >
            <IoRemove className="w-10 h-10" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {error && (
        <p className="text-10 sm:text-11 color-red line-height-12.67">{error}</p>
      )}
    </div>
  );
};

export default PersonalizationMeasurementField;
