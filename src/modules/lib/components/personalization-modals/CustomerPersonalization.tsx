'use client';

import { useEffect, useState } from 'react';
import Modal from '@/modules/lib/components/modal/modal';
import PersonalizationIntroStep from './steps/PersonalizationIntroStep';
import PersonalizationStepLayout from './components/PersonalizationStepLayout';
import PersonalizationBodyStep from './steps/PersonalizationBodyStep';
import PersonalizationDimensionsStep from './steps/PersonalizationDimensionsStep';
import PersonalizationDoneStep from './steps/PersonalizationDoneStep';
import { PersonalizationFlowStep } from './types';
import {
  getMeasurementIllustration,
  usePersonalizationStore,
} from '@/modules/lib/utility/store/personalization.store';
import PersonalizationMeasurementGuideLightbox from './components/PersonalizationMeasurementGuideLightbox';
import {
  scrollToPersonalizationField,
  validateBodyStep,
  validateDimensionsStep,
} from './utils/personalization-validation';

interface CustomerPersonalizationProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomerPersonalization = ({
  isOpen,
  onClose,
}: CustomerPersonalizationProps) => {
  const [step, setStep] = useState<PersonalizationFlowStep>('intro');
  const [isMeasurementGuideOpen, setIsMeasurementGuideOpen] = useState(false);
  const {
    shopPreference,
    bodyBuild,
    dimensions,
    completedWizardSteps,
    markWizardStepComplete,
    markPersonalizationSetupComplete,
    setFieldErrors,
    clearFieldErrors,
  } = usePersonalizationStore();

  useEffect(() => {
    if (!isOpen) {
      setStep('intro');
      setIsMeasurementGuideOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (step !== 'dimensions') {
      setIsMeasurementGuideOpen(false);
    }
  }, [step]);

  const handleDismiss = () => {
    setStep('intro');
    setIsMeasurementGuideOpen(false);
    onClose();
  };

  const handleSaveComplete = () => {
    markPersonalizationSetupComplete();
    setStep('intro');
    setIsMeasurementGuideOpen(false);
    onClose();
  };

  const measurementIllustration = getMeasurementIllustration(shopPreference);

  const handleBodyContinue = () => {
    const result = validateBodyStep(shopPreference, bodyBuild);

    if (!result.valid) {
      setFieldErrors(result.errors);
      if (result.firstErrorKey) {
        scrollToPersonalizationField(result.firstErrorKey);
      }
      return;
    }

    clearFieldErrors();
    markWizardStepComplete(1);
    setStep('dimensions');
  };

  const handleDimensionsContinue = () => {
    const result = validateDimensionsStep(dimensions, shopPreference);

    if (!result.valid) {
      setFieldErrors(result.errors);
      if (result.firstErrorKey) {
        scrollToPersonalizationField(result.firstErrorKey);
      }
      return;
    }

    clearFieldErrors();
    markWizardStepComplete(2);
    setStep('done');
  };

  const renderStep = () => {
    switch (step) {
      case 'intro':
        return (
          <PersonalizationIntroStep
            onClose={handleDismiss}
            onContinue={() => setStep('body')}
          />
        );
      case 'body':
        return (
          <PersonalizationStepLayout
            activeStep={1}
            completedSteps={completedWizardSteps}
            layoutMode="footer-in-scroll"
            fitContent
            onBack={() => setStep('intro')}
            onClose={handleDismiss}
            onContinue={handleBodyContinue}
          >
            <PersonalizationBodyStep />
          </PersonalizationStepLayout>
        );
      case 'dimensions':
        return (
          <PersonalizationStepLayout
            activeStep={2}
            completedSteps={completedWizardSteps}
            layoutMode="fixed-body"
            onBack={() => setStep('body')}
            onClose={handleDismiss}
            onContinue={handleDimensionsContinue}
            showFooterBack
            onViewMeasurementGuide={() => setIsMeasurementGuideOpen(true)}
          >
            <PersonalizationDimensionsStep />
          </PersonalizationStepLayout>
        );
      case 'done':
        return (
          <PersonalizationStepLayout
            activeStep={3}
            completedSteps={completedWizardSteps}
            layoutMode="fixed-body"
            onBack={() => setStep('dimensions')}
            onClose={handleDismiss}
            onContinue={handleSaveComplete}
            showFooterBack
            continueLabel="Save my fits"
          >
            <PersonalizationDoneStep />
          </PersonalizationStepLayout>
        );
      default:
        return null;
    }
  };

  const useFitContentHeight = step === 'intro' || step === 'body';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleDismiss}
      closeOnOutsideClick={false}
      extraClass={{
        overflow: 'hidden',
        overflowY: 'hidden',
        maxHeight: 'calc(100dvh - 44px)',
        ...(useFitContentHeight
          ? { height: 'auto' }
          : {
              height: 'calc(100dvh - 44px)',
              display: 'flex',
              flexDirection: 'column',
            }),
      }}
      className={`w-95p sm:w-90p max-w-916 g|max-height:90vh no-scrollbar radius-12 ${
        useFitContentHeight ? 'h-fit' : 'h-full'
      }`}
    >
      {renderStep()}
      <PersonalizationMeasurementGuideLightbox
        isOpen={isMeasurementGuideOpen}
        illustration={measurementIllustration}
        onClose={() => setIsMeasurementGuideOpen(false)}
      />
    </Modal>
  );
};

export default CustomerPersonalization;
