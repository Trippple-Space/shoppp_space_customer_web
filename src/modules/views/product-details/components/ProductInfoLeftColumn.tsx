import { Product, ProductVariant } from '@/modules/lib/utility/types/product.interface';
import { formatNumberAsPrice } from '@/modules/lib/utility/utility';
import {
  getStrikethroughAmounts,
  StackedDisplayPrices,
} from '@/modules/lib/utility/visible-discount';
import { Rating, Star } from '@smastrom/react-rating';
import { PiGlobeHemisphereEast, PiTruck } from 'react-icons/pi';
import MiniReview from '../reviews/MiniReview';
import SoldByStore from './SoldByStore';
import ProductVariationsPicker from './ProductVariationsPicker';
import { ReactNode, Dispatch, SetStateAction } from 'react';

interface ProductInfoLeftColumnProps {
  product: Product;
  variantDisplayPrices: StackedDisplayPrices;
  displayReviewStat: { averageRating: number; totalReviews: number };
  displayReviews: any[];
  statsLoading: boolean;
  selectedVariant: ProductVariant | undefined;
  isOpen: string | null;
  setIsOpen: Dispatch<SetStateAction<string | null>>;
  isAuthenticated: boolean;
  isLoginModal: () => void;
  setIsReviewModalOpen: (value: boolean) => void;
  storeUrl: string;
  allPropertiesWithSize: Record<string, string[]>;
  colorMap: Record<string, string>;
  activeFilters: Record<string, string>;
  isOptionCompatible: (prop: string, value: string) => boolean;
  toggleFilter: (key: string, value: string) => void;
  configurationRecords: any[];
  configurationValues: Record<string, any>;
  handleConfigChange: (key: string, value: any) => void;
  selectedVariantItemInCart: { userConfigurations?: any } | undefined;
  isEditingConfiguration: boolean;
  setIsEditingConfiguration: (value: boolean) => void;
  addToCartSection: ReactNode;
  showLongDescElipsis: (desc: string) => string;
  descriptionLength: number;
  maxDisplayDescLength: number;
  showFullDescription: boolean;
  setShowFullDescription: (value: boolean | ((prev: boolean) => boolean)) => void;
}

