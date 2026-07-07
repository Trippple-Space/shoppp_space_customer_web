'use client';

import { useEffect, useState } from 'react';
import Modal from '@/modules/lib/components/modal/modal';
import PersonalizationIntroStep from './steps/PersonalizationIntroStep';
import PersonalizationStepLayout from './components/PersonalizationStepLayout';
import PersonalizationBodyStep from './steps/PersonalizationBodyStep';
import PersonalizationDimensionsStep from './steps/PersonalizationDimensionsStep';
import PersonalizationDoneStep from './steps/PersonalizationDoneStep';
import { PersonalizationFlowStep } from './types';
import { usePersonalizationStore } from '@/modules/lib/utility/store/personalization.store';

interface CustomerPersonalizationProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomerPersonalization = ({
  isOpen,
  onClose,
}: CustomerPersonalizationProps) => {
  const [step, setStep] = useState<PersonalizationFlowStep>('intro');
  const resetPersonalization = usePersonalizationStore((state) => state.reset);

  useEffect(() => {
    if (!isOpen) {
      setStep('intro');
    }
  }, [isOpen]);

  const handleClose = () => {
    setStep('intro');
    resetPersonalization();
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case 'intro':
        return (
          <PersonalizationIntroStep
            onClose={handleClose}
            onContinue={() => setStep('body')}
          />
        );
      case 'body':
        return (
          <PersonalizationStepLayout
            activeStep={1}
            layoutMode="footer-in-scroll"
            onBack={() => setStep('intro')}
            onClose={handleClose}
            onContinue={() => setStep('dimensions')}
          >
            <PersonalizationBodyStep />
          </PersonalizationStepLayout>
        );
      case 'dimensions':
        return (
          <PersonalizationStepLayout
            activeStep={2}
            layoutMode="fixed-body"
            onBack={() => setStep('body')}
            onClose={handleClose}
            onContinue={() => setStep('done')}
            showFooterBack
          >
            <PersonalizationDimensionsStep />
          </PersonalizationStepLayout>
        );
      case 'done':
        return (
          <PersonalizationStepLayout
            activeStep={3}
            layoutMode="fixed-body"
            onBack={() => setStep('dimensions')}
            onClose={handleClose}
            onContinue={handleClose}
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

  const isIntroStep = step === 'intro';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOutsideClick={false}
      extraClass={{
        overflow: 'hidden',
        overflowY: 'hidden',
        maxHeight: 'calc(100dvh - 44px)',
        ...(isIntroStep
          ? { height: 'auto' }
          : {
              height: 'calc(100dvh - 44px)',
              display: 'flex',
              flexDirection: 'column',
            }),
      }}
      className={`w-95p sm:w-90p max-w-916 g|max-height:90vh no-scrollbar radius-12 ${
        isIntroStep ? 'h-fit' : 'h-full'
      }`}
    >
      {renderStep()}
    </Modal>
  );
};

export default CustomerPersonalization;
