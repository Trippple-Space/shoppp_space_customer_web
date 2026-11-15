import React from 'react';

const ProductTileConfigPills = ({
  visibleConfigPills,
}: {
  visibleConfigPills: any[];
}) => {
  if (visibleConfigPills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-[6px] w-fit h-fit">
      {visibleConfigPills.map((pill, index) => (
        <div
          key={`${pill.source}-${index}-${pill.text}`}
          className="mt-[16px] whitespace-nowrap w-fit h-[20px] rounded-[20px] flex items-center justify-center px-[10px] py-[15px]"
          style={{
            backgroundColor: pill.pillBackground,
            color: pill.pillColor,
          }}
        >
          <p className="text-[10px] lg:text-[12px]">{pill.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductTileConfigPills;
