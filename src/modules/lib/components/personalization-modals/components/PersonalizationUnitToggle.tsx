import { MeasurementUnit } from '@/modules/lib/utility/store/personalization.store';

interface PersonalizationUnitToggleProps {
  unit: MeasurementUnit;
  onChange: (unit: MeasurementUnit) => void;
}

const PersonalizationUnitToggle = ({
  unit,
  onChange,
}: PersonalizationUnitToggleProps) => {
  return (
    <div className="grid grid-2-cols-1fr w-full md:w-80p bg-#F5F5F5 radius-2.96 p-2 gap-2 mb-13">
      {(['cm', 'inches'] as MeasurementUnit[]).map((option) => {
        const isActive = unit === option;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`w-100p text-center px-8 py-6.86 radius-2.96 sm:text-7.89 weight-400 line-height-10.84 border-none cursor-pointer g|transition:background-color|_|0.3s g|transition-timing-function:ease ${
              isActive
                ? 'bg-white color-#333333 weight-600'
                : 'bg-transparent color-#6A6A6A'
            }`}
          >
            {option.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
};

export default PersonalizationUnitToggle;
