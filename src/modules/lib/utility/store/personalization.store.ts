import { create } from 'zustand';
import {
  PersonalizationFieldErrorKey,
  PersonalizationWizardStep,
} from '@/modules/lib/components/personalization-modals/types';
import {
  FitOracleProfilePayload,
  FitOracleProfileResponse,
  fitOracleService,
} from '../services/fit-oracle.service';

export type ShopPreference = 'women' | 'men' | 'unisex';
export type BodyBuild = 'slim' | 'regular' | 'plus';
export type MeasurementUnit = 'cm' | 'inches';
export type ShoeSizeScale = 'EU' | 'UK' | 'US';

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

const PERSONALIZATION_DRAFT_KEY = 'personalization-draft';
const PERSONALIZATION_SETUP_KEY = 'personalization-setup-complete';

interface StoredPersonalizationDraft {
  shopPreference: ShopPreference | null;
  bodyBuild: BodyBuild | null;
  unit: MeasurementUnit;
  shoeScale: ShoeSizeScale;
  dimensions: PersonalizationDimensions;
  completedWizardSteps: PersonalizationWizardStep[];
  isPersonalizationSetup: boolean;
}

const writeStoredSetupFlag = (isComplete: boolean) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (isComplete) {
    window.localStorage.setItem(PERSONALIZATION_SETUP_KEY, 'true');
  } else {
    window.localStorage.removeItem(PERSONALIZATION_SETUP_KEY);
  }
};

const readStoredSetupFlag = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(PERSONALIZATION_SETUP_KEY) === 'true';
};

const readStoredDraft = (): StoredPersonalizationDraft | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(PERSONALIZATION_DRAFT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoredPersonalizationDraft>;
      return {
        shopPreference: parsed.shopPreference ?? null,
        bodyBuild: parsed.bodyBuild ?? null,
        unit: parsed.unit === 'inches' ? 'inches' : 'cm',
        shoeScale:
          parsed.shoeScale === 'UK' || parsed.shoeScale === 'US'
            ? parsed.shoeScale
            : 'EU',
        dimensions: { ...emptyDimensions, ...(parsed.dimensions ?? {}) },
        completedWizardSteps: Array.isArray(parsed.completedWizardSteps)
          ? parsed.completedWizardSteps.filter(
              (step): step is PersonalizationWizardStep =>
                step === 1 || step === 2 || step === 3,
            )
          : [],
        isPersonalizationSetup: Boolean(parsed.isPersonalizationSetup),
      };
    }
  } catch {
    // Ignore corrupt local draft.
  }

  if (readStoredSetupFlag()) {
    return {
      shopPreference: null,
      bodyBuild: null,
      unit: 'cm',
      shoeScale: 'EU',
      dimensions: { ...emptyDimensions },
      completedWizardSteps: [],
      isPersonalizationSetup: true,
    };
  }

  return null;
};

const writeStoredDraft = (draft: StoredPersonalizationDraft) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(PERSONALIZATION_DRAFT_KEY, JSON.stringify(draft));
  writeStoredSetupFlag(draft.isPersonalizationSetup);
};

const clearStoredDraft = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(PERSONALIZATION_DRAFT_KEY);
  writeStoredSetupFlag(false);
};

const pickDraftFromState = (
  state: Pick<
    PersonalizationStore,
    | 'shopPreference'
    | 'bodyBuild'
    | 'unit'
    | 'shoeScale'
    | 'dimensions'
    | 'completedWizardSteps'
    | 'isPersonalizationSetup'
  >,
): StoredPersonalizationDraft => ({
  shopPreference: state.shopPreference,
  bodyBuild: state.bodyBuild,
  unit: state.unit,
  shoeScale: state.shoeScale,
  dimensions: state.dimensions,
  completedWizardSteps: state.completedWizardSteps,
  isPersonalizationSetup: state.isPersonalizationSetup,
});

const storedDraft = readStoredDraft();

const toDimensionString = (value: string | number | null | undefined) => {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
};

