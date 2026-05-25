import React, { useState } from 'react';
import Image from '../image/Image';
import Link from 'next/link';
import VideoSrc from '../video-src/VideoSrc';
import { RecentlyViewed } from '../../utility/types/product.interface';
import { FaEye } from 'react-icons/fa6';
import QuantitySelector from '../quantity-selector/QuantitySelector';
import { useCart } from '../../utility/hooks/use-cart';
import { PiShoppingCartFill, PiStorefront } from 'react-icons/pi';
import classNames from 'classnames';
import { AiFillHeart, AiFillStar, AiOutlineHeart } from 'react-icons/ai';
import { formatNumberAsPrice, formatStockUnitSuffix } from '../../utility/utility';
import {
  getStrikethroughAmounts,
  getVariantDisplayPrices,
} from '../../utility/visible-discount';
import ProductDetailModal from '../product-detail-modal/ProductDetailModal';
import { SavedVariant } from '../../utility/types/SavedVariant.interface';
import { guestSession } from '../../utility/guest-session';
import { CartItem } from '../../utility/types/cart.interface';

interface IVariantModal {
  variant: RecentlyViewed;
  saveVariant?: (variantId: string) => void;
  removeSavedVariant?: (variantId: string) => void;
  savedVariants?: SavedVariant[];
}

