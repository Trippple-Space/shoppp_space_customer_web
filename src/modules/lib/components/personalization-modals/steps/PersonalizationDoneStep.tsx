'use client';

import { PiSealCheck } from 'react-icons/pi';

const PersonalizationDoneStep = () => {
  return (
    <div
      className="flex flex-col a-items-center text-center w-full h-full"
      style={{ minHeight: 0 }}
    >
      <div className="flex-shrink-0 flex flex-col a-items-center w-full">
        <div className="flex j-content-center a-items-center mb-20 sm:mb-24 md:mb-28">
          <PiSealCheck
            className="w-64 md:w-84 h-72 sm:h-88 md:h-104 color-#0B9378"
            aria-hidden
          />
        </div>

        <h2 className="text-22 sm:text-24 md:text-36 weight-700 color-#000000 line-height-19 mb-12 sm:mb-14 md:mb-19">
          All Set
        </h2>

        <p className="text-13 sm:text-14 weight-500 color-#757575 line-height-19 max-w-361 px-8">
          Your measurements are saved. We&apos;re analysing how this cloth will
          fit your body right now.
        </p>
      </div>

      <div
        className="w-full flex-grow-1 bg-#F5F5F5 radius-12 mt-24 sm:mt-28 md:mt-32 min-h-120 sm:min-h-160"
        style={{ minHeight: 0 }}
        aria-hidden
      />
    </div>
  );
};

export default PersonalizationDoneStep;
