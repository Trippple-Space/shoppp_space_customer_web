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
      <div className="mt-[30px] lg:mt-[20px] w-full">
        <div
          id="image"
          className="relative aspect-square rounded-[10px] overflow-hidden lg:rounded-[15px] lg:w-[250px] w-[200px] relative"
          onMouseOver={() => setOnProductTileHover(true)}
          onMouseOut={() => setOnProductTileHover(false)}
        >
          <Link href={`/products/${variant.productVariant?.product?.slug}`} className='relative w-full h-full overflow-hidden inline-block'>
            {mediaType === 'image' ? (
              <>
                {variant.productVariant?.status === 'OUT_OF_STOCK' && (
                  <div className="absolute w-full h-full z-[1px] flex items-center justify-center text-white text-[16px] font-normal text-left">
                    Out of stock
                  </div>
                )}
                <Image
                  className={` w-full h-full self-center object-cover cursor-pointer ${variant.productVariant.status === 'OUT_OF_STOCK' && 'out-of-stock'}`}
                  src={selectedImage}
                  alt="product-image"
                  width={10000}
                  hasLoader={true}
                />
              </>
            ) : (
              <VideoSrc
                className={`absolute w-full h-full self-center object-cover cursor-pointer ${variant.productVariant.status === 'OUT_OF_STOCK' && 'out-of-stock'}`}
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
                className="hidden lg:block absolute z-[1px] top-0 left-0 ml-[10px] mt-[15px] lg:mr-[15px] lg:mb-[15px]"
                onClick={handleCloseProductModal}
              >
                <p className="bg-white rounded-[20px] p-[5px] cursor-pointer text-[12px] flex items-center gap-[5px]">
                  <FaEye className="w-fit" />
                  Quick look
                </p>
              </div>
            )}
            <div
              id="add to cart button"
              className="absolute bottom-0 right-0 mr-[10px] mb-[10px] lg:mr-[15px] lg:mb-[15px]"
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
                        'bg-[#FACE33] shadow-0-4-8-0-#00000033 hover:shadow-0-8-8-0-#00000033 !text-black disabled:bg-gray-200 disabled:cursor-not-allowed hover:scale-1.06 transition-all duration-500 will-change-transform cursor-pointer font-roboto border-hidden outline-none sm:p-[14px] p-[12px] rounded-full flex items-center justify-items-center gap-[10px]'
                      )}
                    >
                      <PiShoppingCartFill className="sm:w-[22px] w-[20px] sm:h-[22px] h-[20px]" />
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
            className="absolute top-0 right-0 mr-[5px] mt-[10px] lg:mr-[10px] text-[24px] text-white cursor-pointer"
            onClick={handleSave}
          >
            {isSaved ? (
              <AiFillHeart className="shadow w-[25px] h-[25px]" />
            ) : (
              <AiOutlineHeart className="shadow w-[25px] h-[25px]" />
            )}
          </div>
        </div>
        {/* <div className="scroll-x no-scrollbar">
        <div
          id="product varients"
          className="md:mt-[16px] mt-[14px] flex items-center md:gap-[6px] gap-[4px] w-[200px] overlow-auto whitespace-nowrap"
        >
      
            {variant.productVariant.media.map((mediaItem: any) =>
              mediaItem?.type === "image" ? (
                <Image
                  className={classNames(
                    `lg:w-[35.2px] lg:h-[35.2px] w-[31px] h-[31px] cursor-pointer md:rounded-[4px] rounded-[3px] self-center object-cover ${variant?.status === 'OUT_OF_STOCK' && 'greyscale'}`,
                    {
                      "border border-[2px]": selectedImage == mediaItem?.url,
                      [`border-${'#0357EE'}`]:
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
                    "lg:w-[35.2px] lg:h-[35.2px] w-[31px] h-[31px] cursor-pointer md:rounded-[4px] rounded-[3px] self-center object-cover",
                    {
                      "border border-[2px]": selectedImage == mediaItem?.url,
                      [`border-${'#0357EE'}`]:
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
          className="md:mt-[16px] mt-[20px] lg:max-w-[250px] max-w-[200px] overflow-hidden lg:w-full white-space-nowrap text-overflow-ellipsis flex flex-col gap-[8px]"
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
          <div className="flex items-center gap-[10px] lg:gap-[18px] text-[#333333] py-[6px] border-y border-[#00000014]">
            <Link
              href={`/${variant.productVariant?.product?.store.slug}`}
              className="flex gap-[6px] items-center text-[#00000099] capitalize"
            >
              <PiStorefront className="md:w-[16px] w-[14px] md:h-[16px] h-[14px]" />
              <p className="md:text-[12px] text-[10px] font-normal md:leading-[20px] leading-[12.1px]">
                {variant.productVariant?.product?.store?.name}
              </p>
            </Link>
            {/* {!!product.reviewRating && (
            <div className="flex gap-[3px] items-center">
              <AiFillStar className="w-[12px]" />
              <span className="lg:text-[16px] text-[12px]">{product.reviewRating}</span>
            </div>
          )} */}
          </div>
          <div className="flex md:gap-[8px] md:items-center gap-[6px]">
            <p className="md:text-[16px] text-[12px] font-semibold md:leading-[24px] leading-[20px]">
              {formatNumberAsPrice(variantDisplayPrices.displayPrice)}
            </p>
            {variantDisplayPrices.hasSlash && (
              <div className="flex flex-wrap gap-[6px] md:gap-[8px] items-center">
                {getStrikethroughAmounts(variantDisplayPrices).map(
                  (amount, idx) => (
                    <p
                      key={idx}
                      className="md:text-[12px] text-[10px] font-normal md:leading-[20px] text-[#00000099] line-through"
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
                    className="sm:text-[10px] text-[8px] font-normal md:leading-[20px] leading-[12.1px] md:mb-0 mb-[2px]"
                    style={{ alignSelf: 'flex-end' }}
                  >
                    {stockUnitSuffix}
                  </span>
                ) : null;
              })()}
          </div>
          {/* <div className="flex flex-wrap gap-[4px]">
          {product?.tags?.map((tag: any, i: number) => (
            <span
              className="text-brand md:text-[12px] text-[10px] inline-block rounded-[5px] mx-[2px] my-[1px] cursor-pointer hover:underline lowercase"
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
