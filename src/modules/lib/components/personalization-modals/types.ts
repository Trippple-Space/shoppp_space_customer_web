export type PersonalizationFlowStep = 'intro' | 'body' | 'dimensions' | 'done';

export type PersonalizationWizardStep = 1 | 2 | 3;

export type PersonalizationFieldErrorKey =
  | 'shopPreference'
  | 'bodyBuild'
  | 'height'
  | 'bust'
  | 'waist'
  | 'shoulder'
  | 'armsLength'
  | 'neck'
  | 'wrist'
  | 'hip'
  | 'inseam'
  | 'thigh'
  | 'shoeSize';

export const PERSONALIZATION_WIZARD_STEPS: {
  id: PersonalizationWizardStep;
  label: string;
}[] = [
  { id: 1, label: '1. Body' },
  { id: 2, label: '2. Dimensions' },
  { id: 3, label: '3. Done' },
];
