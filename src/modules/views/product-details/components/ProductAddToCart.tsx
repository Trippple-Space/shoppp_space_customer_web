import QuantitySelector from '@/modules/lib/components/quantity-selector/QuantitySelector';
import {
  buildUserConfigurations,
} from '@/modules/lib/components/product-detail-modal/productConfigurationsHelper';
import { Product, ProductVariant } from '@/modules/lib/utility/types/product.interface';
import { CartItem } from '@/modules/lib/utility/types/cart.interface';
import { useCartStore } from '@/modules/lib/utility/store/cart.store';
import {
  formatNumberAsPrice,
  formatStockUnitSuffix,
  handleFlyToCart,
} from '@/modules/lib/utility/utility';
import {
  getStrikethroughAmounts,
  StackedDisplayPrices,
} from '@/modules/lib/utility/visible-discount';
import classNames from 'classnames';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { RefObject, ReactNode } from 'react';
import SpinLoader from '@/modules/lib/components/spin-loader/SpinLoader';

type AddToCart = ReturnType<typeof useCartStore.getState>['addToCart'];

interface ProductAddToCartProps {
  variantDisplayPrices: StackedDisplayPrices;
  selectedVariant: ProductVariant | undefined;
  missingRequiredOptions: string[];
  initialMissingOptions: string[];
  hasPendingImageUploads: boolean;
  selectedVariantItemInCart: CartItem | undefined;
  isOutOfStock: boolean;
  areRequiredCustomerFieldsFilled: boolean;
  configurationValues: Record<string, any>;
  configurationRecords: any[];
  product: Product;
  orders: { length: number };
  cart: { cartItems: CartItem[] };
  imgRef: RefObject<HTMLImageElement>;
  addToCart: AddToCart;
  increment: (item: CartItem) => void;
  decrement: (item: CartItem) => void;
  isAddingToCart: boolean;
  isRemovingFromCart: boolean;
  fitRecommendationSection?: ReactNode;
}

const ProductAddToCart = ({
  variantDisplayPrices,
  selectedVariant,
  missingRequiredOptions,
  initialMissingOptions,
  hasPendingImageUploads,
  selectedVariantItemInCart,
  isOutOfStock,
  areRequiredCustomerFieldsFilled,
  configurationValues,
  configurationRecords,
  product,
  orders,
  cart,
  imgRef,
  addToCart,
  increment,
  decrement,
  isAddingToCart,
  isRemovingFromCart,
  fitRecommendationSection,
}: ProductAddToCartProps) => {
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="lg:flex flex-row flex-wrap items-end gap-[8px] hidden">
        <p className="text-[24px] font-semibold">
          {formatNumberAsPrice(variantDisplayPrices.displayPrice)}
        </p>
        {variantDisplayPrices.hasSlash && (
          <div className="flex flex-wrap gap-[8px] items-center mb-[2px]">
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
        {(() => {
          const stockUnitSuffix = formatStockUnitSuffix(
            selectedVariant?.stockUnit
          );
          return stockUnitSuffix ? (
            <p className="text-[10px] font-normal md:leading-[20px] leading-[12.1px] md:mb-0 mb-[2px]">
              {stockUnitSuffix}
            </p>
          ) : null;
        })()}
      </div>

      {!selectedVariant &&
        (missingRequiredOptions.length > 0 ||
          initialMissingOptions.length > 0) && (
          <div className="flex flex-col gap-[6px] p-[10px] rounded-[6px] bg-[#FFF7E6] border border-[#FFD699]">
            <p className="text-[12px] font-normal text-[#8A5A00]">
              Please select the following to continue:
            </p>

            <div className="flex flex-wrap gap-[6px]">
              {(missingRequiredOptions.length > 0
                ? missingRequiredOptions
                : initialMissingOptions
              ).map((option) => (
                <span
                  key={option}
                  className="px-[8px] py-[4px] rounded-[99px] bg-[#FFD699] text-[11px] font-medium capitalize"
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
        )}

      {hasPendingImageUploads && (
        <p className="text-[12px] font-medium text-[#A66A00]">
          Tap “Upload” under each attached image to upload it before adding
          to cart.
        </p>
      )}

      {fitRecommendationSection}

      {(!selectedVariantItemInCart || isAddingToCart) ? (
        <button
          className={classNames(
            `text-white border-none lg:px-[24px] lg:py-[12px] py-[15px] w-full rounded-[6px] flex items-center justify-center`,
            {
              'bg-gray-300 cursor-not-allowed':
                !isAddingToCart &&
                (!selectedVariant ||
                  isOutOfStock ||
                  !areRequiredCustomerFieldsFilled ||
                  hasPendingImageUploads),
              'bg-[#0357EE]':
                isAddingToCart ||
                (selectedVariant &&
                  !isOutOfStock &&
                  areRequiredCustomerFieldsFilled &&
                  !hasPendingImageUploads),
              'hover:bg-brand-hover cursor-pointer':
                !isAddingToCart &&
                selectedVariant &&
                !isOutOfStock &&
                areRequiredCustomerFieldsFilled &&
                !hasPendingImageUploads,
              'pointer-events-none': isAddingToCart,
            }
          )}
          disabled={
            !isAddingToCart &&
            (!selectedVariant ||
              isOutOfStock ||
              !areRequiredCustomerFieldsFilled ||
              hasPendingImageUploads)
          }
          onClick={() => {
            if (isAddingToCart) return;
            if (orders.length == 0 && cart.cartItems.length == 0) {
              handleFlyToCart(imgRef);
            }
            if (
              selectedVariant &&
              selectedVariant.status !== 'OUT_OF_STOCK' &&
              areRequiredCustomerFieldsFilled
            ) {
              const configs = buildUserConfigurations(
                configurationValues,
                configurationRecords
              );
              addToCart(
                selectedVariant?.id ?? 0,
                selectedVariant?.minPurchaseQuantity || 1,
                configs,
                selectedVariant
                  ? {
                    ...selectedVariant,
                    product: selectedVariant.product ?? product,
                  }
                  : undefined
              );
            }
          }}
        >
          {isAddingToCart ? (
            <SpinLoader
              size={20}
              color="#ffffff"
              trackColor="rgba(255,255,255,0.35)"
              thickness={3}
            />
          ) : (
            <div className="lg:flex grid grid-cols-2 gap-[10px] items-center w-fit mx-auto ">
              {selectedVariant &&
                areRequiredCustomerFieldsFilled && 
                selectedVariant?.status !== 'OUT_OF_STOCK' && 
                !hasPendingImageUploads && (
                  <HiOutlineShoppingBag className="h-[21px]" />
                )}
              <div
                className={classNames(
                  `whitespace-nowrap text-[16px] ${selectedVariant && areRequiredCustomerFieldsFilled && !hasPendingImageUploads ? (isOutOfStock ? 'text-black' : 'text-white') : 'color-gray'}`
                )}
              >
                {!selectedVariant
                  ? 'Add to cart'
                  : isOutOfStock
                    ? 'Out of stock'
                    : 'Add to cart'}
              </div>
            </div>
          )}
        </button>
      ) : (
        <QuantitySelector
          disabled={hasPendingImageUploads}
          busy={isRemovingFromCart}
          decrement={() => {
            if (hasPendingImageUploads || isRemovingFromCart) return;
            decrement(selectedVariantItemInCart);
          }}
          increment={() => {
            if (hasPendingImageUploads || isRemovingFromCart) return;
            increment(selectedVariantItemInCart);
          }}
          cartItem={selectedVariantItemInCart}
        />
      )}
    </div>
  );
};

export default ProductAddToCart;
