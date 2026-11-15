import React, { MutableRefObject } from 'react';
import classNames from 'classnames';
import { AiFillHeart } from 'react-icons/ai';
import { FaEye } from 'react-icons/fa6';
import { PiShoppingCartFill } from 'react-icons/pi';
import Link from 'next/link';
import QuantitySelector from '../../quantity-selector/QuantitySelector';
import SpinLoader from '../../spin-loader/SpinLoader';
import { ProductTileMediaCarousel } from '../ProductTileMediaCarousel';
import { Product, ProductVariant } from '../../../utility/types/product.interface';
import { CartItem } from '../../../utility/types/cart.interface';
import { VariantMediaPreviewItem } from '../../../utility/product-media';
import { SavedVariant } from '../../../utility/types/SavedVariant.interface';

type TilePill = {
  text: string;
  pillBackground: string;
  pillColor: string;
  source: string;
};

const ProductTileImageSection = ({
  product,
  variantPreviewItems,
  activeIndex,
  imgRef,
  isOutOfStock,
  longPressTriggeredRef,
  setOnProductTileHover,
  startLongPress,
  endLongPress,
  onProductTileHover,
  handleCloseProductModal,
  selectedVariant,
  setRecentlyViewsId,
  selectedVariantItemInCart,
  hasProperties,
  shouldAddDirectlyToCart,
  hasCustomerConfiguration,
  setIsToAddProperties,
  decrement,
  increment,
  showOnBoardingModal,
  indexCount,
  isCheckoutOrOrdersPage,
  handleOnboardingClose,
  addToCartVariant,
  selectedImage,
  setShowOnBoardingModal,
  addToCart,
  isAddingToCart,
  isRemovingFromCart,
  userConfigurations,
  handleSave,
  isSaved,
  discountPill,
}: {
  product: Product;
  variantPreviewItems: VariantMediaPreviewItem[];
  activeIndex: number;
  imgRef: any;
  isOutOfStock: boolean;
  longPressTriggeredRef: MutableRefObject<boolean>;
  setOnProductTileHover: (value: boolean) => void;
  startLongPress: () => void;
  endLongPress: () => void;
  onProductTileHover: boolean;
  handleCloseProductModal: () => void;
  selectedVariant: ProductVariant;
  setRecentlyViewsId: (id: any) => void;
  selectedVariantItemInCart?: CartItem;
  hasProperties: boolean | "" | undefined;
  shouldAddDirectlyToCart: boolean;
  hasCustomerConfiguration: boolean;
  setIsToAddProperties: (value: boolean) => void;
  decrement: (item: CartItem) => void;
  increment: (item: CartItem) => void;
  showOnBoardingModal: boolean;
  indexCount: boolean;
  isCheckoutOrOrdersPage: boolean;
  handleOnboardingClose: () => void;
  addToCartVariant: 'icon' | 'text';
  selectedImage?: string;
  setShowOnBoardingModal: (value: boolean) => void;
  addToCart: (
    variantId: string,
    quantity: number,
    userConfigurations: any,
    variant: ProductVariant
  ) => void;
  isAddingToCart: boolean;
  isRemovingFromCart: boolean;
  userConfigurations: any;
  handleSave: () => void;
  isSaved: SavedVariant | undefined;
  discountPill: TilePill | null;
}) => {
  return (
    <div
      id="image"
      className="relative aspect-square rounded-[10px] overflow-hidden lg:rounded-[15px] w-full"
      onMouseOver={() => setOnProductTileHover(true)}
      onMouseOut={() => setOnProductTileHover(false)}
      onMouseDown={startLongPress}
      onMouseUp={endLongPress}
      onMouseLeave={endLongPress}
      onTouchStart={startLongPress}
      onTouchEnd={endLongPress}
      onTouchMove={endLongPress}
      onTouchCancel={endLongPress}
    >
      <Link
        href={`/products/${product?.slug}`}
        onClick={(e) => {
          if (longPressTriggeredRef.current) {
            e.preventDefault();
            longPressTriggeredRef.current = false;
          }
        }}
      >
          <div className="relative w-full h-full overflow-hidden">
            {variantPreviewItems.length > 0 && (
              <ProductTileMediaCarousel
                key={product.id}
                items={variantPreviewItems}
                activeIndex={activeIndex}
                imgRef={imgRef}
              />
            )}

            {isOutOfStock && (
              <div className="absolute w-full h-full text-white flex justify-center items-center z-[3px] lg:text-[22px] rounded-[6px] pointer-events-none">
                Out of stock
              </div>
            )}
          </div>
      </Link>

      {/* QUICK LOOK BUTTON */}
      {onProductTileHover && product && (
        <div
          id="add to cart button"
          className="hidden lg:block absolute z-[2px] bottom-0 left-0 ml-[10px] mt-[20px] lg:mr-[15px] lg:mb-[15px]"
          onClick={() => {
            handleCloseProductModal();
            if (selectedVariant) {
              setRecentlyViewsId(selectedVariant.id);
            }
          }}
        >
          <p className="bg-white rounded-[20px] p-[5px] cursor-pointer text-[12px] flex items-center gap-[5px]">
            <FaEye className="w-fit" />
            Quick look
          </p>
        </div>
      )}

      {/* ADD TO CART / ONBOARDING */}
      <div
        id="add to cart button"
        className="absolute z-[2px] bottom-0 right-0 mr-[10px] mb-[10px] lg:mr-[15px] lg:mb-[15px]"
      >
        {selectedVariantItemInCart && !isAddingToCart ? (
          <QuantitySelector
            decrement={() => {
              if (isRemovingFromCart) return;
              if (
                (hasProperties && !shouldAddDirectlyToCart) ||
                hasCustomerConfiguration
              ) {
                setIsToAddProperties(true);
                handleCloseProductModal();
              } else {
                decrement(selectedVariantItemInCart);
              }
            }}
            increment={() => {
              if (isRemovingFromCart) return;
              if (
                (hasProperties && !shouldAddDirectlyToCart) ||
                hasCustomerConfiguration
              ) {
                setIsToAddProperties(true);
                handleCloseProductModal();
              } else {
                increment(selectedVariantItemInCart);
              }
            }}
            cartItem={selectedVariantItemInCart}
            busy={isRemovingFromCart}
          />
        ) : (
          <>
            {showOnBoardingModal && indexCount && !isCheckoutOrOrdersPage && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="lg:w-[200px] w-[100px] lg:p-[10px] p-[5px] lg:mb-[10px] bottom-[70%] right-[20px]"
                style={{
                  position: 'absolute',
                  background: 'white',
                  borderRadius: '10px',
                  zIndex: 1000,
                }}
              >
                <p className="font-normal">
                  Tap this button to add an item to your cart
                </p>
                <div onClick={handleOnboardingClose}>
                  <button className="bg-brand text-white mt-[2px] lg:mt-[10px] lg:py-[10px] lg:px-[20px] w-full py-[5px] rounded-[5px] border-none hover:cursor-pointer text-[13px] lg:text-[14px] font-inter hover:bg-brand-hover transition-0.5s text-center">
                    Close
                  </button>
                </div>
              </div>
            )}

            <div
              style={
                showOnBoardingModal && indexCount ? { zIndex: 1000 } : undefined
              }
              className="rounded-full relative"
            >
              {selectedVariant?.status !== 'OUT_OF_STOCK' && (
                <button
                  onClick={() => {
                    if (isAddingToCart) return;
                    if (
                      (hasProperties && !shouldAddDirectlyToCart) ||
                      hasCustomerConfiguration
                    ) {
                      setShowOnBoardingModal(false);
                      setIsToAddProperties(true);
                      handleCloseProductModal();
                    } else {
                      setShowOnBoardingModal(false);
                      if (!localStorage.getItem('seenMiniCart')) {
                        window.dispatchEvent(
                          new Event('showMiniCartOnboarding')
                        );
                        localStorage.setItem('seenMiniCart', 'true');
                      }
                      addToCart(
                        selectedVariant.id,
                        selectedVariant.minPurchaseQuantity || 1,
                        userConfigurations,
                        {
                          ...selectedVariant,
                          product: selectedVariant.product ?? product,
                        }
                      );
                    }
                  }}
                  disabled={!selectedImage}
                  className={classNames(
                    `bg-[#FACE33] shadow-0-4-8-0-#00000033 hover:shadow-0-8-8-0-#00000033 !text-black 
                    disabled:bg-gray-200 disabled:cursor-not-allowed  
                    transition-all duration-500 will-change-transform font-roboto 
                    border-hidden outline-none flex items-center justify-items-center gap-[10px]`,
                    {
                      'rounded-full sm:p-[14px] p-[12px]': addToCartVariant === 'icon',
                      'rounded-[10px] px-[10px] py-[5px] sm:py-[10px] sm:px-[16px]': addToCartVariant === 'text',
                      'pointer-events-none': isAddingToCart,
                      'cursor-pointer hover:scale-1.06': !isAddingToCart,
                    }
                  )}
                >
                  {isAddingToCart ? (
                    <SpinLoader
                      size={addToCartVariant === 'icon' ? 18 : 16}
                      color="#111111"
                      trackColor="rgba(0,0,0,0.2)"
                      thickness={3}
                    />
                  ) : addToCartVariant === 'icon' ? (
                    <PiShoppingCartFill className="sm:w-[22px] w-[20px] sm:h-[22px] h-[20px]" />
                  ) : (
                    <span className="text-black font-roboto text-[12px] sm:text-[14px] font-medium">Add to cart</span>
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* FAVORITE ICON */}
      <div
        id="favorite icon"
        className="absolute z-[1px] top-0 right-0 mr-[10px] mt-[10px] lg:mr-[15px] lg:mt-[15px] text-[24px] lg:text-[34px]"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSave();
        }}
        style={{
          background: isSaved ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.7)',
          borderRadius: '50%',
          padding: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.11)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AiFillHeart
          color={isSaved ? '#ffffffee' : '#000000aa'}
          className="shadow"
        />
      </div>

      {/* DISCOUNT PILL */}
      {discountPill && (
        <div className="absolute w-fit h-fit top-0 left-0 z-[2px]">
          <div
            className="mt-[10px] lg:ml-[15px] lg:mt-[15px] whitespace-nowrap w-fit h-[20px] rounded-[20px] flex items-center justify-center px-[10px] py-[15px] ml-[5px]"
            style={{
              backgroundColor: discountPill.pillBackground,
              color: discountPill.pillColor,
            }}
          >
            <p className="text-[10px] lg:text-[12px]">{discountPill.text}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTileImageSection;
