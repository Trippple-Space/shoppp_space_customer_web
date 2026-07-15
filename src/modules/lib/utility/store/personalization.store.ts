import { create } from 'zustand';
import { PersonalizationFieldErrorKey, PersonalizationWizardStep } from '@/modules/lib/components/personalization-modals/types';

export type ShopPreference = 'women' | 'men' | 'unisex';
export type BodyBuild = 'slim' | 'regular' | 'plus';
export type MeasurementUnit = 'cm' | 'inches';

export interface PersonalizationDimensions {
  height: string;
  bust: string;
  waist: string;
  shoulder: string;
  armsLength: string;
  neck: string;
  wrist: string;
  hip: string;
  inseam: string;
  thigh: string;
  shoeSize: string;
}

const emptyDimensions: PersonalizationDimensions = {
  height: '',
  bust: '',
  waist: '',
  shoulder: '',
  armsLength: '',
  neck: '',
  wrist: '',
  hip: '',
  inseam: '',
  thigh: '',
  shoeSize: '',
};

interface PersonalizationStore {
  shopPreference: ShopPreference | null;
  bodyBuild: BodyBuild | null;
  unit: MeasurementUnit;
  dimensions: PersonalizationDimensions;
  completedWizardSteps: PersonalizationWizardStep[];
  fieldErrors: Partial<Record<PersonalizationFieldErrorKey, string>>;
  isPersonalizationSetup: boolean;
  setShopPreference: (value: ShopPreference | null) => void;
  setBodyBuild: (value: BodyBuild | null) => void;
  setUnit: (value: MeasurementUnit) => void;
  setDimension: (field: keyof PersonalizationDimensions, value: string) => void;
  markWizardStepComplete: (step: PersonalizationWizardStep) => void;
  markPersonalizationSetupComplete: () => void;
  setFieldErrors: (
    errors: Partial<Record<PersonalizationFieldErrorKey, string>>,
  ) => void;
  clearFieldError: (key: PersonalizationFieldErrorKey) => void;
  clearFieldErrors: () => void;
  reset: () => void;
}

const readStoredSetupFlag = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem('personalization-setup-complete') === 'true';
};

export const usePersonalizationStore = create<PersonalizationStore>((set) => ({
  shopPreference: null,
  bodyBuild: null,
  unit: 'cm',
  dimensions: { ...emptyDimensions },
  completedWizardSteps: [],
  fieldErrors: {},
  isPersonalizationSetup: readStoredSetupFlag(),

  setShopPreference: (value) =>
    set((state) => ({
      shopPreference: value,
      ...(value && {
        fieldErrors: Object.fromEntries(
          Object.entries(state.fieldErrors).filter(([key]) => key !== 'shopPreference'),
        ),
      }),
    })),

  setBodyBuild: (value) =>
    set((state) => ({
      bodyBuild: value,
      ...(value && {
        fieldErrors: Object.fromEntries(
          Object.entries(state.fieldErrors).filter(([key]) => key !== 'bodyBuild'),
        ),
      }),
    })),

  setUnit: (unit) => set({ unit }),

  setDimension: (field, value) =>
    set((state) => ({
      dimensions: { ...state.dimensions, [field]: value },
      fieldErrors: Object.fromEntries(
        Object.entries(state.fieldErrors).filter(([key]) => key !== field),
      ),
    })),

  markWizardStepComplete: (step) =>
    set((state) => ({
      completedWizardSteps: state.completedWizardSteps.includes(step)
        ? state.completedWizardSteps
        : [...state.completedWizardSteps, step],
    })),

  markPersonalizationSetupComplete: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('personalization-setup-complete', 'true');
    }

    set({ isPersonalizationSetup: true });
  },

  setFieldErrors: (errors) => set({ fieldErrors: errors }),

  clearFieldError: (key) =>
    set((state) => ({
      fieldErrors: Object.fromEntries(
        Object.entries(state.fieldErrors).filter(([errorKey]) => errorKey !== key),
      ),
    })),

  clearFieldErrors: () => set({ fieldErrors: {} }),

  reset: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('personalization-setup-complete');
    }

    set({
      shopPreference: null,
      bodyBuild: null,
      unit: 'cm',
      dimensions: { ...emptyDimensions },
      completedWizardSteps: [],
      fieldErrors: {},
      isPersonalizationSetup: false,
    });
  },
}));

export const getMeasurementIllustration = (
  shopPreference: ShopPreference | null,
) => {
  if (shopPreference === 'men') {
    return 'personalization-measurement-male.svg';
  }

  return 'personalization-measurement-female.svg';
};
