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
      className={`shrink-0 bg-white border-t border-[#00000014] px-[16px] ${showQuantity ? 'pt-[14px] pb-[24px]' : 'py-[14px]'}`}
    >
      {isAddingToCart || !selectedVariantItemInCart ? (
        <button
          className={classNames(
            'w-full font-roboto border-hidden py-[16px] px-[20px] rounded-[8px] text-[16px] font-medium flex items-center justify-center',
            {
              'bg-[#F3F3F3] color-gray cursor-not-allowed':
                !canAdd && !isAddingToCart,
              'bg-[#0357EE] text-white': canAdd || isAddingToCart,
              'hover:bg-brand-hover cursor-pointer': canAdd && !isAddingToCart,
              'pointer-events-none': isAddingToCart,
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
        <div className="flex items-end justify-between gap-[12px]">
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
            className="flex items-center gap-[4px] text-[12px] sm:text-[13px] font-medium text-[#0357EE] shrink-0 underline"
          >
            <span className="">Head to checkout</span>
            <GoArrowRight className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductDetailModalFooter;
