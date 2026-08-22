import { isCustomerConfigurationInput } from './configuration-field-target';
import { ConfigurationRecord } from './types/product.interface';
import {
  MeasurementUnit,
  PersonalizationDimensions,
  ShoeSizeScale,
} from './store/personalization.store';

type DimensionKey = keyof PersonalizationDimensions;

const DIMENSION_ALIASES: Array<{ key: DimensionKey; aliases: string[] }> = [
  {
    key: 'armsLength',
    aliases: ['armslength', 'armlength', 'sleevelength', 'sleeve'],
  },
  {
    key: 'shoeSize',
    aliases: ['shoesize', 'shoe', 'footwear', 'eusize', 'uksize', 'ussize'],
  },
  {
    key: 'shoulder',
    aliases: ['shoulderwidth', 'shoulders', 'shoulder'],
  },
  {
    key: 'inseam',
    aliases: ['inseam', 'insideleg', 'innerleg'],
  },
  {
    key: 'height',
    aliases: ['height'],
  },
  {
    key: 'bust',
    aliases: ['bustchest', 'chest', 'bust'],
  },
  {
    key: 'waist',
    aliases: ['waist'],
  },
  {
    key: 'neck',
    aliases: ['necksize', 'neck'],
  },
  {
    key: 'wrist',
    aliases: ['wrist'],
  },
  {
    key: 'hip',
    aliases: ['hipline', 'hips', 'hip'],
  },
  {
    key: 'thigh',
    aliases: ['thighs', 'thigh'],
  },
];

const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, '');

const isShoeContext = (value?: string | null) =>
  /shoe|footwear|foot/i.test(value ?? '');

export const matchPersonalizationDimension = (
  rawLabel: string,
  options?: { shoeContext?: boolean }
): DimensionKey | null => {
  const token = normalize(rawLabel);
  if (!token) return null;

  if (
    options?.shoeContext &&
    (token === 'size' || token === 'sizes' || token.endsWith('size'))
  ) {
    return 'shoeSize';
  }

  for (const { key, aliases } of DIMENSION_ALIASES) {
    if (aliases.some((alias) => token === alias || token.startsWith(alias))) {
      return key;
    }
  }

  return null;
};

const dimensionValue = (
  dimensions: PersonalizationDimensions,
  key: DimensionKey
) => {
  const raw = dimensions[key]?.trim();
  return raw || null;
};

const formatPrefillValue = (
  key: DimensionKey,
  value: string,
  unit: MeasurementUnit,
  shoeScale: ShoeSizeScale
) => {
  const suffix = key === 'shoeSize' ? shoeScale : unit;
  return `${value} (${suffix})`;
};

const fieldLabels = (field: any): string[] =>
  [
    field?.valueFormat?.fieldName,
    field?.keyFormat?.defaultValue,
    field?.keyFormat?.fieldName,
  ].filter((value): value is string => Boolean(value && String(value).trim()));

export const buildPersonalizationPrefill = (
  configurationRecords: ConfigurationRecord[],
  dimensions: PersonalizationDimensions,
  unit: MeasurementUnit = 'cm',
  shoeScale: ShoeSizeScale = 'EU'
): Record<string, any> => {
  const patch: Record<string, any> = {};

  for (const record of configurationRecords ?? []) {
    const shoeContext = isShoeContext(record?.description) || isShoeContext(record?.name);

    for (const field of record.customerDataForm ?? []) {
      if (!isCustomerConfigurationInput(field?.valueFormat?.targetUserType)) continue;

      const vf = field.valueFormat;
      if (!vf?.fieldName) continue;
      if (vf.type === 'arrayOfImages') continue;
      if (/note/i.test(fieldLabels(field).join(' '))) continue;

      if (vf.type === 'array' && Array.isArray(vf.defaultValue)) {
        const next: Record<string, string> = {};
        for (const key of vf.defaultValue as string[]) {
          const matched = matchPersonalizationDimension(String(key), {
            shoeContext,
          });
          if (!matched) continue;
          const value = dimensionValue(dimensions, matched);
          if (!value) continue;
          next[key] = formatPrefillValue(matched, value, unit, shoeScale);
        }
        if (Object.keys(next).length > 0) {
          patch[vf.fieldName] = next;
        }
        continue;
      }

      if (vf.type !== 'string' && vf.type !== 'number') continue;

      const matched = fieldLabels(field)
        .map((label) => matchPersonalizationDimension(label, { shoeContext }))
        .find(Boolean);

      if (!matched) continue;
      const value = dimensionValue(dimensions, matched);
      if (!value) continue;

      patch[vf.fieldName] = formatPrefillValue(matched, value, unit, shoeScale);
    }
  }

  return patch;
};

export const countPersonalizationPrefillMatches = (
  configurationRecords: ConfigurationRecord[],
  dimensions: PersonalizationDimensions,
  unit: MeasurementUnit = 'cm',
  shoeScale: ShoeSizeScale = 'EU'
) =>
  Object.keys(
    buildPersonalizationPrefill(configurationRecords, dimensions, unit, shoeScale)
  ).length;
