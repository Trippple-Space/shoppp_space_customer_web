import { create } from 'zustand';

export type ShopPreference = 'women' | 'men' | 'unisex';
export type BodyBuild = 'slim' | 'regular' | 'plus';
export type MeasurementUnit = 'cm' | 'inches';

export interface PersonalizationDimensions {
  bust: string;
  waist: string;
  hip: string;
  armsLength: string;
  inseam: string;
  shoeSize: string;
}

const emptyDimensions: PersonalizationDimensions = {
  bust: '',
  waist: '',
  hip: '',
  armsLength: '',
  inseam: '',
  shoeSize: '',
};

interface PersonalizationStore {
  shopPreference: ShopPreference | null;
  bodyBuild: BodyBuild | null;
  unit: MeasurementUnit;
  dimensions: PersonalizationDimensions;
  setShopPreference: (value: ShopPreference) => void;
  setBodyBuild: (value: BodyBuild) => void;
  setUnit: (value: MeasurementUnit) => void;
  setDimension: (field: keyof PersonalizationDimensions, value: string) => void;
  reset: () => void;
}

export const usePersonalizationStore = create<PersonalizationStore>((set) => ({
  shopPreference: null,
  bodyBuild: null,
  unit: 'cm',
  dimensions: { ...emptyDimensions },

  setShopPreference: (value) => set({ shopPreference: value }),

  setBodyBuild: (value) => set({ bodyBuild: value }),

  setUnit: (unit) => set({ unit }),

  setDimension: (field, value) =>
    set((state) => ({
      dimensions: { ...state.dimensions, [field]: value },
    })),

  reset: () =>
    set({
      shopPreference: null,
      bodyBuild: null,
      unit: 'cm',
      dimensions: { ...emptyDimensions },
    }),
}));

export const getMeasurementIllustration = (
  shopPreference: ShopPreference | null
) => {
  if (shopPreference === 'men') {
    return 'personalization-measurement-male.svg';
  }

  return 'personalization-measurement-female.svg';
};