/** Ceil numeric measurement strings to 2 decimal places (e.g. 33.141 → 33.15). */
const roundUpDimensionTo2dp = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return '';

  const num = Number(trimmed);
  if (!Number.isFinite(num)) return trimmed;

  const rounded = Math.ceil(num * 100 - Number.EPSILON) / 100;
  return String(Number(rounded.toFixed(2)));
};

const roundUpDimensionsTo2dp = (
  dimensions: PersonalizationDimensions,
): PersonalizationDimensions => {
  const next = { ...dimensions };
  (Object.keys(emptyDimensions) as Array<keyof PersonalizationDimensions>).forEach(
    (key) => {
      next[key] = roundUpDimensionTo2dp(dimensions[key] ?? '');
    },
  );
  return next;
};

interface PersonalizationStore {
  shopPreference: ShopPreference | null;
  bodyBuild: BodyBuild | null;
  unit: MeasurementUnit;
  shoeScale: ShoeSizeScale;
  dimensions: PersonalizationDimensions;
  completedWizardSteps: PersonalizationWizardStep[];
  fieldErrors: Partial<Record<PersonalizationFieldErrorKey, string>>;
  isPersonalizationSetup: boolean;
  setShopPreference: (value: ShopPreference | null) => void;
  setBodyBuild: (value: BodyBuild | null) => void;
  setUnit: (value: MeasurementUnit) => void;
  setShoeScale: (value: ShoeSizeScale) => void;
  setDimension: (field: keyof PersonalizationDimensions, value: string) => void;
  markWizardStepComplete: (step: PersonalizationWizardStep) => void;
  markPersonalizationSetupComplete: () => void;
  setFieldErrors: (
    errors: Partial<Record<PersonalizationFieldErrorKey, string>>,
  ) => void;
  clearFieldError: (key: PersonalizationFieldErrorKey) => void;
  clearFieldErrors: () => void;
  getProfilePayload: (markComplete?: boolean) => FitOracleProfilePayload;
  hydrateFromProfile: (
    payload: Partial<FitOracleProfileResponse> | null | undefined,
    options?: { isComplete?: boolean },
  ) => void;
  syncToApi: (markComplete?: boolean) => Promise<FitOracleProfileResponse>;
  reset: () => void;
}

