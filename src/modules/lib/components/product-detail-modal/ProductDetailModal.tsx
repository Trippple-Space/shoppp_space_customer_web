import React from 'react';
import { createPortal } from 'react-dom';
import ProductSizeChartModal from '@/modules/views/product-details/modals/ProductSizeChartModal';
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
    sizeChartOpen,
    setSizeChartOpen,
    resolvedSizeChart,
    showSizeChartLink,
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
        className="fixed inset-0 bg-#00000073 w-100p h-100p block"
        style={{ zIndex: modalZIndex }}
        onClick={handleCloseProductModal}
      >
        <div className="relative no-scrollbar w-full h-full flex flex-col j-content-center a-items-center">
          <div
            className="fixed bg-white w-94p sm:w-80p l:w-65p xl:w-50p max-w-900 radius-12 overflow-hidden flex flex-col"
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
              className="overflow-auto no-scrollbar flex-grow-1"
              style={{ minHeight: 0 }}
            >
              <div className="l:flex grid j-content-center gap-24 sm:px-24 px-16 pt-16 pb-24">
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

                <div className="l:w-50p w-full">
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
                    productId={product?.id}
                    showSizeChartLink={showSizeChartLink}
                    onOpenSizeChart={() => setSizeChartOpen(true)}
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
      {product?.id && showSizeChartLink && (
        <ProductSizeChartModal
          isOpen={sizeChartOpen}
          onClose={() => setSizeChartOpen(false)}
          productId={product.id}
          productName={product.name}
          fitSizeChart={resolvedSizeChart}
        />
      )}
    </>,
    document.body
  );
};

export default ProductDetailModal;
