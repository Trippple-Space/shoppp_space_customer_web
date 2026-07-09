import {
  getAllMeasurementFields,
  getMeasurementFieldLabel,
} from '../constants/personalization-measurements';
import {
  BodyBuild,
  PersonalizationDimensions,
  ShopPreference,
} from '@/modules/lib/utility/store/personalization.store';
import { PersonalizationFieldErrorKey } from '../types';

export interface PersonalizationValidationResult {
  valid: boolean;
  errors: Partial<Record<PersonalizationFieldErrorKey, string>>;
  firstErrorKey?: PersonalizationFieldErrorKey;
}

const getFirstErrorKey = (
  errors: Partial<Record<PersonalizationFieldErrorKey, string>>,
): PersonalizationFieldErrorKey | undefined => {
  if (errors.shopPreference) {
    return 'shopPreference';
  }

  if (errors.bodyBuild) {
    return 'bodyBuild';
  }

  for (const field of getAllMeasurementFields()) {
    if (errors[field.key]) {
      return field.key;
    }
  }

  return undefined;
};

export const validateBodyStep = (
  shopPreference: ShopPreference | null,
  bodyBuild: BodyBuild | null,
): PersonalizationValidationResult => {
  const errors: Partial<Record<PersonalizationFieldErrorKey, string>> = {};

  if (!shopPreference) {
    errors.shopPreference = 'Please select how you usually shop';
  }

  if (!bodyBuild) {
    errors.bodyBuild = 'Please select your build';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    firstErrorKey: getFirstErrorKey(errors),
  };
};

export const validateDimensionsStep = (
  dimensions: PersonalizationDimensions,
  shopPreference: ShopPreference | null,
): PersonalizationValidationResult => {
  const errors: Partial<Record<PersonalizationFieldErrorKey, string>> = {};

  getAllMeasurementFields()
    .filter((field) => field.required)
    .forEach((field) => {
      const value = dimensions[field.key]?.trim();

      if (!value || Number.parseFloat(value) <= 0) {
        const label = getMeasurementFieldLabel(field, shopPreference);
        errors[field.key] = `Please enter your ${label.toLowerCase()}`;
      }
    });

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    firstErrorKey: getFirstErrorKey(errors),
  };
};

export const scrollToPersonalizationField = (key: PersonalizationFieldErrorKey) => {
  const element = document.querySelector(
    `[data-personalization-field="${key}"]`,
  );

  element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};
