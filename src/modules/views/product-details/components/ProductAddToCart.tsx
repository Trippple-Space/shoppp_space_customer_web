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
    <div className="flex flex-col gap-16">
      <div className="l:flex flex-row flex-wrap a-items-end gap-8 hidden">
        <p className="text-24 weight-600">
          {formatNumberAsPrice(variantDisplayPrices.displayPrice)}
        </p>
        {variantDisplayPrices.hasSlash && (
          <div className="flex flex-wrap gap-8 a-items-center mb-2">
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
        {(() => {
          const stockUnitSuffix = formatStockUnitSuffix(
            selectedVariant?.stockUnit
          );
          return stockUnitSuffix ? (
            <p className="text-10 weight-400 md:line-height-20 line-height-12.1 md:mb-0 mb-2">
              {stockUnitSuffix}
            </p>
          ) : null;
        })()}
      </div>

      {!selectedVariant &&
        (missingRequiredOptions.length > 0 ||
          initialMissingOptions.length > 0) && (
          <div className="flex flex-col gap-6 p-10 radius-6 bg-#FFF7E6 border border-#FFD699">
            <p className="text-12 weight-400 color-#8A5A00">
              Please select the following to continue:
            </p>

            <div className="flex flex-wrap gap-6">
              {(missingRequiredOptions.length > 0
                ? missingRequiredOptions
                : initialMissingOptions
              ).map((option) => (
                <span
                  key={option}
                  className="px-8 py-4 radius-99 bg-#FFD699 text-11 weight-500 capitalize"
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
        )}

      {hasPendingImageUploads && (
        <p className="text-12 weight-500 color-#A66A00">
          Tap “Upload” under each attached image to upload it before adding
          to cart.
        </p>
      )}

      {fitRecommendationSection}

      {(!selectedVariantItemInCart || isAddingToCart) ? (
        <button
          className={classNames(
            `text-white border-none l:px-24 l:py-12 py-15 w-100p radius-6 flex a-items-center j-content-center`,
            {
              'bg-gray-300 cursor-not-allowed':
                !isAddingToCart &&
                (!selectedVariant ||
                  isOutOfStock ||
                  !areRequiredCustomerFieldsFilled ||
                  hasPendingImageUploads),
              'bg-#0B9378':
                isAddingToCart ||
                (selectedVariant &&
                  !isOutOfStock &&
                  areRequiredCustomerFieldsFilled &&
                  !hasPendingImageUploads),
              'hover:bg-darkgreen pointer':
                !isAddingToCart &&
                selectedVariant &&
                !isOutOfStock &&
                areRequiredCustomerFieldsFilled &&
                !hasPendingImageUploads,
              'g|pointer-events:none': isAddingToCart,
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
            <div className="l:flex grid grid-2-cols-auto gap-10 items-center w-fit mx-auto ">
              {selectedVariant &&
                areRequiredCustomerFieldsFilled && 
                selectedVariant?.status !== 'OUT_OF_STOCK' && 
                !hasPendingImageUploads && (
                  <HiOutlineShoppingBag className="h-21" />
                )}
              <div
                className={classNames(
                  `whitespace-nowrap text-16 ${selectedVariant && areRequiredCustomerFieldsFilled && !hasPendingImageUploads ? (isOutOfStock ? 'text-black' : 'text-white') : 'color-gray'}`
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
