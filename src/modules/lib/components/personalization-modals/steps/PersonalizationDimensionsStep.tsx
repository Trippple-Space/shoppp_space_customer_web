'use client';

import Image from '@/modules/lib/components/image/Image';
import PersonalizationMeasurementsScroll from '../components/PersonalizationMeasurementsScroll';
import PersonalizationMeasurementField from '../components/PersonalizationMeasurementField';
import PersonalizationUnitToggle from '../components/PersonalizationUnitToggle';
import {
  getMeasurementIllustration,
  usePersonalizationStore,
} from '@/modules/lib/utility/store/personalization.store';

const MEASUREMENT_FIELDS = [
  { key: 'bust' as const, label: 'Bust / Chest' },
  { key: 'waist' as const, label: 'Waist' },
  { key: 'hip' as const, label: 'Hip' },
  { key: 'armsLength' as const, label: 'Arms Length' },
  { key: 'inseam' as const, label: 'Inseam' },
  { key: 'shoeSize' as const, label: 'Shoe Size', showInfo: true },
];

const PersonalizationDimensionsStep = () => {
  const {
    shopPreference,
    unit,
    dimensions,
    setUnit,
    setDimension,
  } = usePersonalizationStore();

  const illustration = getMeasurementIllustration(shopPreference);
  const unitLabel = unit === 'cm' ? 'CM' : 'INCHES';

  return (
    <div
      className="flex flex-col md:flex-row w-full h-full flex-grow-1 gap-20 sm:gap-24 md:gap-32"
      style={{ minHeight: 0 }}
    >
      <div className="hidden md:flex md:w-40p flex-shrink-0 h-full a-items-center j-content-center">
        <div className="h-full w-full flex a-items-center j-content-center px-12">
          <Image
            src={illustration}
            alt="Body measurement guide"
            type="icon"
            className="w-100p h-full g|object-fit:contain"
          />
        </div>
      </div>

      <div
        className="flex flex-col flex-grow-1 min-w-0 h-full"
        style={{ minHeight: 0 }}
      >
        <div className="flex-shrink-0">
          <PersonalizationUnitToggle unit={unit} onChange={setUnit} />
        </div>

        <PersonalizationMeasurementsScroll>
          <div className="flex flex-col gap-12 sm:gap-16 pb-8">
            {MEASUREMENT_FIELDS.map((field) => (
              <PersonalizationMeasurementField
                key={field.key}
                label={field.label}
                placeholder={`EG.32${unitLabel}`}
                value={dimensions[field.key]}
                onChange={(value) => setDimension(field.key, value)}
                showInfo={field.showInfo}
              />
            ))}
          </div>
        </PersonalizationMeasurementsScroll>
      </div>
    </div>
  );
};

export default PersonalizationDimensionsStep;
