import React from 'react';

const ProductTileConfigPills = ({
  visibleConfigPills,
}: {
  visibleConfigPills: any[];
}) => {
  if (visibleConfigPills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-6 w-fit h-fit">
      {visibleConfigPills.map((pill, index) => (
        <div
          key={`${pill.source}-${index}-${pill.text}`}
          className="mt-16 whitespace-nowrap w-fit h-20 radius-20 flex a-items-center j-content-center px-10 py-15"
          style={{
            backgroundColor: pill.pillBackground,
            color: pill.pillColor,
          }}
        >
          <p className="text-10 l:text-12">{pill.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductTileConfigPills;
