import {
  PersonalizationDimensions,
  MeasurementUnit,
} from '@/modules/lib/utility/store/personalization.store';
import { getAllMeasurementFields } from '@/modules/lib/components/personalization-modals/constants/personalization-measurements';
import { ProductFitRecommendationData } from '../types/product-fit-recommendation';

const formatMeasurement = (value: string, unit: MeasurementUnit) => {
  const normalized = value.trim() || '0';
  return unit === 'cm' ? `${normalized}cm` : `${normalized}in`;
};

const buildProfileSummary = (
  dimensions: PersonalizationDimensions,
  unit: MeasurementUnit,
) =>
  getAllMeasurementFields()
    .flatMap((field) => {
      const rawValue = dimensions[field.key]?.trim();
      if (!rawValue) {
        return [];
      }

      const formatted = formatMeasurement(rawValue, unit).replace(/cm|in/g, '');
      return [`${field.key} ${formatted}`];
    })
    .join(', ');

export const getProductFitRecommendation = (
  dimensions: PersonalizationDimensions,
  unit: MeasurementUnit,
  variantId?: string,
  userName = '',
  sizeLabel = '',
): ProductFitRecommendationData => {
  const chest = formatMeasurement(dimensions.bust || '', unit);
  const waist = formatMeasurement(dimensions.waist || '', unit);
  const shoulder = formatMeasurement(dimensions.shoulder || '', unit);
  const hips = formatMeasurement(dimensions.hip || '', unit);
  const profileSummary = buildProfileSummary(dimensions, unit);

  // Placeholder logic until fit API is wired — even variant ids demo perfect fit.
  const numericVariantId = variantId ? Number.parseInt(variantId, 10) : 0;
  /* const isPerfectFit = Number.isNaN(numericVariantId)
    ? true
    : numericVariantId % 2 === 0; */

  const isPerfectFit = true;

  if (isPerfectFit) {
    return {
      status: 'perfect',
      sizeLabel,
      headline: 'Great! This will size you - Fitted',
      subheadline: `Based on your measurements for size ${sizeLabel}`,
      statusBadge: 'Perfect match',
      description:
        'This garment sits close to the body through the shoulder and bust, with comfortable ease through the waist and hips. Ideal for your frame.',
      measurements: [
        {
          label: 'CHEST',
          userValue: chest,
          garmentRange: '90-94cm',
          easeLabel: '+ 3cm ease',
        },
        {
          label: 'WAIST',
          userValue: waist,
          garmentRange: '74-78cm',
          easeLabel: '+ 1cm ease',
        },
        {
          label: 'SHOULDER',
          userValue: shoulder,
          garmentRange: '38-40cm',
          easeLabel: '+ 1cm ease',
          visibility: 'desktop',
        },
        {
          label: 'HIPS',
          userValue: hips,
          garmentRange: '96-100cm',
          easeLabel: '+ 1cm ease',
          visibility: 'mobile',
        },
      ],
      spectrum: [
        { id: 'fitted', label: 'Fitted', active: true },
        { id: 'slightly-loose', label: 'Slightly Loose', active: false },
        { id: 'oversized', label: 'Oversized', active: false },
        { id: 'tight', label: 'Tight', active: false },
        { id: 'too-tight', label: 'Too tight', active: false },
        { id: 'wont-fit', label: "Won't fit", active: false },
      ],
      profileSummary,
      userName,
    };
  }

  return {
    status: 'warning',
    sizeLabel,
    headline: 'Extremely Oversize',
    subheadline: 'This will be extremely oversized on you',
    statusBadge: 'Extremely Oversize',
    description:
      'This size runs significantly larger than your frame. The garment will have a very boxy, fashion-forward silhouette - intentional if you love the oversized look.',
    measurements: [
      {
        label: 'CHEST',
        userValue: chest,
        garmentRange: '90-94cm',
        easeLabel: '+ 13-15cm',
      },
      {
        label: 'WAIST',
        userValue: waist,
        garmentRange: '74-78cm',
        easeLabel: '+ 14-17cm',
      },
      {
        label: 'SHOULDER',
        userValue: shoulder,
        garmentRange: '42-44cm',
        easeLabel: '+ 5-7cm',
      },
    ],
    spectrum: [
      { id: 'fitted', label: 'Fitted', active: false },
      { id: 'slightly-loose', label: 'Slightly Loose', active: false },
      { id: 'oversized', label: 'Oversized', active: true },
      { id: 'tight', label: 'Tight', active: false },
      { id: 'too-tight', label: 'Too tight', active: false },
      { id: 'wont-fit', label: "Won't fit", active: false },
    ],
    profileSummary,
    userName,
  };
};
