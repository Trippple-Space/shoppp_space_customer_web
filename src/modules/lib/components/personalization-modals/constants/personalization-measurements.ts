import {
  MeasurementUnit,
  PersonalizationDimensions,
  ShopPreference,
} from '@/modules/lib/utility/store/personalization.store';

export type MeasurementCategoryId =
  | 'basicInfo'
  | 'upperBody'
  | 'lowerBody'
  | 'shoeSize';

export interface MeasurementFieldConfig {
  key: keyof PersonalizationDimensions;
  label: string;
  step?: number;
  showInfo?: boolean;
  required?: boolean;
}

export interface MeasurementCategoryConfig {
  id: MeasurementCategoryId;
  title: string;
  fields: MeasurementFieldConfig[];
}

export const PERSONALIZATION_MEASUREMENT_CATEGORIES: MeasurementCategoryConfig[] =
  [
    {
      id: 'basicInfo',
      title: 'Basic Info',
      fields: [{ key: 'height', label: 'Height', step: 1, required: true }],
    },
    {
      id: 'upperBody',
      title: 'Upper Body',
      fields: [
        { key: 'bust', label: 'Bust / Chest', step: 1, required: true },
        { key: 'waist', label: 'Waist', step: 1, required: true },
        { key: 'shoulder', label: 'Shoulder', step: 1 },
        { key: 'armsLength', label: 'Arms Length', step: 1 },
        { key: 'neck', label: 'Neck', step: 1 },
        { key: 'wrist', label: 'Wrist', step: 1 },
      ],
    },
    {
      id: 'lowerBody',
      title: 'Lower Body',
      fields: [
        { key: 'hip', label: 'Hip', step: 1, required: true },
        { key: 'inseam', label: 'Inseam', step: 1, required: true },
        { key: 'thigh', label: 'Thigh', step: 1 },
      ],
    },
    {
      id: 'shoeSize',
      title: 'Shoe Size',
      fields: [{ key: 'shoeSize', label: 'Size', step: 0.5, showInfo: true }],
    },
  ];

export const getAllMeasurementFields = (): MeasurementFieldConfig[] =>
  PERSONALIZATION_MEASUREMENT_CATEGORIES.flatMap((category) => category.fields);

export const getMeasurementFieldLabel = (
  field: MeasurementFieldConfig,
  shopPreference: ShopPreference | null,
): string => {
  if (field.key === 'bust') {
    if (shopPreference === 'men') return 'Chest';
    if (shopPreference === 'women') return 'Bust';
    return field.label;
  }

  return field.label;
};

export const getMeasurementPlaceholder = (
  fieldKey: keyof PersonalizationDimensions,
  unit: MeasurementUnit,
): string => {
  const unitLabel = unit === 'cm' ? 'CM' : 'INCHES';

  if (fieldKey === 'shoeSize') {
    return 'e.g. 42';
  }

  return `${fieldKey} in ${unitLabel}`;
};
