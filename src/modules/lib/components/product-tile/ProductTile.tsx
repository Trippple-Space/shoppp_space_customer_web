'use client';
import React, { FC } from 'react';
import ProductDetailModal from '../product-detail-modal/ProductDetailModal';
import { IProductTile, useProductTile } from './useProductTile';
import ProductTileOnboardingOverlay from './components/ProductTileOnboardingOverlay';
import ProductTileImageSection from './components/ProductTileImageSection';
import ProductTileConfigPills from './components/ProductTileConfigPills';
import ProductTileVariantStrip from './components/ProductTileVariantStrip';
import ProductTileDetails from './components/ProductTileDetails';

const ProductTile: FC<IProductTile> = (props) => {
  const {
    product,
    storeUrl,
    variantPreviewItems,
    isCheckoutOrOrdersPage,
    onProductTileHover,
    setOnProductTileHover,
    openSingleProductModal,
    isToAddProperties,
    setIsToAddProperties,
    setRecentlyViewsId,
    activeIndex,
    catalogueGalleryOpen,
    setCatalogueGalleryOpen,
    galleryQuickLookVariant,
    galleryQuickLookImage,
    selectedVariant,
    selectedImage,
    rowRef,
    priceRef,
    chevronRef,
    tagsContainerRef,
    tagRefs,
    longPressTriggeredRef,
    isOverflowing,
    showAllTags,
    setShowAllTags,
    handleTagSelection,
    addToCart,
    increment,
    decrement,
    isAuthenticated,
    isLoginModal,
    imgRef,
    selectedVariantItemInCart,
    handlePreviewMediaSelect,
    visibleConfigPills,
    isSaved,
    handleSave,
    handleCloseProductModal,
    getCartItemForVariant,
    isSavedForVariant,
    handleToggleSaveVariant,
    handleGalleryOpenQuickLook,
    handleGalleryAddToCart,
    startLongPress,
    endLongPress,
    isOutOfStock,
    variantDisplayPrices,
    discountPill,
    hasProperties,
    shouldAddDirectlyToCart,
    hasCustomerConfiguration,
    variantNeedsQuickLook,
    visibleTags,
    isTagActive,
    visibleTagCount,
    showOnBoardingModal,
    setShowOnBoardingModal,
    indexCount,
    handleOnboardingClose,
    userConfigurations,
    addToCartVariant,
    isStoreBased,
    allReviews,
    isOpen,
    setIsOpen,
  } = useProductTile(props);

  return (
    <div className="mt-30 l:mt-20 w-full min-w-0 overflow-hidden">
      <ProductTileOnboardingOverlay
        showOnBoardingModal={showOnBoardingModal}
        indexCount={indexCount}
      />

      {/* IMAGE SECTION */}
      <ProductTileImageSection
        product={product}
        variantPreviewItems={variantPreviewItems}
        activeIndex={activeIndex}
        imgRef={imgRef}
        isOutOfStock={isOutOfStock}
        longPressTriggeredRef={longPressTriggeredRef}
        setOnProductTileHover={setOnProductTileHover}
        startLongPress={startLongPress}
        endLongPress={endLongPress}
        onProductTileHover={onProductTileHover}
        handleCloseProductModal={handleCloseProductModal}
        selectedVariant={selectedVariant}
        setRecentlyViewsId={setRecentlyViewsId}
        selectedVariantItemInCart={selectedVariantItemInCart}
        hasProperties={hasProperties}
        shouldAddDirectlyToCart={shouldAddDirectlyToCart}
        hasCustomerConfiguration={hasCustomerConfiguration}
        setIsToAddProperties={setIsToAddProperties}
        decrement={decrement}
        increment={increment}
        showOnBoardingModal={showOnBoardingModal}
        indexCount={indexCount}
        isCheckoutOrOrdersPage={isCheckoutOrOrdersPage}
        handleOnboardingClose={handleOnboardingClose}
        addToCartVariant={addToCartVariant}
        selectedImage={selectedImage}
        setShowOnBoardingModal={setShowOnBoardingModal}
        addToCart={addToCart}
        userConfigurations={userConfigurations}
        handleSave={handleSave}
        isSaved={isSaved}
        discountPill={discountPill}
      />

      {/* CONFIG PILLS */}
      <ProductTileConfigPills visibleConfigPills={visibleConfigPills} />

      <ProductTileVariantStrip
        product={product}
        variantPreviewItems={variantPreviewItems}
        isAuthenticated={isAuthenticated}
        onAuthRequired={isLoginModal}
        onGalleryOpenChange={setCatalogueGalleryOpen}
        isSavedForVariant={isSavedForVariant}
        onToggleSaveVariant={handleToggleSaveVariant}
        getCartItemForVariant={getCartItemForVariant}
        variantNeedsQuickLook={variantNeedsQuickLook}
        onGalleryAddToCart={handleGalleryAddToCart}
        onGalleryOpenQuickLook={handleGalleryOpenQuickLook}
        onIncrementCartItem={increment}
        onDecrementCartItem={decrement}
        selectedImage={selectedImage}
        handlePreviewMediaSelect={handlePreviewMediaSelect}
      />
      <ProductTileDetails
        product={product}
        isStoreBased={isStoreBased}
        storeUrl={storeUrl}
        rowRef={rowRef}
        priceRef={priceRef}
        variantDisplayPrices={variantDisplayPrices}
        selectedVariant={selectedVariant}
        visibleTags={visibleTags}
        tagRefs={tagRefs}
        visibleTagCount={visibleTagCount}
        tagsContainerRef={tagsContainerRef}
        isTagActive={isTagActive}
        handleTagSelection={handleTagSelection}
        isOverflowing={isOverflowing}
        chevronRef={chevronRef}
        showAllTags={showAllTags}
        setShowAllTags={setShowAllTags}
        allReviews={allReviews}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      {openSingleProductModal && (
        <ProductDetailModal
          openSingleProductModal={openSingleProductModal}
          handleCloseProductModal={handleCloseProductModal}
          position="homepage"
          modalZIndex={catalogueGalleryOpen ? 10050 : undefined}
          variantSelectedImage={
            galleryQuickLookImage ??
            (isToAddProperties ? selectedImage : '')
          }
          product={
            galleryQuickLookVariant?.product ??
            selectedVariant.product ??
            product
          }
          variant={
            galleryQuickLookVariant
              ? {
                  ...galleryQuickLookVariant,
                  product: galleryQuickLookVariant.product ?? product,
                }
              : isToAddProperties
                ? {
                    ...selectedVariant,
                    product,
                  }
                : undefined
          }
        />
      )}
    </div>
  );
};

export default ProductTile;