export const usePersonalizationStore = create<PersonalizationStore>((set, get) => ({
  shopPreference: storedDraft?.shopPreference ?? null,
  bodyBuild: storedDraft?.bodyBuild ?? null,
  unit: storedDraft?.unit ?? 'cm',
  shoeScale: storedDraft?.shoeScale ?? 'EU',
  dimensions: storedDraft?.dimensions ?? { ...emptyDimensions },
  completedWizardSteps: storedDraft?.completedWizardSteps ?? [],
  fieldErrors: {},
  isPersonalizationSetup: storedDraft?.isPersonalizationSetup ?? false,

  setShopPreference: (value) =>
    set((state) => ({
      shopPreference: value,
      ...(value && {
        fieldErrors: Object.fromEntries(
          Object.entries(state.fieldErrors).filter(
            ([key]) => key !== 'shopPreference',
          ),
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

  setShoeScale: (shoeScale) => set({ shoeScale }),

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
    const roundedDimensions = roundUpDimensionsTo2dp(get().dimensions);
    set({
      dimensions: roundedDimensions,
      isPersonalizationSetup: true,
    });
    writeStoredDraft(
      pickDraftFromState({
        ...get(),
        dimensions: roundedDimensions,
        isPersonalizationSetup: true,
      }),
    );
  },

  setFieldErrors: (errors) => set({ fieldErrors: errors }),

  clearFieldError: (key) =>
    set((state) => ({
      fieldErrors: Object.fromEntries(
        Object.entries(state.fieldErrors).filter(
          ([errorKey]) => errorKey !== key,
        ),
      ),
    })),

  clearFieldErrors: () => set({ fieldErrors: {} }),

  getProfilePayload: (markComplete) => {
    const { shopPreference, bodyBuild, unit, shoeScale, dimensions } = get();
    return {
      shopPreference,
      bodyBuild,
      unit,
      shoeScale,
      dimensions: roundUpDimensionsTo2dp(dimensions),
      ...(markComplete !== undefined ? { markComplete } : {}),
    };
  },

  hydrateFromProfile: (payload, options) => {
    if (!payload) {
      if (options?.isComplete !== undefined) {
        set({ isPersonalizationSetup: options.isComplete });
        writeStoredDraft(
          pickDraftFromState({
            ...get(),
            isPersonalizationSetup: options.isComplete,
          }),
        );
      }
      return;
    }

    const nextDimensions = { ...emptyDimensions };
    if (payload.dimensions) {
      (Object.keys(emptyDimensions) as Array<keyof PersonalizationDimensions>).forEach(
        (key) => {
          nextDimensions[key] = toDimensionString(payload.dimensions?.[key]);
        },
      );
    }

    const isComplete =
      options?.isComplete ??
      payload.isComplete ??
      (payload.completedAt !== undefined
        ? Boolean(payload.completedAt)
        : undefined);

    if (isComplete !== undefined) {
      writeStoredSetupFlag(isComplete);
    }

    const nextState = {
      shopPreference: payload.shopPreference ?? null,
      bodyBuild: payload.bodyBuild ?? null,
      unit: payload.unit ?? 'cm',
      shoeScale: (
        payload.shoeScale === 'UK'
          ? 'UK'
          : payload.shoeScale === 'US'
            ? 'US'
            : 'EU'
      ) as ShoeSizeScale,
      dimensions: nextDimensions,
      ...(isComplete !== undefined ? { isPersonalizationSetup: isComplete } : {}),
    };

    set(nextState);

    writeStoredDraft(
      pickDraftFromState({
        ...get(),
        ...nextState,
        isPersonalizationSetup:
          isComplete !== undefined
            ? isComplete
            : get().isPersonalizationSetup,
      }),
    );
  },

  syncToApi: async (markComplete = true) => {
    const roundedDimensions = roundUpDimensionsTo2dp(get().dimensions);
    set({ dimensions: roundedDimensions });
    writeStoredDraft(
      pickDraftFromState({ ...get(), dimensions: roundedDimensions }),
    );

    const payload = get().getProfilePayload(markComplete);
    const response = await fitOracleService.upsertProfile(payload);
    get().hydrateFromProfile(response, { isComplete: response.isComplete });
    return response;
  },

  reset: () => {
    clearStoredDraft();

    set({
      shopPreference: null,
      bodyBuild: null,
      unit: 'cm',
      shoeScale: 'EU',
      dimensions: { ...emptyDimensions },
      completedWizardSteps: [],
      fieldErrors: {},
      isPersonalizationSetup: false,
    });
  },
}));

usePersonalizationStore.subscribe((state) => {
  writeStoredDraft(pickDraftFromState(state));
});

export const getMeasurementIllustration = (
  shopPreference: ShopPreference | null,
) => {
  if (shopPreference === 'men') {
    return 'personalization-measurement-male.svg';
  }

  return 'personalization-measurement-female.svg';
};

let hydrateProfileInFlight: ReturnType<
  typeof fitOracleService.getProfile
> | null = null;

export const hydratePersonalizationFromApi = async () => {
  if (hydrateProfileInFlight) {
    return hydrateProfileInFlight;
  }

  hydrateProfileInFlight = fitOracleService
    .getProfile()
    .then(async (response) => {
      if (response.profile) {
        usePersonalizationStore
          .getState()
          .hydrateFromProfile(response.profile, {
            isComplete: response.isComplete,
          });
        return response;
      }

      const local = usePersonalizationStore.getState();
      if (local.isPersonalizationSetup) {
        try {
          await local.syncToApi(true);
        } catch {
          // Keep local draft when sync fails (offline, etc.).
        }
      }

      return response;
    })
    .finally(() => {
      hydrateProfileInFlight = null;
    });

  return hydrateProfileInFlight;
};
