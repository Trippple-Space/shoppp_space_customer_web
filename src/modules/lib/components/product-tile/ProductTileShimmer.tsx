'use client';

import React, { FC } from 'react';

const ProductTileShimmer: FC = () => {
  return (
    <div className="l:w-290 md:w-250 sm:w-220 w-150 flex flex-col gap-12 flex-shrink-0">
      <div
        className="ratio-1 radius-10 l:radius-15 overflow-hidden w-full pulsing-multi-color-bg"
        aria-hidden
      />
      <div className="flex gap-4 l:mt-16 mt-14">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="l:w-35.2 l:h-35.2 w-31 h-31 radius-4 pulsing-multi-color-bg flex-shrink-0"
            aria-hidden
          />
        ))}
      </div>
      <div className="md:mt-16 mt-20 h-20 w-full max-w-180 pulsing-multi-color-bg radius-4" aria-hidden />
      <div className="h-24 w-full max-w-120 pulsing-multi-color-bg radius-4" aria-hidden />
      <div className="h-24 w-80 pulsing-multi-color-bg radius-4" aria-hidden />
    </div>
  );
};

export default ProductTileShimmer;
