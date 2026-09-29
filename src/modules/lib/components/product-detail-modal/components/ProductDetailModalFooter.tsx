import classNames from 'classnames';
import Link from 'next/link';
import { GoArrowRight } from 'react-icons/go';
import QuantitySelector from '../../quantity-selector/QuantitySelector';
import SpinLoader from '../../spin-loader/SpinLoader';
import { ProductVariant } from '../../../utility/types/product.interface';
import { CartItem } from '../../../utility/types/cart.interface';
import { paths } from '../../../utility/paths';

const ProductDetailModalFooter = ({
  selectedVariant,
  selectedVariantItemInCart,
  areRequiredCustomerFieldsFilled,
  hasPendingImageUploads,
  userConfigurations,
  handleAddToCart,
  increment,
  decrement,
  isAddingToCart,
  isRemovingFromCart,
  onClose,
}: {
  selectedVariant?: ProductVariant;
  selectedVariantItemInCart?: CartItem;
  areRequiredCustomerFieldsFilled: boolean;
  hasPendingImageUploads: boolean;
  userConfigurations: any;
  handleAddToCart: () => void;
  increment: (item: CartItem, userConfigurations?: any) => void;
  decrement: (item: CartItem, userConfigurations?: any) => void;
  isAddingToCart: boolean;
  isRemovingFromCart: boolean;
  onClose: () => void;
}) => {
  const isOutOfStock = selectedVariant?.status === 'OUT_OF_STOCK';
  const canAdd =
    !!selectedVariant &&
    !isOutOfStock &&
    areRequiredCustomerFieldsFilled &&
    !hasPendingImageUploads;
  const showQuantity =
    !!selectedVariantItemInCart && !isAddingToCart;

  return (
    <div
      className={`flex-shrink-0 bg-white border-t border-#00000014 px-16 ${showQuantity ? 'pt-14 pb-24' : 'py-14'}`}
    >
      {isAddingToCart || !selectedVariantItemInCart ? (
        <button
          className={classNames(
            'w-full font-roboto border-hidden py-16 px-20 radius-8 text-16 weight-500 flex a-items-center j-content-center',
            {
              'bg-#F3F3F3 color-gray cursor-not-allowed':
                !canAdd && !isAddingToCart,
              'bg-#0B9378 color-white': canAdd || isAddingToCart,
              'hover:bg-darkgreen pointer': canAdd && !isAddingToCart,
              'g|pointer-events:none': isAddingToCart,
            }
          )}
          disabled={!canAdd && !isAddingToCart}
          onClick={handleAddToCart}
        >
          {isAddingToCart ? (
            <SpinLoader
              size={20}
              color="#ffffff"
              trackColor="rgba(255,255,255,0.35)"
              thickness={3}
            />
          ) : !selectedVariant ? (
            'Add to cart'
          ) : isOutOfStock ? (
            'Out of stock'
          ) : (
            'Add to cart'
          )}
        </button>
      ) : (
        <div className="flex a-items-end space-between gap-12">
          <QuantitySelector
            disabled={hasPendingImageUploads}
            busy={isRemovingFromCart}
            decrement={() => {
              if (hasPendingImageUploads || isRemovingFromCart) return;
              decrement(
                selectedVariantItemInCart,
                userConfigurations
              );
            }}
            increment={() => {
              if (hasPendingImageUploads || isRemovingFromCart) return;
              increment(
                selectedVariantItemInCart,
                userConfigurations
              );
            }}
            cartItem={selectedVariantItemInCart}
          />
          <Link
            href={paths.checkout}
            onClick={onClose}
            className="flex a-items-center gap-4 text-12 sm:text-13 weight-500 color-#0B9378 flex-shrink-0 underline"
          >
            <span className="">Head to checkout</span>
            <GoArrowRight className="w-14 h-14 sm:w-16 sm:h-16" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductDetailModalFooter;
