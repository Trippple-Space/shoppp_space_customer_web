import React, { MutableRefObject } from 'react';
import classNames from 'classnames';
import { AiFillHeart } from 'react-icons/ai';
import { FaEye } from 'react-icons/fa6';
import { PiShoppingCartFill } from 'react-icons/pi';
import Link from 'next/link';
import QuantitySelector from '../../quantity-selector/QuantitySelector';
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
  userConfigurations: any;
  handleSave: () => void;
  isSaved: SavedVariant | undefined;
  discountPill: TilePill | null;
}) => {
  return (
    <div
      id="image"
      className="relative ratio-1 radius-10 g|overflow:hidden l:radius-15 w-full"
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
          <div className="relative w-full h-full g|overflow:hidden">
            {variantPreviewItems.length > 0 && (
              <ProductTileMediaCarousel
                key={product.id}
                items={variantPreviewItems}
                activeIndex={activeIndex}
                imgRef={imgRef}
              />
            )}

            {isOutOfStock && (
              <div className="absolute w-100p h-100p text-white flex j-content-center a-items-center z-3 l:text-22 radius-6 pointer-events-none">
                Out of stock
              </div>
            )}
          </div>
      </Link>

      {/* QUICK LOOK BUTTON */}
      {onProductTileHover && product && (
        <div
          id="add to cart button"
          className="hidden l:block absolute z-2 b-0 l-0 ml-10 mt-20 l:mr-15 l:mb-15"
          onClick={() => {
            handleCloseProductModal();
            if (selectedVariant) {
              setRecentlyViewsId(selectedVariant.id);
            }
          }}
        >
          <p className="bg-white radius-20 p-5 cursor-pointer text-12 flex a-items-center gap-5">
            <FaEye className="w-fit" />
            Quick look
          </p>
        </div>
      )}

      {/* ADD TO CART / ONBOARDING */}
      <div
        id="add to cart button"
        className="absolute z-2 b-0 r-0 mr-10 mb-10 l:mr-15 l:mb-15"
      >
        {selectedVariantItemInCart ? (
          <QuantitySelector
            decrement={() => {
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
          />
        ) : (
          <>
            {showOnBoardingModal && indexCount && !isCheckoutOrOrdersPage && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="l:w-200 w-100 l:p-10 p-5 l:mb-10 b-70p r-20"
                style={{
                  position: 'absolute',
                  background: 'white',
                  borderRadius: '10px',
                  zIndex: 1000,
                }}
              >
                <p className="weight-400">
                  Tap this button to add an item to your cart
                </p>
                <div onClick={handleOnboardingClose}>
                  <button className="bg-green text-white mt-2 l:mt-10 l:py-10 l:px-20 w-full py-5 radius-5 border-none hover:pointer text-13 l:text-14 font-inter hover:bg-darkgreen transition-0.5s text-center">
                    Close
                  </button>
                </div>
              </div>
            )}

            <div
              style={
                showOnBoardingModal && indexCount ? { zIndex: 1000 } : undefined
              }
              className="round relative"
            >
              {selectedVariant?.status !== 'OUT_OF_STOCK' && (
                <button
                  onClick={() => {
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
                    `bg-#FACE33 shadow-0-4-8-0-#00000033 hover:shadow-0-8-8-0-#00000033 text-black! 
                    disabled:bg-gray-200 disabled:cursor-not-allowed hover:scale-1.06 
                    g|transition:0.5s g|will-change:transform pointer font-roboto 
                    border-hidden outline-none flex a-items-center j-items-center gap-10`,
                    {
                      'round s:p-14 p-12': addToCartVariant === 'icon',
                      'radius-10 px-10 py-5 s:py-10 s:px-16': addToCartVariant === 'text',
                    }
                  )}
                >
                  {addToCartVariant === 'icon' ? (
                    <PiShoppingCartFill className="s:w-22 w-20 s:h-22 h-20" />
                  ) : (
                    <span className="text-black font-roboto text-12 s:text-14 weight-500">Add to cart</span>
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
        className="absolute z-1 t-0 r-0 mr-10 mt-10 l:mr-15 l:mt-15 text-24 l:text-34"
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
        <div className="absolute w-fit h-fit t-0 l-0 z-2">
          <div
            className="mt-10 l:ml-15 l:mt-15 whitespace-nowrap w-fit h-20 radius-20 flex a-items-center j-content-center px-10 py-15 ml-5"
            style={{
              backgroundColor: discountPill.pillBackground,
              color: discountPill.pillColor,
            }}
          >
            <p className="text-10 l:text-12">{discountPill.text}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTileImageSection;
