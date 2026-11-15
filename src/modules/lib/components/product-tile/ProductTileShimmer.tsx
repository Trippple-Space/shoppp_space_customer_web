'use client';

import React, { FC } from 'react';

const ProductTileShimmer: FC<{ isStoreBased?: boolean; horizontalScroll?: boolean }> = ({
  isStoreBased = false,
  horizontalScroll = true,
}) => {
  return (
    <div
      className={`${horizontalScroll ? 'lg:w-[290px] md:w-[250px] sm:w-[220px] w-[150px] shrink-0' : 'w-full'} flex flex-col gap-[12px]`}
    >
      <div
        className="aspect-square rounded-[10px] lg:rounded-[15px] overflow-hidden w-full pulsing-multi-color-bg"
        aria-hidden
      />
      <div className="flex gap-[4px] lg:mt-[16px] mt-[14px]">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="lg:w-[35.2px] lg:h-[35.2px] w-[31px] h-[31px] rounded-[4px] pulsing-multi-color-bg shrink-0"
            aria-hidden
          />
        ))}
      </div>
      <div className="md:mt-[16px] mt-[20px] h-[20px] w-full max-w-[180px] pulsing-multi-color-bg rounded-[4px]" aria-hidden />
      {
        !isStoreBased ? (<div className="h-[24px] w-full max-w-[120px] pulsing-multi-color-bg rounded-[4px]" aria-hidden />) : null
      }
      <div className="h-[24px] w-[80px] pulsing-multi-color-bg rounded-[4px]" aria-hidden />
    </div>
  );
};

export default ProductTileShimmer;
