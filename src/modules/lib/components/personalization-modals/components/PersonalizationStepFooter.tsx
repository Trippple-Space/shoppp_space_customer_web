import Button from '@/modules/lib/components/button/Button';
import { PiRuler } from 'react-icons/pi';
import { IoChevronBack } from 'react-icons/io5';

interface PersonalizationStepFooterProps {
  onContinue: () => void;
  onBack?: () => void;
  showBack?: boolean;
  showProTip?: boolean;
  continueLabel?: string;
  onViewMeasurementGuide?: () => void;
}

const primaryButtonClass =
  'radius-6 py-12 px-16 sm:px-20 text-14 sm:text-16 weight-500 hover:bg-darkgreen g|transition:background-color|_|0.3s g|transition-timing-function:ease';

const PersonalizationStepFooter = ({
  onContinue,
  onBack,
  showBack = false,
  showProTip = false,
  continueLabel = 'Continue',
  onViewMeasurementGuide,
}: PersonalizationStepFooterProps) => {
  return (
    <div className="flex flex-col gap-8 sm:gap-12">
      {showProTip && (
        <div className="flex gap-10 py-12 px-6 sm:py-20 sm:px-10 bg-#F5F5F5 radius-12">
          <PiRuler className="w-19 h-19 flex-shrink-0 color-#000000" />
          <p className="line-height-11">
            <span className="weight-600 color-#000000 text-12 sm:text-13">
              Pro tip for chest measurement
            </span>
            <br />
            <span className="weight-500 color-#757575 text-8 sm:text-8.5">
              Wrap the measuring tape around the fullest part of your chest,
              keeping it parallel to the floor. Don&apos;t hold your breath.
              {onViewMeasurementGuide && (
                <>
                  {' '}
                  <button
                    type="button"
                    onClick={onViewMeasurementGuide}
                    className="border-none bg-transparent p-0 cursor-pointer color-#0B9378 weight-500 underline sm:hidden mt-3 text-9"
                  >
                    View measurement guide
                  </button>
                </>
              )}
            </span>
          </p>
        </div>
      )}

      {!showBack ? (
        <Button
          type="button"
          onClick={onContinue}
          className={`w-full! max-w-725 ${primaryButtonClass}`}
        >
          {continueLabel}
        </Button>
      ) : (
        <div className="flex gap-10 sm:gap-12 w-full">
          <Button
            type="button"
            onClick={onBack}
            className="bg-#F5F5F5! color-#000000! hover:bg-#F5F5F5! radius-6 py-12 px-16 sm:px-20 text-14 sm:text-16 weight-500 flex a-items-center j-content-center gap-6 whitespace-nowrap"
          >
            <IoChevronBack className="w-16 h-16" />
            Back
          </Button>
          <Button
            type="button"
            onClick={onContinue}
            className={`flex-grow-1 w-full! ${primaryButtonClass}`}
          >
            {continueLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PersonalizationStepFooter;
