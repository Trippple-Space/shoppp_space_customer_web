'use client';

import Image from '@/modules/lib/components/image/Image';
import Button from '@/modules/lib/components/button/Button';
import { AiOutlineClose } from 'react-icons/ai';

const PERSONALIZATION_INTRO_IMAGE = 'measurement.svg';
const MODAL_BODY_MAX_HEIGHT = 'calc(100dvh - 48px)';

interface PersonalizationIntroStepProps {
  onClose: () => void;
  onContinue: () => void;
}

const PersonalizationIntroStep = ({
  onClose,
  onContinue,
}: PersonalizationIntroStepProps) => {
  return (
    <div
      className="w-full bg-white radius-12 overflow-hidden flex flex-col h-fit"
      style={{ maxHeight: MODAL_BODY_MAX_HEIGHT }}
    >
      <div className="flex-shrink-0 p-8 sm:p-16 md:p-24 pb-0">
        <div className="flex a-items-center j-content-between gap-12 px-16 sm:px-20 md:px-24 py-12 border-b border-b-1 border-b-#00000014">
          <p className="text-14 sm:text-16 line-height-24 weight-600">
            <span className="color-#000000">Fit Oracle-</span>
            <span className="color-#757575"> Smart size Analysis</span>
          </p>
          <button
            type="button"
            className="border-none outline-none bg-transparent p-0 cursor-pointer flex a-items-center j-content-center"
            onClick={onClose}
            aria-label="Close"
          >
            <AiOutlineClose className="sm:w-20 sm:h-20 w-16 h-16 color-#000000" />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto scroll-y px-8 sm:px-16 md:px-24">
        <div className="flex flex-col a-items-center text-center px-12 sm:px-32 py-28 sm:py-36">
          <div className="flex j-content-center a-items-center w-120 sm:w-154 h-120 sm:h-154 mb-24 sm:mb-32">
            <Image
              src={PERSONALIZATION_INTRO_IMAGE}
              alt="Body measurements illustration"
              type="icon"
              className="w-100p h-100p g|object-fit:contain"
            />
          </div>

          <h2 className="text-22 sm:text-24 md:text-36 weight-700 color-#000000 line-height-19 mb-12 sm:mb-16 md:mb-25">
            Know Before You Buy
          </h2>

          <p className="text-13 sm:text-14 weight-500 color-#757575 line-height-19 max-w-509 mb-28 sm:mb-32">
            Add your body measurements once and we&apos;ll instantly tell you
            how every piece on Asoebi Africa will fit your unique body.
          </p>

          <Button
            type="button"
            onClick={onContinue}
            className="w-full! max-w-725 radius-6 py-12 px-16 sm:px-20 text-14 sm:text-16 weight-500 hover:bg-darkgreen g|transition:background-color|_|0.3s g|transition-timing-function:ease"
          >
            Add my measurements
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationIntroStep;
