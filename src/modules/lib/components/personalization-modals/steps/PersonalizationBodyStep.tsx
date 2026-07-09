'use client';

import PersonalizationOptionCard from '../components/PersonalizationOptionCard';
import {
  BodyBuild,
  ShopPreference,
  usePersonalizationStore,
} from '@/modules/lib/utility/store/personalization.store';

export const SHOP_PREFERENCE_OPTIONS = [
  { id: 'women' as ShopPreference, label: 'Women', imageSrc: 'woman-vector.svg' },
  { id: 'men' as ShopPreference, label: 'Men', imageSrc: 'man-vector.svg' },
  { id: 'unisex' as ShopPreference, label: 'Unisex', imageSrc: 'unisex-vector.svg' },
] as const;

export const BODY_BUILD_OPTIONS = [
  { id: 'slim' as BodyBuild, label: 'Slim', imageSrc: 'slim-vector.svg' },
  { id: 'regular' as BodyBuild, label: 'Regular', imageSrc: 'regular-vector.svg' },
  { id: 'plus' as BodyBuild, label: 'Plus', imageSrc: 'plus-vector.svg' },
] as const;

const PersonalizationBodyStep = () => {
  const { shopPreference, bodyBuild, setShopPreference, setBodyBuild, fieldErrors } =
    usePersonalizationStore();

  const shopPreferenceError = fieldErrors.shopPreference;
  const bodyBuildError = fieldErrors.bodyBuild;

  return (
    <div className="flex flex-col gap-28 sm:gap-36">
      <section data-personalization-field="shopPreference">
        <h3 className="text-14 sm:text-16 weight-500 line-height-19 color-#000000 mb-16 sm:mb-26">
          How do you usually shop? <span className="color-red">*</span>
        </h3>
        <div className="grid grid-3-cols-1fr gap-10 sm:gap-16 md:gap-20 sm:px-12">
          {SHOP_PREFERENCE_OPTIONS.map((option) => (
            <PersonalizationOptionCard
              key={option.id}
              label={option.label}
              imageSrc={option.imageSrc}
              selected={shopPreference === option.id}
              onSelect={() =>
                setShopPreference(
                  shopPreference === option.id ? null : option.id,
                )
              }
            />
          ))}
        </div>
        {shopPreferenceError && (
          <p className="text-11 sm:text-12 color-red mt-10 sm:mt-12">
            {shopPreferenceError}
          </p>
        )}
      </section>

      <section data-personalization-field="bodyBuild">
        <h3 className="text-14 sm:text-16 weight-500 line-height-19 color-#000000 mb-4 sm:mb-6">
          Your build? <span className="color-red">*</span>
        </h3>
        <p className="text-11 sm:text-12 weight-500 line-height-19 color-#757575 mb-6 sm:mb-11">
          Which body shape resonates most with yours?
        </p>
        <div className="grid grid-3-cols-1fr gap-10 sm:gap-16 md:gap-20 sm:px-12">
          {BODY_BUILD_OPTIONS.map((option) => (
            <PersonalizationOptionCard
              key={option.id}
              label={option.label}
              imageSrc={option.imageSrc}
              selected={bodyBuild === option.id}
              onSelect={() =>
                setBodyBuild(bodyBuild === option.id ? null : option.id)
              }
            />
          ))}
        </div>
        {bodyBuildError && (
          <p className="text-11 sm:text-12 color-red mt-10 sm:mt-12">
            {bodyBuildError}
          </p>
        )}
      </section>
    </div>
  );
};

export default PersonalizationBodyStep;
