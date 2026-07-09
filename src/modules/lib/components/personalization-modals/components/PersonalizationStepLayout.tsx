import { ReactNode } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { IoChevronBack } from 'react-icons/io5';
import { PersonalizationWizardStep } from '../types';
import PersonalizationStepFooter from './PersonalizationStepFooter';
import PersonalizationStepIndicator from './PersonalizationStepIndicator';

const MODAL_BODY_MAX_HEIGHT = 'calc(100dvh - 48px)';

export type PersonalizationStepLayoutMode =
  | 'default'
  | 'footer-in-scroll'
  | 'fixed-body';

interface PersonalizationStepLayoutProps {
  activeStep: PersonalizationWizardStep;
  completedSteps?: PersonalizationWizardStep[];
  onBack: () => void;
  onClose: () => void;
  onContinue: () => void;
  showFooterBack?: boolean;
  layoutMode?: PersonalizationStepLayoutMode;
  fitContent?: boolean;
  continueLabel?: string;
  onViewMeasurementGuide?: () => void;
  children: ReactNode;
}

const PersonalizationStepLayout = ({
  activeStep,
  completedSteps = [],
  onBack,
  onClose,
  onContinue,
  showFooterBack = false,
  layoutMode = 'default',
  fitContent = false,
  continueLabel,
  onViewMeasurementGuide,
  children,
}: PersonalizationStepLayoutProps) => {
  const footer = (
    <PersonalizationStepFooter
      onContinue={onContinue}
      onBack={onBack}
      showBack={showFooterBack}
      showProTip={activeStep === 2}
      continueLabel={continueLabel}
      onViewMeasurementGuide={onViewMeasurementGuide}
    />
  );

  const stepIndicator = (
    <div className="pt-6 pb-16 sm:pb-30">
      <PersonalizationStepIndicator
        activeStep={activeStep}
        completedSteps={completedSteps}
      />
    </div>
  );

  return (
    <div
      className={`w-full bg-white radius-12 overflow-hidden flex flex-col ${
        fitContent ? 'h-fit' : 'h-full'
      }`}
      style={
        fitContent
          ? { maxHeight: MODAL_BODY_MAX_HEIGHT }
          : { maxHeight: MODAL_BODY_MAX_HEIGHT, minHeight: 0 }
      }
    >
      <div className="flex-shrink-0 p-8 sm:p-16 md:p-24">
        <div className="flex a-items-start j-content-between gap-6 sm:gap-8 px-8 sm:px-16 md:px-24 py-12 border-b border-b-1 border-b-#00000014">
          <button
            type="button"
            className="border-none outline-none bg-transparent p-0 cursor-pointer flex a-items-center j-content-center flex-shrink-0 mt-2"
            onClick={onBack}
            aria-label="Go back"
          >
            <IoChevronBack className="w-20 h-20 color-#000000" />
          </button>

          <p className="text-12 sm:text-14 md:text-16 line-height-20 sm:line-height-24 weight-600 flex-grow-1 min-w-0 px-8">
            <span className="color-#000000">Your Measurements-</span>
            <span className="color-#757575 weight-400">
              {' '}
              We keep these private. Used only to give you fit guidance.
            </span>
          </p>

          <button
            type="button"
            className="border-none outline-none bg-transparent p-0 cursor-pointer flex a-items-center j-content-center flex-shrink-0"
            onClick={onClose}
            aria-label="Close"
          >
            <AiOutlineClose className="sm:w-20 sm:h-20 w-16 h-16 color-#000000" />
          </button>
        </div>
      </div>

      <div className="flex-shrink-0 px-8 sm:px-16 md:px-24">
        {stepIndicator}
      </div>

      {layoutMode === 'footer-in-scroll' && (
        <div
          className={`overflow-auto scroll-y px-8 sm:px-16 md:px-24 ${
            fitContent ? 'flex-1 min-h-0' : 'flex-grow-1'
          }`}
          style={fitContent ? undefined : { minHeight: 0 }}
        >
          <div className={`pt-5 pb-24 sm:pb-32 md:pb-36 max-w-510 mx-auto`}>
            {children}
          </div>
          <div className={`pb-16 sm:pb-24 md:pb-32 max-w-510 mx-auto`}>
            {footer}
          </div>
        </div>
      )}

      {layoutMode === 'fixed-body' && (
        <>
          <div
            className="flex-grow-1 flex flex-col px-8 sm:px-16 md:px-24 pt-5 w-full"
            style={{ minHeight: 0, flex: '1 1 0' }}
          >
            <div
              className="flex-grow-1 flex flex-col w-full max-w-510 mx-auto h-full"
              style={{ minHeight: 0 }}
            >
              {children}
            </div>
          </div>
          <div className="flex-shrink-0 px-8 sm:px-16 md:px-24 pb-16 sm:pb-24 md:pb-32 pt-17">
            <div className="max-w-510 mx-auto w-full">{footer}</div>
          </div>
        </>
      )}

      {layoutMode === 'default' && (
        <>
          <div
            className="flex-grow-1 overflow-auto scroll-y px-8 sm:px-16 md:px-24"
            style={{ minHeight: 0 }}
          >
            <div className={`pb-24 sm:pb-32 md:pb-36 pt-5 max-w-510 mx-auto`}>
              {children}
            </div>
          </div>
          <div className="flex-shrink-0 px-8 sm:px-16 md:px-24 pb-16 sm:pb-24 md:pb-32 pt-8">
            <div className={`max-w-510 mx-auto`}>{footer}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default PersonalizationStepLayout;
