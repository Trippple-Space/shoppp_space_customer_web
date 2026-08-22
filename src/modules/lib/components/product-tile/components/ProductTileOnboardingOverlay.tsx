import React from 'react';

const ProductTileOnboardingOverlay = ({
  showOnBoardingModal,
  indexCount,
}: {
  showOnBoardingModal: boolean;
  indexCount: boolean;
}) => {
  if (!(showOnBoardingModal && indexCount)) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    ></div>
  );
};

export default ProductTileOnboardingOverlay;
