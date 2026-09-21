'use client';

import { IoWarningOutline } from 'react-icons/io5';

interface ProductFitRecommendationErrorProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

const ProductFitRecommendationError = ({
  onRetry,
  isRetrying = false,
}: ProductFitRecommendationErrorProps) => {
  return (
    <div className="flex flex-col gap-8">
      <p className="text-12 weight-400 color-#000000B2">
        Your Fit Recommendation
      </p>

      <div className="border-solid border-1 border-#FEC107 radius-12 bg-#FFBF000A p-16 sm:p-20 flex flex-col gap-14">
        <div className="flex a-items-start gap-10">
          <IoWarningOutline className="w-24 h-24 flex-shrink-0 color-#FEC107" />
          <div className="flex flex-col gap-6 min-w-0">
            <p className="text-13 weight-600 color-#333333">
              Couldn&apos;t load your fit recommendation
            </p>
            <p className="text-11 weight-400 color-#00000099">
              Something went wrong while checking this product against your
              measurements. Try again in a moment.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="w-fit border-none radius-6 bg-#FACE33 color-#775B08 text-12 weight-600 py-8 px-20 cursor-pointer hover:bg-yellow disabled:opacity-60"
        >
          {isRetrying ? 'Retrying…' : 'Retry recommendation'}
        </button>
      </div>
    </div>
  );
};

export default ProductFitRecommendationError;
