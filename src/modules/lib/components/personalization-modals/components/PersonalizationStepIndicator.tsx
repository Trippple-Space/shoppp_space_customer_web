import { PERSONALIZATION_WIZARD_STEPS, PersonalizationWizardStep } from '../types';

interface PersonalizationStepIndicatorProps {
  activeStep: PersonalizationWizardStep;
  completedSteps: PersonalizationWizardStep[];
}

const PersonalizationStepIndicator = ({
  activeStep,
  completedSteps,
}: PersonalizationStepIndicatorProps) => {
  return (
    <div className="flex w-full bg-#F5F5F5 p-4 gap-4 max-w-510 mx-auto">
      {PERSONALIZATION_WIZARD_STEPS.map((step) => {
        const isActive = step.id === activeStep;
        const isCompleted = completedSteps.includes(step.id);

        let stateClass =
          'bg-transparent color-#757575';

        if (isActive) {
          stateClass = 'bg-#0B9378 color-white';
        } else if (isCompleted) {
          stateClass = 'bg-#EDFCF7 color-#0B9378';
        }

        return (
          <div
            key={step.id}
            className={`flex-grow-1 text-center py-6 sm:py-10 weight-600 line-height-17.81 radius-4.86 text-11 sm:text-12.95 g|transition:background-color|_|0.3s g|transition-timing-function:ease ${stateClass}`}
          >
            {step.label}
          </div>
        );
      })}
    </div>
  );
};

export default PersonalizationStepIndicator;
