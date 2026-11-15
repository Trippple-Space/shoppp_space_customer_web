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
    <div className="lg:w-[40%] flex flex-col gap-[12px]">
      <div className="flex flex-col gap-[12px] border-b  border-[#00000014] pb-[15px]">
        <p className="font-medium text-[20px]">{product.name}</p>
      </div>
      <div className="flex flex-col gap-[16px] border-b border-[#00000014] pb-[15px]">
        <div className='flex flex-col gap-[8px]'>
          <p className="font-normal md:text-[32px] text-[28px]">
            {formatNumberAsPrice(variantDisplayPrices.displayPrice)}
          </p>
          {variantDisplayPrices.hasSlash && (
            <div className="flex flex-wrap gap-[8px] items-center">
              {getStrikethroughAmounts(variantDisplayPrices).map(
                (amount, idx) => (
                  <p
                    key={idx}
                    className="font-normal text-[16px] text-[#00000099] line-through"
                  >
                    {formatNumberAsPrice(amount)}
                  </p>
                )
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-[12px] w-full">
          <div className="flex items-center gap-[12px]">
            <div className="flex gap-[8px] items-center">
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
              <span className="font-medium text-[14px]">
                {displayReviewStat.averageRating.toFixed(1)}
              </span>
            </div>
            <span className="color-" style={{ color: '#D9D9D9B2' }}>
              |
            </span>
            <div className="text-[#000000B2] text-[12px] flex items-center gap-[5px]">
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
              className="text-[#1677FF] text-[12px] border-b cursor-pointer"
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
      />

      <SoldByStore product={product} storeUrl={storeUrl} variant="mobile" />

      <div className="flex flex-col gap-[12px] border-b  border-[#00000014] pb-[15px] pt-[15px]">
        <p className="text-[16px] ">{product.shortDescription}</p>
      </div>
      <div className="flex flex-col gap-[30px] border-b  border-[#00000014] pb-[15px] pt-[15px]">
        <div className="flex gap-[12px]">
          <PiTruck className="w-[32px] h-[32px]" />
          <div className="flex flex-col gap-[2px]">
            <p className="font-medium text-[16px]">Delivery Within Lagos</p>
            <p className="text-[14px] text-[#00000099]">
              Receive your product within 24 -72 hours after payment
              confirmation.
            </p>
          </div>
        </div>
        <div className="flex gap-[12px] items-center relative">
          <div
            className="flex gap-[12px] items-center"
            style={{ filter: 'blur(1px)' }}
          >
            <PiGlobeHemisphereEast className="w-[32px] h-[32px]" />
            <div className="flex flex-col gap-[2px]">
              <p className="font-medium text-[16px]">Delivery Outside Lagos</p>
              <p className="text-[14px] text-[#00000099]">
                Receive your product within 1-3 days after payment
                confirmation.
              </p>
            </div>
          </div>

          <button className="absolute border-none right-0 text-[#D4280C] bg-[#FFDBD6] py-[4px] px-[12px] rounded-[4px]">
            Coming soon
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-[12px] border-b  border-[#00000014] pb-[15px] pt-[15px]">
        <p className="font-medium text-[16px]">Product Description</p>
        <p style={{ whiteSpace: 'pre-line' }}>
          {showLongDescElipsis(product.longDescription)}
          {descriptionLength > maxDisplayDescLength ? (
            <span onClick={() => setShowFullDescription((prev) => !prev)}>
              {!showFullDescription && '...'}
              <span
                className="text-[#1677FF] border-b cursor-pointer"
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
      <div className="flex flex-col gap-[12px]  border-b  border-[#00000014] pb-[30px] pt-[15px]">
        <p className="font-medium text-[16px]">Specifications</p>
        <div>
          <div
            className="w-full  flex items-center"
            style={{ border: '0.5px solid #00000014' }}
          >
            <div className="w-[40%] py-[10px] text-[14px] px-[14px] bg-[#F5F5F5]">
              Type
            </div>
            <div className="w-[60%] pl-[10px] capitalize">{product.type}</div>
          </div>
          <div
            className="w-full  flex items-center"
            style={{ border: '0.5px solid #00000014' }}
          >
            <div className="w-[40%] py-[10px] mt-[2px] text-[14px] px-[14px] bg-[#F5F5F5]">
              Material
            </div>
            <div className="w-[60%] pl-[10px] capitalize">
              {product?.meta?.material || ''}
            </div>
          </div>
          <div
            className="w-full flex items-center"
            style={{ border: '0.5px solid #00000014' }}
          >
            <div className="w-[40%] py-[10px] mt-[2px] text-[14px] px-[14px] bg-[#F5F5F5]">
              Brand name
            </div>
            <div className="w-[60%] pl-[10px] capitalize">
              {product?.meta?.origin || ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoLeftColumn;
