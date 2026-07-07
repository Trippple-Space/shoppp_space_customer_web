import { IoInformationCircleOutline } from 'react-icons/io5';

interface PersonalizationMeasurementFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  showInfo?: boolean;
}

const PersonalizationMeasurementField = ({
  label,
  placeholder,
  value,
  onChange,
  showInfo = false,
}: PersonalizationMeasurementFieldProps) => {
  return (
    <div className="flex flex-col gap-4">
      <label className="flex a-items-center j-content-between gap-6 text-10 weight-400 line-height-12.67 color-#6A6A6A">
        <span>
          {label} <span className="color-red">*</span>
        </span>
        {showInfo && (
          <IoInformationCircleOutline className="w-16 h-16 color-#000000" />
        )}
      </label>
      <input
        type="tel"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-34.67 border-solid border-0.67 border-#6A6A6A4D radius-4 px-8 text-10.67 line-height-14.67 color-#000000 outline-none bg-transparent"
      />
    </div>
  );
};

export default PersonalizationMeasurementField;
