'use client';

import { IoSparkles } from 'react-icons/io5';

const ProductFitRecommendationLoading = () => {
  return (
    <div className="flex flex-col gap-8">
      <p className="text-12 weight-400 color-#000000B2">
        Your Fit Recommendation
      </p>

      <div className="border-solid border-1 border-#0B9378 radius-12 bg-#0B93780D p-16 sm:p-20 flex flex-col gap-16 overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none g|background:linear-gradient|_90deg|_transparent|_0%|_rgba(11,147,120,0.12)|_50%|_transparent|_100% g|background-size:200%|_100% animate-pulse opacity-60" />

        <div className="flex a-items-start gap-10 relative z-1">
          <IoSparkles className="w-28 h-28 flex-shrink-0 color-#0B9378 animate-pulse" />
          <div className="flex flex-col gap-6 min-w-0">
            <div className="flex flex-wrap a-items-center gap-8">
              <p className="text-12 weight-600 color-#0B9378">
                Fit Oracle is thinking…
              </p>
              <span className="text-10 weight-600 px-8 py-1 radius-3 bg-#0B937826 color-#0B9378">
                AI
              </span>
            </div>
            <p className="text-10 weight-400 color-#00000099">
              Matching your measurements to this product&apos;s size chart
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-10 relative z-1">
          <div className="h-14 radius-8 bg-#0B93781F animate-pulse w-70p" />
          <div className="h-10 radius-8 bg-#0B937814 animate-pulse w-90p" />
          <div className="h-10 radius-8 bg-#0B937814 animate-pulse w-55p" />
          <div className="flex gap-10 mt-4">
            <div className="h-72 flex-1 radius-10 bg-#0B93781A animate-pulse" />
            <div className="h-72 flex-1 radius-10 bg-#0B93781A animate-pulse" />
            <div className="h-72 flex-1 radius-10 bg-#0B93781A animate-pulse hidden sm:block" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFitRecommendationLoading;
