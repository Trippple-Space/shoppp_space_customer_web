'use client';

import Image from '@/modules/lib/components/image/Image';
import PersonalizationMeasurementsScroll from '../components/PersonalizationMeasurementsScroll';
import PersonalizationMeasurementField from '../components/PersonalizationMeasurementField';
import PersonalizationUnitToggle from '../components/PersonalizationUnitToggle';
import PersonalizationShoeScaleToggle from '../components/PersonalizationShoeScaleToggle';
import {
  getMeasurementFieldLabel,
  getMeasurementPlaceholder,
  PERSONALIZATION_MEASUREMENT_CATEGORIES,
} from '../constants/personalization-measurements';
import {
  getMeasurementIllustration,
  usePersonalizationStore,
} from '@/modules/lib/utility/store/personalization.store';

const PersonalizationDimensionsStep = () => {
  const {
    shopPreference,
    unit,
    shoeScale,
    dimensions,
    fieldErrors,
    setUnit,
    setShoeScale,
    setDimension,
  } = usePersonalizationStore();

  const illustration = getMeasurementIllustration(shopPreference);

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
          <div className="flex flex-col gap-20 sm:gap-24 pb-8">
            {PERSONALIZATION_MEASUREMENT_CATEGORIES.map((category) => (
              <section key={category.id}>
                <div className="flex a-items-center space-between gap-12 flex-wrap mb-12 sm:mb-14">
                  <h3 className="text-13 sm:text-14 weight-600 color-#000000 m-0">
                    {category.title}
                  </h3>
                  {category.id === 'shoeSize' && (
                    <PersonalizationShoeScaleToggle
                      value={shoeScale}
                      onChange={setShoeScale}
                    />
                  )}
                </div>

                <div className="flex flex-col gap-12 sm:gap-16">
                  {category.fields.map((field) => (
                    <PersonalizationMeasurementField
                      key={field.key}
                      fieldKey={field.key}
                      label={
                        field.key === 'shoeSize'
                          ? `Size (${shoeScale})`
                          : getMeasurementFieldLabel(field, shopPreference)
                      }
                      placeholder={getMeasurementPlaceholder(field.key, unit)}
                      value={dimensions[field.key]}
                      onChange={(value) => setDimension(field.key, value)}
                      showInfo={field.showInfo}
                      step={field.step}
                      required={field.required}
                      error={fieldErrors[field.key]}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </PersonalizationMeasurementsScroll>
      </div>
    </div>
  );
};

export default PersonalizationDimensionsStep;
