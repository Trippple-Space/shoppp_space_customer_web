import React from 'react';
import { createPortal } from 'react-dom';
import {
  ProductDetailModalProp,
  useProductDetailModal,
} from './useProductDetailModal';
import ProductDetailModalHeader from './components/ProductDetailModalHeader';
import ProductDetailModalGallery from './components/ProductDetailModalGallery';
import ProductDetailModalInfo from './components/ProductDetailModalInfo';
import ProductDetailModalOptions from './components/ProductDetailModalOptions';
import ProductDetailModalFooter from './components/ProductDetailModalFooter';

const ProductDetailModal = ({
  product,
  variant,
  handleCloseProductModal,
  openSingleProductModal,
  position,
  variantSelectedImage,
  modalZIndex = 10,
}: ProductDetailModalProp) => {
  const {
    selectedImage,
    selectedMediaType,
    configurationValues,
    isHover,
    setIsHover,
    isEditingConfiguration,
    setIsEditingConfiguration,
    imgRef,
    allPropertiesWithSize,
    selectedVariant,
    missingRequiredOptions,
    initialMissingOptions,
    selectedVariantItemInCart,
    uniqueVariantsFromProductImages,
    variantPreviewItems,
    carouselPreviewItems,
    variantDisplayPrices,
    descriptionLength,
    maxDisplayDescLength,
    colorMap,
    isOptionCompatible,
    toggleFilter,
    handlePreviousImage,
    handleNextImage,
    configurationRecords,
    handleConfigChange,
    areRequiredCustomerFieldsFilled,
    userConfigurations,
    hasPendingImageUploads,
    handleSelectPreview,
    handleAddToCart,
    increment,
    decrement,
    isAddingToCart,
    isRemovingFromCart,
    activeFilters,
  } = useProductDetailModal({
    product,
    variant,
    handleCloseProductModal,
    openSingleProductModal,
    position,
    variantSelectedImage,
    modalZIndex,
  });

  if (!openSingleProductModal) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-[#00000073] w-full h-full block"
        style={{ zIndex: modalZIndex }}
        onClick={handleCloseProductModal}
      >
        <div className="relative no-scrollbar w-full h-full flex flex-col justify-center items-center">
          <div
            className="fixed bg-white w-[94%] sm:w-[80%] lg:w-[65%] xl:w-1/2 max-w-[900px] rounded-[12px] overflow-hidden flex flex-col"
            style={{
              maxHeight: 'calc(100vh - 80px)',
              zIndex: modalZIndex + 10,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ProductDetailModalHeader
              product={product}
              onClose={handleCloseProductModal}
            />

            <div
              className="overflow-auto no-scrollbar grow"
              style={{ minHeight: 0 }}
            >
              <div className="lg:flex grid justify-center gap-[24px] sm:px-[24px] px-[16px] pt-[16px] pb-[24px]">
                <ProductDetailModalGallery
                  product={product}
                  selectedImage={selectedImage}
                  selectedMediaType={selectedMediaType}
                  selectedVariant={selectedVariant}
                  imgRef={imgRef}
                  isHover={isHover}
                  setIsHover={setIsHover}
                  position={position}
                  variantSelectedImage={variantSelectedImage}
                  carouselPreviewItems={carouselPreviewItems}
                  uniqueVariantsFromProductImages={uniqueVariantsFromProductImages}
                  variantPreviewItems={variantPreviewItems}
                  handlePreviousImage={handlePreviousImage}
                  handleNextImage={handleNextImage}
                  handleSelectPreview={handleSelectPreview}
                />

                <div className="lg:w-1/2 w-full">
                  <ProductDetailModalInfo
                    product={product}
                    selectedVariant={selectedVariant}
                    variantDisplayPrices={variantDisplayPrices}
                    descriptionLength={descriptionLength}
                    maxDisplayDescLength={maxDisplayDescLength}
                  />
                  <ProductDetailModalOptions
                    allPropertiesWithSize={allPropertiesWithSize}
                    colorMap={colorMap}
                    activeFilters={activeFilters}
                    isOptionCompatible={isOptionCompatible}
                    toggleFilter={toggleFilter}
                    selectedVariant={selectedVariant}
                    missingRequiredOptions={missingRequiredOptions}
                    initialMissingOptions={initialMissingOptions}
                    configurationRecords={configurationRecords}
                    configurationValues={configurationValues}
                    handleConfigChange={handleConfigChange}
                    selectedVariantItemInCart={selectedVariantItemInCart}
                    isEditingConfiguration={isEditingConfiguration}
                    onEditConfiguration={() => setIsEditingConfiguration(true)}
                    hasPendingImageUploads={hasPendingImageUploads}
                  />
                </div>
              </div>
            </div>

            <ProductDetailModalFooter
              selectedVariant={selectedVariant}
              selectedVariantItemInCart={selectedVariantItemInCart}
              areRequiredCustomerFieldsFilled={areRequiredCustomerFieldsFilled}
              hasPendingImageUploads={hasPendingImageUploads}
              userConfigurations={userConfigurations}
              handleAddToCart={handleAddToCart}
              increment={increment}
              decrement={decrement}
              isAddingToCart={isAddingToCart}
              isRemovingFromCart={isRemovingFromCart}
              onClose={handleCloseProductModal}
            />
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default ProductDetailModal;
