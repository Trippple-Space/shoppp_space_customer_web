'use client';
import Footer from '@/modules/lib/components/footer/Footer';
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar';
import { Product } from '@/modules/lib/utility/types/product.interface';
import { cx } from '@/modules/lib/utility/utility';
import ShareProductModal from './share-modal/shareProductModal';
import ShowAllPhotosModal from './modals/ShowAllPhotosModal';
import LightboxModal from './modals/LightboxModal';
import ReviewModal from './modals/ReviewModal';
import { useProductDetails } from './useProductDetails';
import ProductDetailsHeader from './components/ProductDetailsHeader';
import ProductImageGallery from './components/ProductImageGallery';
import ProductCatalogueSection from './components/ProductCatalogueSection';
import ProductAddToCart from './components/ProductAddToCart';
import ProductInfoLeftColumn from './components/ProductInfoLeftColumn';
import ProductVariationsPicker from './components/ProductVariationsPicker';
import RecentlyViewedSection from './components/RecentlyViewedSection';
import CustomerReviewsSection from './components/CustomerReviewsSection';

const ProductDetails = ({ product }: { product: Product }) => {
  const {
    recentlyViewedVariants,
    showShareModal,
    setShowShareModal,
    showFullDescription,
    setShowFullDescription,
    showAllPhotos,
    setShowAllPhotos,
    isOpen,
    setIsOpen,
    isReviewModalOpen,
    setIsReviewModalOpen,
    showLightbox,
    setShowLightbox,
    lightboxIndex,
    setLightboxIndex,
    activeFilters,
    setActiveFilters,
    setForcedVariantId,
    selectedImage,
    setSelectedImage,
    setImageSource,
    configurationValues,
    isEditingConfiguration,
    setIsEditingConfiguration,
    imgRef,
    allPropertiesWithSize,
    selectedVariant,
    missingRequiredOptions,
    initialMissingOptions,
    uniqueVariantsFromProductImages,
    variantPreviewItems,
    allImages,
    uniqueImages,
    lightboxImages,
    saveVariant,
    savedVariants,
    removeSavedVariant,
    addToCart,
    cart,
    increment,
    decrement,
    isAddingToCart,
    isRemovingFromCart,
    isLoginModal,
    isAuthenticated,
    reviews,
    reviewsLoading,
    refreshReviews,
    statsLoading,
    refreshStats,
    orders,
    selectedVariantItemInCart,
    descriptionLength,
    maxDisplayDescLength,
    variantDisplayPrices,
    isOutOfStock,
    isOptionCompatible,
    toggleFilter,
    resetToDefault,
    colorMap,
    mediaType,
    showLongDescElipsis,
    isSaved,
    handleSave,
    displayReviews,
    displayReviewStat,
    configurationRecords,
    handleConfigChange,
    areRequiredCustomerFieldsFilled,
    hasPendingImageUploads,
    storeUrl,
    buildFiltersFromVariant,
  } = useProductDetails(product);

  const addToCartSection = (
    <ProductAddToCart
      variantDisplayPrices={variantDisplayPrices}
      selectedVariant={selectedVariant}
      missingRequiredOptions={missingRequiredOptions}
      initialMissingOptions={initialMissingOptions}
      hasPendingImageUploads={hasPendingImageUploads}
      selectedVariantItemInCart={selectedVariantItemInCart}
      isOutOfStock={isOutOfStock}
      areRequiredCustomerFieldsFilled={areRequiredCustomerFieldsFilled}
      configurationValues={configurationValues}
      configurationRecords={configurationRecords}
      product={product}
      orders={orders}
      cart={cart}
      imgRef={imgRef}
      addToCart={addToCart}
      increment={increment}
      decrement={decrement}
      isAddingToCart={isAddingToCart}
      isRemovingFromCart={isRemovingFromCart}
    />
  );

  return (
    <>
      <HomepageNavBar parent="" />
      <div className="sm:mt-[96px] mt-[88px] lg:max-w-[1400px] w-full mx-auto xl:px-[60px] md:px-[50px] sm:px-[40px] px-[24px]">
        <ProductDetailsHeader
          product={product}
          storeUrl={storeUrl}
          isSaved={isSaved}
          onShare={() => setShowShareModal(true)}
          onSave={handleSave}
        />

        <ProductImageGallery
          allImages={allImages}
          isOutOfStock={isOutOfStock}
          selectedImage={selectedImage}
          lightboxImages={lightboxImages}
          mediaType={mediaType}
          imgRef={imgRef}
          variantPreviewItems={variantPreviewItems}
          uniqueVariantsFromProductImages={uniqueVariantsFromProductImages}
          selectedVariant={selectedVariant}
          onShowAllPhotos={() => setShowAllPhotos((prev) => !prev)}
          onOpenLightbox={(index) => {
            setLightboxIndex(index);
            setShowLightbox(true);
          }}
          onPreviewSelect={({ variant, mediaUrl, filters }) => {
            setForcedVariantId(variant.id);
            setActiveFilters(filters);
            setSelectedImage(mediaUrl);
            setImageSource('preview');
          }}
          onResetToDefault={resetToDefault}
        />

        <ProductCatalogueSection
          product={product}
          lightboxImages={lightboxImages}
          onOpenLightbox={(index) => {
            setLightboxIndex(index);
            setShowLightbox(true);
          }}
        />

        <div
          className={cx('flex flex-col lg:flex-row lg:justify-between mt-[20px]')}
        >
          <ProductInfoLeftColumn
            product={product}
            variantDisplayPrices={variantDisplayPrices}
            displayReviewStat={displayReviewStat}
            displayReviews={displayReviews}
            statsLoading={statsLoading}
            selectedVariant={selectedVariant}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isAuthenticated={isAuthenticated}
            isLoginModal={isLoginModal}
            setIsReviewModalOpen={setIsReviewModalOpen}
            storeUrl={storeUrl}
            allPropertiesWithSize={allPropertiesWithSize}
            colorMap={colorMap}
            activeFilters={activeFilters}
            isOptionCompatible={isOptionCompatible}
            toggleFilter={toggleFilter}
            configurationRecords={configurationRecords}
            configurationValues={configurationValues}
            handleConfigChange={handleConfigChange}
            selectedVariantItemInCart={selectedVariantItemInCart}
            isEditingConfiguration={isEditingConfiguration}
            setIsEditingConfiguration={setIsEditingConfiguration}
            addToCartSection={addToCartSection}
            showLongDescElipsis={showLongDescElipsis}
            descriptionLength={descriptionLength}
            maxDisplayDescLength={maxDisplayDescLength}
            showFullDescription={showFullDescription}
            setShowFullDescription={setShowFullDescription}
          />

          <ProductVariationsPicker
            layout="desktop"
            allPropertiesWithSize={allPropertiesWithSize}
            colorMap={colorMap}
            activeFilters={activeFilters}
            isOptionCompatible={isOptionCompatible}
            toggleFilter={toggleFilter}
            configurationRecords={configurationRecords}
            configurationValues={configurationValues}
            handleConfigChange={handleConfigChange}
            selectedVariantItemInCart={selectedVariantItemInCart}
            isEditingConfiguration={isEditingConfiguration}
            onEditConfiguration={() => setIsEditingConfiguration(true)}
            selectedVariant={selectedVariant}
            addToCartSection={addToCartSection}
          />
        </div>

        <RecentlyViewedSection
          recentlyViewedVariants={recentlyViewedVariants}
          saveVariant={saveVariant}
          removeSavedVariant={removeSavedVariant}
          savedVariants={savedVariants}
        />

        <CustomerReviewsSection reviews={reviews} slug={product.slug} />
      </div>
      <ShareProductModal
        modalOpen={showShareModal}
        handleCloseModal={() => {
          setShowShareModal(false);
        }}
      />
      <ShowAllPhotosModal
        isOpen={showAllPhotos}
        onClose={() => setShowAllPhotos(false)}
        uniqueImages={uniqueImages}
        productVariants={product.variants}
        selectedImage={selectedImage}
        selectedVariant={selectedVariant}
        setActiveFilters={setActiveFilters}
        setSelectedImage={setSelectedImage}
        setImageSource={setImageSource}
        buildFiltersFromVariant={buildFiltersFromVariant}
        resetToDefault={resetToDefault}
      />
      <ReviewModal
        isOpen={isReviewModalOpen && !reviewsLoading && !statsLoading}
        onClose={() => setIsReviewModalOpen(false)}
        selectedVariantId={selectedVariant?.id ?? product.variants[0].id}
        refreshReviews={refreshReviews}
        refreshStats={refreshStats}
      />

      <LightboxModal
        showLightbox={showLightbox}
        setShowLightbox={setShowLightbox}
        lightboxIndex={lightboxIndex}
        setLightboxIndex={setLightboxIndex}
        lightboxImages={lightboxImages}
        isOutOfStock={isOutOfStock}
        imgRef={imgRef}
        isSaved={isSaved}
        handleSave={handleSave}
        isAuthenticated={isAuthenticated}
        isLoginModal={isLoginModal}
        setShowShareModal={setShowShareModal}
      />

      <Footer />
    </>
  );
};

export default ProductDetails;
