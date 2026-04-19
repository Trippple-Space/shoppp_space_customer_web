'use client';
import Modal from '@/modules/lib/components/modal/modal';
import { useCart } from '@/modules/lib/utility/hooks/use-cart';
import {
  checkMediaType,
  displayStockUnit,
  formatNumberAsPrice,
  getClosestColorName,
} from '@/modules/lib/utility/utility';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { paths } from '../../utility/paths';
import { CartItem } from '../../utility/types/cart.interface';
import {
  PiMinus,
  PiPlus,
  PiShoppingCartBold,
  PiTrashSimple,
} from 'react-icons/pi';
import { RxCross1, RxCross2 } from 'react-icons/rx';
import Image from '../image/Image';
import { useNavbarView } from '../../utility/hooks/views/use-navbar-view';
import useUserStore from '../../utility/store/user.store';
import VideoSrc from '../video-src/VideoSrc';
import { ConfigPill } from '../product-detail-modal/productConfigurationsHelper';
import NoResultMessage from '../error-messages/no-result-found';

interface ModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideDefaultCart?: boolean;
}

const MiniCart: React.FC<ModalProps> = ({
  isOpen,
  onOpenChange,
  hideDefaultCart = false,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = (val: boolean) => {
    if (onOpenChange) onOpenChange(val);
    else setInternalOpen(val);
  };

  const {
    cart,
    increment,
    decrement,
    removeFromCart,
    removeDiscountCode,
    fetchCart,
    fetching,
  } = useCart();

  const router = useRouter();

  const { signOut } = useNavbarView();
  const { isAuthenticated } = useUserStore();
  const hasFetchedCartAfterAuth = useRef(false);
  const hasFetchedCartForCurrentOpen = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      hasFetchedCartAfterAuth.current = false;
      return;
    }

    if (hasFetchedCartAfterAuth.current) return;

    hasFetchedCartAfterAuth.current = true;
    removeDiscountCode();
    fetchCart();
  }, [isAuthenticated, removeDiscountCode, fetchCart]);

  useEffect(() => {
    if (!isAuthenticated) {
      hasFetchedCartForCurrentOpen.current = false;
      return;
    }

    if (!open) {
      hasFetchedCartForCurrentOpen.current = false;
      return;
    }

    if (hasFetchedCartForCurrentOpen.current) return;

    hasFetchedCartForCurrentOpen.current = true;
    removeDiscountCode();
    fetchCart();
  }, [open, isAuthenticated, removeDiscountCode, fetchCart]);

  const checkoutCart = () => {
    cart.cartItems
      .filter((item) => item.variant.status === 'OUT_OF_STOCK')
      .forEach((item) => removeFromCart(item.id));
    router.push(paths.checkout);
  };

  const isValidDiscount = (cartItem: CartItem) => {
    if (cartItem?.variant?.product?.discount?.activeEndDate) {
      return (
        new Date(cartItem?.variant?.product?.discount?.activeStartDate) <=
        new Date(new Date().setHours(new Date().getHours() + 1)) &&
        new Date(new Date().setHours(new Date().getHours() + 1)) <=
        new Date(cartItem?.variant?.product?.discount?.activeEndDate)
      );
    }
  };

  return (
    <div className="w-fit">
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        extraClass={{ height: '100dvh', borderRadius: '0px' }}
        className="t-0 l:t-0 l:b-0 l:r-0 overflow-hidden l:w-520 w-full"
      >
        <div className="relative h-full g|overflow-y:hidden font-inter color-#000000E0">
          <div className="md:py-26 py-20 px-24 text-16 weight-600 flex space-between border-b border-#00000014">
            <p className="line-height-24">
              Shopping Cart ({cart.cartItems.length})
            </p>
            <RxCross1
              onClick={() => setOpen(false)}
              className="w-24 h-24 hover:pointer"
            />
          </div>

          <div
            className="l:min-w-500 w-full"
            style={{ height: 'calc(100dvh - 76px)' }}
          >
            <div className="scroll-y no-scrollbar h-full flex flex-col space-between w-full">
              <div className="flex flex-col pb-183">
                {!cart.cartItems.length ? (
                  <div className="mx-auto text-center flex flex-col a-items-center gap-16 py-24">
                    <NoResultMessage textContent='Continue shopping to discover our best deals!' />

                    <div className="flex flex-col gap-8 text-14 w-250 mx-auto">
                      {!isAuthenticated && (
                        <button
                          className="bg-green text-white py-12 px-24 radius-6 line-height-19 border border-none weight-500 pointer w-full hover:bg-darkgreen g|transition:0.5s disabled:bg-grey"
                          onClick={() => signOut()}
                        >
                          Sign in
                        </button>
                      )}

                      <button
                        onClick={() => setOpen(false)}
                        className={`g|transition:0.5s py-12 px-24 radius-6 line-height-19 text-center w-full weight-500 border border-none hover:pointer ${isAuthenticated
                          ? 'bg-green hover:bg-darkgreen text-white'
                          : 'bg-#F5F5F5 hover:bg-grey-300 text-#333333'
                          }`}
                      >
                        Explore products
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-24 flex flex-col gap-16">
                    {cart.cartItems.map((cartItem: CartItem, i) => {
                      const mediaType =
                        checkMediaType(
                          cartItem.variant?.media
                            ? cartItem.variant?.media[0]?.url || ''
                            : ''
                        ) ?? 'image';

                      return (
                        <div
                          className="flex  flex-col border border-#00000014 radius-6"
                          key={i}
                        >
                          <div
                            className={`flex j-content-between gap-10 p-12 ${cartItem.variant.status === 'OUT_OF_STOCK' ? 'color-#00000099' : 'color-#0000008C'}`}
                          >
                            <div className="flex gap-10 relative">
                              <div className="sm:w-80! w-70! sm:h-80! h-70! radius-6 relative overflow-hidden">
                                {mediaType === 'image' ? (
                                  <Image
                                    src={
                                      cartItem?.variant?.media
                                        ? cartItem?.variant?.media[0]?.url
                                        : ''
                                    }
                                    alt="cart image"
                                    className={`sm:w-80! w-70! sm:h-80! h-70! radius-6 border border-#00000014 object-fit ${cartItem.variant.status == 'OUT_OF_STOCK' ? 'greyscale' : ''}`}
                                  />
                                ) : (
                                  <VideoSrc
                                    className={`sm:w-80! w-70! sm:h-80! h-70! radius-6 border border-#00000014 object-fit ${cartItem.variant.status == 'OUT_OF_STOCK' ? 'greyscale' : ''}`}
                                    src={
                                      cartItem?.variant?.media
                                        ? cartItem?.variant?.media[0]?.url
                                        : ''
                                    }
                                    hasLoader={true}
                                  />
                                )}
                              </div>
                              <div
                                className={`flex flex-col ${Object.keys(cartItem?.variant?.properties ?? {}).length > 2 ? 'gap-2.8' : 'gap-6'}`}
                              >
                                <p
                                  className={`weight-600 sm:text-16 text-14 sm:line-height-24 line-height-22 ${cartItem.variant.status === 'OUT_OF_STOCK' ? 'color-#00000099' : 'color-#000000E0'}`}
                                >
                                  {cartItem?.variant?.product?.name}{' '}
                                </p>
                                <p
                                  className={`weight-400 ${Object.keys(cartItem?.variant?.properties ?? {}).length > 2 ? 'text-13.5 line-height-16' : 'text-14 line-height-16.94'}`}
                                >
                                  Quantity:{' '}
                                  {`${cartItem?.quantity} ${displayStockUnit(
                                    cartItem.variant.stockUnit
                                  )}${cartItem?.quantity > 1 ? 's' : ''}`}
                                </p>
                                {cartItem?.variant?.properties?.color && (
                                  <p
                                    className={`weight-400 capitalize ${Object.keys(cartItem?.variant?.properties ?? {}).length > 2 ? 'text-13.5 line-height-16' : 'text-14 line-height-16.94'}`}
                                  >
                                    Color:{' '}
                                    {cartItem?.variant?.properties?.color[0] === '#' ? getClosestColorName(cartItem?.variant?.properties?.color) : cartItem?.variant?.properties?.color}
                                  </p>
                                )}
                                {cartItem?.variant?.size && (
                                  <p className="weight-400 text-13.5 line-height-16">
                                    Size: {cartItem?.variant?.size}
                                  </p>
                                )}

                                {cartItem?.variant?.properties &&
                                  Object.entries(
                                    cartItem.variant?.properties
                                  ).map(([key, value]) => {
                                    if (key === 'color' || key === 'size' || !value)
                                      return null;
                                    return (
                                      <p
                                        key={key}
                                        className="weight-400 text-13.5 line-height-16 capitalize"
                                      >
                                        {`${key}: ${Array.isArray(value) ? value.join(', ') : value}`}
                                      </p>
                                    );
                                  })}
                              </div>
                            </div>

                            {
                              <RxCross2
                                className="w-fit cursor-pointer color-red"
                                onClick={() => removeFromCart(cartItem.id)}
                              />
                            }
                          </div>

                          {cartItem?.userConfigurations &&
                            Object.keys(cartItem.userConfigurations).length >
                            0 && (
                              <div className="px-12 pb-12">
                                <div className="pt-10 flex flex-col gap-6">
                                  <div className="flex gap-8 flex-wrap relative">
                                    {Object.entries(
                                      cartItem.userConfigurations
                                    ).map(([recordName, recordValue]) => {
                                      if (
                                        !recordValue ||
                                        typeof recordValue !== 'object' ||
                                        Object.keys(recordValue).length === 0
                                      )
                                        return null;

                                      return (
                                        <ConfigPill
                                          key={recordName}
                                          title={recordName.replaceAll(
                                            '_',
                                            ' '
                                          )}
                                          value={recordValue}
                                        />
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}

                          <div className="px-12 pb-12 flex space-between a-items-center">
                            <div className="flex md:a-items-center md:gap-8 md:flex-row flex-col">
                              <p
                                className={`weight-600 md:text-20 sm:text-16 text-14 md:line-height-28 sm:line-height-24 line-height-22 ${cartItem.variant.status === 'OUT_OF_STOCK' ? 'color-#00000099' : ''}`}
                              >
                                {isValidDiscount(cartItem)
                                  ? formatNumberAsPrice(
                                    cartItem.discountedPrice
                                  )
                                  : formatNumberAsPrice(cartItem.totalPrice)}
                              </p>
                              {isValidDiscount(cartItem) && (
                                <p
                                  className={`weight-400 md:text-16 sm:text-12 text-10 md:line-height-24 sm:line-height-20 line-height-18 line-through color-#00000099  ${cartItem.variant.status === 'OUT_OF_STOCK' ? 'color-#00000099' : ''}`}
                                >
                                  {formatNumberAsPrice(cartItem.totalPrice)}
                                </p>
                              )}
                            </div>
                            <div className="border border-#00000014 flex space-between a-items-center  p-4 radius-100 bg-#F5F5F5 w-150">
                              {cartItem.variant.status === 'OUT_OF_STOCK' ? (
                                <div className="text-14 grid weight-400 color-#00000099  w-full">
                                  <span className="text-center">
                                    Out of stock
                                  </span>
                                </div>
                              ) : (
                                <>
                                  <span
                                    className="bg-white p-6 round flex flex-col a-items-center hover:pointer"
                                    onClick={() => decrement(cartItem)}
                                  >
                                    {cartItem?.quantity ===
                                      cartItem?.variant?.minPurchaseQuantity ? (
                                      <PiTrashSimple className="w-20 h-20 color-#00000099" />
                                    ) : (
                                      <PiMinus className="w-20 h-20 color-#00000099" />
                                    )}
                                  </span>
                                  <span className="grow weight-500 line-height-19.36 text-16">
                                    {cartItem?.quantity}
                                  </span>
                                  <span
                                    className="bg-white p-6 round flex flex-col a-items-center hover:pointer"
                                    onClick={() => increment(cartItem)}
                                  >
                                    <PiPlus className="w-20 h-20 color-#00000099" />
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {!!cart.cartItems.length && (
                <div className="border-t border-#00000014 flex flex-col p-24 gap-16 absolute b-0 left-0 w-full bg-white g|box-shadow:0px|_|-2px|_|4px|_|#494F5E1F;">
                  <div className="flex flex-col gap-6">
                    <p className="py-12 flex a-items-center space-between text-16 line-height-24">
                      <span className="weight-400">Subtotal</span>
                      <span className="weight-500" key={cart.id}>
                        {fetching ? (
                          <div className="bg-#00000014 w-100 h-30 radius-6 animate-pulse"></div>
                        ) : (
                          formatNumberAsPrice(cart.totalDiscountedPrice)
                        )}
                        {/* {formatNumberAsPrice(cart?.cartItems
                          .filter(item => item.variant.status !== 'OUT_OF_STOCK')
                          .reduce((acc, item) => acc + item.totalPrice, 0))} */}
                        { }
                      </span>
                    </p>
                    <p className="weight-400 text-14 line-height-22 color-#00000099">
                      Shipping and taxes are calculated at checkout.
                    </p>
                  </div>
                  <button
                    className="bg-green text-white py-12 px-24 radius-6 line-height-19 border border-none weight-500 pointer w-full hover:bg-darkgreen g|transition:0.5s disabled:bg-grey"
                    onClick={() => checkoutCart()}
                  >
                    Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {!hideDefaultCart && (
        <div className="">
          <div
            onClick={() => setOpen(true)}
            className="relative pointer bg-#F3F3F3 flex a-items-center gap-8 w-70 radius-6 px-5 py-5"
          >
            <p className="h-30 w-30 flex a-items-center j-content-center bg-#0B9378 radius-6 color-white weight-500">
              <span>{cart.cartItems.length}</span>
            </p>
            <span
              className="cart-icon flex flex-col j-content-center a-items-center"
              style={{ position: 'relative', display: '' }}
            >
              <PiShoppingCartBold className="color-black w-18 h-18" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniCart;