const VariantModal = ({
  variant,
  saveVariant,
  removeSavedVariant,
  savedVariants,
}: IVariantModal) => {
  const {
    addToCart,
    cart,
    increment,
    decrement,
    isAuthenticated,
    isLoginModal,
  } = useCart();

  const [onProductTileHover, setOnProductTileHover] = useState(false);
  const [openSingleProductModal, setOpenSingleProductModal] = useState(false);
  const [guestCartVersion, setGuestCartVersion] = useState(0);

  const [mediaType, setMediaType] = useState<string>('image');
  const [selectedImage, setSelectedImage] = useState(
    variant.productVariant.media[0].url
  );

  const handleCloseProductModal = () => {
    setOpenSingleProductModal((prev) => !prev);
  };

  const selectedVariantItemInCart = React.useMemo(() => {
    const existing = cart.cartItems.find(
      (item) => item.variant.id === variant.productVariantId
    );
    if (existing) {
      return existing;
    }
    if (isAuthenticated) {
      return undefined;
    }

    const guestQty = guestSession.getCartQuantityForVariant(variant.productVariantId);
    if (guestQty <= 0) {
      return undefined;
    }

    return {
      id: `guest-${variant.productVariantId}`,
      productId: variant.productVariant.product?.id ?? '',
      quantity: guestQty,
      variant: variant.productVariant as any,
      totalPrice: variant.productVariant.finalPrice * guestQty,
      discountedPrice: variant.productVariant.discountedPrice * guestQty,
      userConfigurations:
        guestSession.getLatestUserConfigurations(variant.productVariantId) ?? {},
      createdAt: '',
      discountValue: 0,
      lastUpdated: '',
      meta: null,
    } as CartItem;
  }, [cart.cartItems, variant, isAuthenticated, guestCartVersion]);

  React.useEffect(() => {
    const handleGuestCartUpdate = () => setGuestCartVersion((value) => value + 1);
    window.addEventListener('guest-cart-updated', handleGuestCartUpdate);
    return () =>
      window.removeEventListener('guest-cart-updated', handleGuestCartUpdate);
  }, []);

  const isSaved = savedVariants?.find(
    (item: SavedVariant) => item.variantId === variant?.productVariantId
  );

  const variantDisplayPrices = getVariantDisplayPrices({
    variant: variant.productVariant,
    product: variant.productVariant?.product,
  });
  const handleSave = () => {
    if (!variant?.productVariantId) return;
    if (isSaved) {
      removeSavedVariant && removeSavedVariant(variant.productVariantId);
    } else {
      saveVariant && saveVariant(variant.productVariantId);
    }
  };

  return (
    <>
      <div className="mt-30 l:mt-20 w-full">
        <div
          id="image"
          className="relative ratio-1 radius-10 g|overflow:hidden l:radius-15 l:w-250 w-200 relative"
          onMouseOver={() => setOnProductTileHover(true)}
          onMouseOut={() => setOnProductTileHover(false)}
        >
          <Link href={`/products/${variant.productVariant?.product?.slug}`} className='relative w-full h-full overflow-hidden inline-block'>
            {mediaType === 'image' ? (
              <>
                {variant.productVariant?.status === 'OUT_OF_STOCK' && (
                  <div className="absolute w-full h-full z-1 flex a-items-center j-content-center color-white text-16 weight-400 text-left">
                    Out of stock
                  </div>
                )}
                <Image
                  className={` w-full h-full a-self-center g|object-fit:cover pointer ${variant.productVariant.status === 'OUT_OF_STOCK' && 'out-of-stock'}`}
                  src={selectedImage}
                  alt="product-image"
                  width={10000}
                  hasLoader={true}
                />
              </>
            ) : (
              <VideoSrc
                className={`absolute w-full h-full a-self-center g|object-fit:cover pointer ${variant.productVariant.status === 'OUT_OF_STOCK' && 'out-of-stock'}`}
                src={selectedImage}
                hasLoader={true}
              />
            )}
          </Link>
          <div
            className="skelly-rectangle w-full h-full pulsing-multi-color-bg text-white flex"
            data-width="100%"
            data-radius="100%"
          ></div>

          <div className="">
            {onProductTileHover && variant.productVariant.product && (
              <div
                id="add to cart button"
                className="hidden l:block absolute z-1 t-0 l-0 ml-10 mt-15 l:mr-15 l:mb-15"
                onClick={handleCloseProductModal}
              >
                <p className="bg-white radius-20 p-5 cursor-pointer text-12 flex a-items-center gap-5">
                  <FaEye className="w-fit" />
                  Quick look
                </p>
              </div>
            )}
            <div
              id="add to cart button"
              className="absolute b-0 r-0 mr-10 mb-10 l:mr-15 l:mb-15"
            >
              {selectedVariantItemInCart ? (
                <QuantitySelector
                  decrement={() => decrement(selectedVariantItemInCart)}
                  increment={() => increment(selectedVariantItemInCart)}
                  cartItem={selectedVariantItemInCart}
                />
              ) : (
                <>
                  {variant.productVariant.status !== 'OUT_OF_STOCK' ? (
                    <button
                      onClick={() => {
                        if (!localStorage.getItem('seenMiniCart')) {
                          window.dispatchEvent(
                            new Event('showMiniCartOnboarding')
                          );
                          localStorage.setItem('seenMiniCart', 'true');
                        }
                        addToCart(
                          variant.productVariantId,
                          1,
                          undefined,
                          variant.productVariant
                        );
                      }}
                      disabled={!selectedImage}
                      className={classNames(
                        'bg-#FACE33 shadow-0-4-8-0-#00000033 hover:shadow-0-8-8-0-#00000033 text-black! disabled:bg-gray-200 disabled:cursor-not-allowed hover:scale-1.06 g|transition:0.5s g|will-change:transform pointer font-roboto border-hidden outline-none s:p-14 p-12 round flex a-items-center j-items-center gap-10'
                      )}
                    >
                      <PiShoppingCartFill className="s:w-22 w-20 s:h-22 h-20" />
                    </button>
                  ) : (
                    ''
                  )}
                </>
              )}
            </div>
          </div>
          <div
            id="favorite icon"
            className="absolute t-0 r-0 mr-5 mt-10 l:mr-10 text-24 text-white cursor-pointer"
            onClick={handleSave}
          >
            {isSaved ? (
              <AiFillHeart className="shadow w-25 h-25" />
            ) : (
              <AiOutlineHeart className="shadow w-25 h-25" />
            )}
          </div>
        </div>
        {/* <div className="scroll-x no-scrollbar">
        <div
          id="product varients"
          className="md:mt-16 mt-14 flex a-items-center md:gap-6 gap-4 w-200 overlow-auto whitespace-nowrap"
        >
      
            {variant.productVariant.media.map((mediaItem: any) =>
              mediaItem?.type === "image" ? (
                <Image
                  className={classNames(
                    `l:w-35.2 l:h-35.2 w-31 h-31 pointer md:radius-4 radius-3 a-self-center g|object-fit:cover ${variant?.status === 'OUT_OF_STOCK' && 'greyscale'}`,
                    {
                      "border border-2": selectedImage == mediaItem?.url,
                      [`border-${'#0B9378'}`]:
                        selectedImage == mediaItem?.url,
                    }
                  )}
                  src={mediaItem?.url}
                  onClick={() => {
                    setSelectedVariant(variant);
                    setRecentlyViewsId(variant.id)
                    setMediaType("image");
                    setSelectedImage(mediaItem?.url);
                  }}
                  alt="product-image"
                />
              ) : (
                <VideoSrc
                  className={classNames(
                    "l:w-35.2 l:h-35.2 w-31 h-31 pointer md:radius-4 radius-3 a-self-center g|object-fit:cover",
                    {
                      "border border-2": selectedImage == mediaItem?.url,
                      [`border-${'#0B9378'}`]:
                        selectedImage == mediaItem?.url,
                    }
                  )}
                  onClick={() => {
                    setSelectedVariant(variant);
                    setMediaType("video");
                    setSelectedImage(mediaItem?.url);
                  }}
                  src={mediaItem?.url}
                />
              )
            )
          }
        </div>
      </div> */}
        <div
          id="product details"
          className="md:mt-16 mt-20 l:max-w-250 max-w-200 overflow-hidden l:w-full white-space-nowrap text-overflow-ellipsis flex flex-col gap-8"
        >
          <div title={variant.productVariant.product?.name}>
            <Link
              href={`/products/${variant.productVariant?.product?.slug}`}
              className="inline-block text-overflow-ellipsis"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'block',
                maxWidth: '100%',
              }}
            >
              {variant.productVariant?.product?.name || 'No name'}
            </Link>
          </div>
          <div className="flex a-items-center gap-10 l:gap-18 text-dimgrey py-6 border-y border-#00000014">
            <Link
              href={`/${variant.productVariant?.product?.store.slug}`}
              className="flex gap-6 a-items-center color-#00000099 capitalize"
            >
              <PiStorefront className="md:w-16 w-14 md:h-16 h-14" />
              <p className="md:text-12 text-10 weight-400 md:line-height-20 line-height-12.1">
                {variant.productVariant?.product?.store?.name}
              </p>
            </Link>
            {/* {!!product.reviewRating && (
            <div className="flex gap-3 items-center">
              <AiFillStar className="w-12" />
              <span className="l:text-16 text-12">{product.reviewRating}</span>
            </div>
          )} */}
          </div>
          <div className="flex md:gap-8 md:a-items-center gap-6">
            <p className="md:text-16 text-12 weight-600 md:line-height-24 line-height-20">
              {formatNumberAsPrice(variantDisplayPrices.displayPrice)}
            </p>
            {variantDisplayPrices.hasSlash && (
              <div className="flex flex-wrap gap-6 md:gap-8 a-items-center">
                {getStrikethroughAmounts(variantDisplayPrices).map(
                  (amount, idx) => (
                    <p
                      key={idx}
                      className="md:text-12 text-10 weight-400 md:line-height-20 color-#00000099 line-through"
                    >
                      {formatNumberAsPrice(amount)}
                    </p>
                  )
                )}
              </div>
            )}
            {!variantDisplayPrices.hasSlash &&
              (() => {
                const stockUnitSuffix = formatStockUnitSuffix(
                  variant.productVariant?.stockUnit
                );
                return stockUnitSuffix ? (
                  <span
                    className="sm:text-10 text-8 weight-400 md:line-height-20 line-height-12.1 md:mb-0 mb-2"
                    style={{ alignSelf: 'flex-end' }}
                  >
                    {stockUnitSuffix}
                  </span>
                ) : null;
              })()}
          </div>
          {/* <div className="flex flex-wrap gap-4">
          {product?.tags?.map((tag: any, i: number) => (
            <span
              className="text-green md:text-12 text-10 inline-block radius-5 mx-2 my-1 pointer hover:underline lowercase"
              key={i}
            >
              {!tag.label.includes("pill:") && "#" + tag.label}
            </span>
          ))}
        </div> */}
        </div>
        {openSingleProductModal && (
          <ProductDetailModal
            openSingleProductModal={openSingleProductModal}
            handleCloseProductModal={handleCloseProductModal}
            position=""
            product={variant.productVariant.product}
            variant={variant.productVariant}
            variantSelectedImage={selectedImage}
          />
        )}
      </div>
    </>
  );
};

export default VariantModal;
