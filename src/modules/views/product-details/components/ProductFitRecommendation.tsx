'use client';

import { PiRuler } from 'react-icons/pi';

interface ProductFitRecommendationProps {
  onSetup: () => void;
}

const ProductFitRecommendation = ({ onSetup }: ProductFitRecommendationProps) => {
  return (
    <div className="flex flex-col gap-7">
      <p className="text-12 weight-400 color-#000000B2">
        Your Fit Recommendation
      </p>

      <div className="border-solid border-1 border-#0B9378 radius-6 bg-#0B93780D p-12 sm:p-16 flex gap-12 a-items-start">
        <div className="w-34 h-32.62 flex-shrink-0 flex a-items-center j-content-center bg-white border-solid border-1 border-#0B9378 bg-#0B93781A radius-4">
          <PiRuler className="w-16.63 h-16.63 color-#0B9378" />
        </div>

        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-6 min-w-0">
            <p className="text-12 weight-700 color-#0B9378 line-height-18">
              Set up your fit profile
            </p>
            <p className="text-10 weight-400 color-#000000B2 line-height-16">
              Tell us your measurements once — we&apos;ll tell you exactly how
              every piece fits your body.
            </p>
          </div>
          <button
            type="button"
            onClick={onSetup}
            className="w-fit border-none radius-6 bg-#0B9378 color-white text-12 sm:text-13 weight-500 py-8 px-44 cursor-pointer hover:bg-darkgreen g|transition:background-color|_|0.3s g|transition-timing-function:ease"
          >
            Set up
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFitRecommendation;