const ProductInfoLeftColumn = ({
  product,
  variantDisplayPrices,
  displayReviewStat,
  displayReviews,
  statsLoading,
  selectedVariant,
  isOpen,
  setIsOpen,
  isAuthenticated,
  isLoginModal,
  setIsReviewModalOpen,
  storeUrl,
  allPropertiesWithSize,
  colorMap,
  activeFilters,
  isOptionCompatible,
  toggleFilter,
  configurationRecords,
  configurationValues,
  handleConfigChange,
  selectedVariantItemInCart,
  isEditingConfiguration,
  setIsEditingConfiguration,
  addToCartSection,
  showLongDescElipsis,
  descriptionLength,
  maxDisplayDescLength,
  showFullDescription,
  setShowFullDescription,
}: ProductInfoLeftColumnProps) => {
  return (
    <div className="l:w-40p flex flex-col gap-12">
      <div className="flex flex-col gap-12 border-b  border-#00000014 pb-15">
        <p className="weight-500 text-20">{product.name}</p>
      </div>
      <div className="flex flex-col gap-16 border-b border-#00000014 pb-15">
        <div className='flex flex-col gap-8'>
          <p className="weight-400 md:text-32 text-28">
            {formatNumberAsPrice(variantDisplayPrices.displayPrice)}
          </p>
          {variantDisplayPrices.hasSlash && (
            <div className="flex flex-wrap gap-8 a-items-center">
              {getStrikethroughAmounts(variantDisplayPrices).map(
                (amount, idx) => (
                  <p
                    key={idx}
                    className="weight-400 text-16 color-#00000099 line-through"
                  >
                    {formatNumberAsPrice(amount)}
                  </p>
                )
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col l:flex-row l:a-items-center l:j-content-between gap-12 w-100p">
          <div className="flex a-items-center gap-12">
            <div className="flex gap-8 a-items-center">
              <Rating
                style={{
                  maxWidth: 130,
                  maxHeight: 130,
                  display: 'flex',
                  gap: '8px',
                }}
                value={displayReviewStat.averageRating}
                itemStyles={{
                  itemShapes: Star,
                  activeFillColor: '#f59e0b',
                  inactiveFillColor: '#0000000F',
                }}
                readOnly
              />
              <span className="weight-500 text-14">
                {displayReviewStat.averageRating.toFixed(1)}
              </span>
            </div>
            <span className="color-" style={{ color: '#D9D9D9B2' }}>
              |
            </span>
            <div className="color-#000000B2 text-12 flex a-items-center gap-5">
              <MiniReview
                id={selectedVariant?.id ?? ''}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                reviews={displayReviews}
                reviewStat={displayReviewStat}
                loading={statsLoading}
                slug={product.slug}
              /* color={selectedColor} */
              />
            </div>
          </div>

          <div className="flex">
            <span
              className="color-#1677FF text-12 border-b cursor-pointer"
              onClick={() => {
                isAuthenticated
                  ? setIsReviewModalOpen(true)
                  : isLoginModal();
              }}
            >
              Rate this product
            </span>
          </div>
        </div>
      </div>

      <SoldByStore product={product} storeUrl={storeUrl} variant="desktop-hidden" />

      <ProductVariationsPicker
        layout="mobile"
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
        productId={product?.id}
        productName={product?.name}
        fitSizeChart={product?.fitSizeChart}
      />

      <SoldByStore product={product} storeUrl={storeUrl} variant="mobile" />

      <div className="flex flex-col gap-12 border-b  border-#00000014 pb-15 pt-15">
        <p className="text-16 ">{product.shortDescription}</p>
      </div>
      <div className="flex flex-col gap-30 border-b  border-#00000014 pb-15 pt-15">
        <div className="flex gap-12">
          <PiTruck className="w-32 h-32" />
          <div className="flex flex-col gap-2">
            <p className="weight-500 text-16">Delivery Within Lagos</p>
            <p className="text-14 color-#00000099">
              Receive your product within 24 -72 hours after payment
              confirmation.
            </p>
          </div>
        </div>
        <div className="flex gap-12 a-items-center relative">
          <div
            className="flex gap-12 a-items-center"
            style={{ filter: 'blur(1px)' }}
          >
            <PiGlobeHemisphereEast className="w-32 h-32" />
            <div className="flex flex-col gap-2">
              <p className="weight-500 text-16">Delivery Outside Lagos</p>
              <p className="text-14 color-#00000099">
                Receive your product within 1-3 days after payment
                confirmation.
              </p>
            </div>
          </div>

          <button className="absolute border-none r-0 text-#D4280C bg-#FFDBD6 py-4 px-12 radius-4">
            Coming soon
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-12 border-b  border-#00000014 pb-15 pt-15">
        <p className="weight-500 text-16">Product Description</p>
        <p style={{ whiteSpace: 'pre-line' }}>
          {showLongDescElipsis(product.longDescription)}
          {descriptionLength > maxDisplayDescLength ? (
            <span onClick={() => setShowFullDescription((prev) => !prev)}>
              {!showFullDescription && '...'}
              <span
                className="color-#1677FF border-b cursor-pointer"
                style={{ fontStyle: 'italic' }}
              >
                {' '}
                {showFullDescription ? 'show less' : 'show more'}
              </span>
            </span>
          ) : (
            ''
          )}
        </p>
      </div>
      <div className="flex flex-col gap-12  border-b  border-#00000014 pb-30 pt-15">
        <p className="weight-500 text-16">Specifications</p>
        <div>
          <div
            className="w-full  flex a-items-center"
            style={{ border: '0.5px solid #00000014' }}
          >
            <div className="w-40p py-10 text-14 px-14 bg-#F5F5F5">
              Type
            </div>
            <div className="w-60p pl-10 capitalize">{product.type}</div>
          </div>
          <div
            className="w-full  flex a-items-center"
            style={{ border: '0.5px solid #00000014' }}
          >
            <div className="w-40p py-10 mt-2 text-14 px-14 bg-#F5F5F5">
              Material
            </div>
            <div className="w-60p pl-10 capitalize">
              {product?.meta?.material || ''}
            </div>
          </div>
          <div
            className="w-full flex a-items-center"
            style={{ border: '0.5px solid #00000014' }}
          >
            <div className="w-40p py-10 mt-2 text-14 px-14 bg-#F5F5F5">
              Brand name
            </div>
            <div className="w-60p pl-10 capitalize">
              {product?.meta?.origin || ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoLeftColumn;
