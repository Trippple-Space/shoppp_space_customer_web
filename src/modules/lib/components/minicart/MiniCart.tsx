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
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import {
  getLineDisplayPrices,
  getStrikethroughAmounts,
} from '../../utility/visible-discount';

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
    isLoginModal,
  } = useCart();

  const router = useRouter();

  const { signOut } = useNavbarView();
  const { isAuthenticated } = useUserStore();
  const hasFetchedCartAfterAuth = useRef(false);
  const hasFetchedCartForCurrentOpen = useRef(false);

  const shouldShowSubtotalLoader = isAuthenticated && fetching;

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
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('post-auth-redirect', paths.checkout);
      }
      setOpen(false);
      isLoginModal();
      return;
    }
    cart.cartItems
      .filter((item) => item.variant.status === 'OUT_OF_STOCK')
      .forEach((item) => removeFromCart(item.id));
    router.push(paths.checkout);
  };

  return (
    <div className="w-fit">
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        extraClass={{ height: '100dvh', borderRadius: '0px' }}
        className="top-0 lg:top-0 lg:bottom-0 lg:right-0 overflow-hidden lg:w-[520px] w-full"
      >
        <div className="relative h-full overflow-y-hidden font-inter text-[#000000E0]">
          <div className="md:py-[26px] py-[20px] px-[24px] text-[16px] font-semibold flex justify-between border-b border-[#00000014]">
            <p className="leading-[24px]">
              Shopping Cart ({cart.cartItems.length})
            </p>
            <RxCross1
              onClick={() => setOpen(false)}
              className="w-[24px] h-[24px] hover:cursor-pointer"
            />
          </div>

          <div
            className="lg:min-w-[500px] w-full"
            style={{ height: 'calc(100dvh - 76px)' }}
          >
            <div className="scroll-y no-scrollbar h-full flex flex-col justify-between w-full">
              <div className="flex flex-col pb-[183px]">
                {!cart.cartItems.length ? (
                  <div className="mx-auto text-center flex flex-col items-center gap-[16px] py-[24px]">
                    <NoResultMessage textContent='Continue shopping to discover our best deals!' />

                    <div className="flex flex-col gap-[8px] text-[14px] w-[250px] mx-auto">
                      {!isAuthenticated && (
                        <button
                          className="bg-brand text-white py-[12px] px-[24px] rounded-[6px] leading-[19px] border border-none font-medium cursor-pointer w-full hover:bg-brand-hover transition-all duration-500 disabled:bg-[#676767]"
                          onClick={() => signOut()}
                        >
                          Sign in
                        </button>
                      )}

                      <button
                        onClick={() => setOpen(false)}
                        className={`transition-all duration-500 py-[12px] px-[24px] rounded-[6px] leading-[19px] text-center w-full font-medium border border-none hover:cursor-pointer ${isAuthenticated
                          ? 'bg-brand hover:bg-brand-hover text-white'
                          : 'bg-[#F5F5F5] hover:bg-[#E4E1DF] text-[#333333]'
                          }`}
                      >
                        Explore products
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-[24px] flex flex-col gap-[16px]">
                    {cart.cartItems.map((cartItem: CartItem, i) => {
                      const linePrices = getLineDisplayPrices({
                        totalPrice: Number(cartItem?.totalPrice ?? 0),
                        discountedPrice: Number(cartItem?.discountedPrice ?? 0),
                        variant: cartItem?.variant,
                      });
                      const mediaType =
                        checkMediaType(
                          cartItem.variant?.media
                            ? cartItem.variant?.media[0]?.url || ''
                            : ''
                        ) ?? 'image';

                      return (
                        <div
                          className="flex  flex-col border border-[#00000014] rounded-[6px]"
                          key={i}
                        >
                          <div
                            className={`flex justify-between gap-[10px] p-[12px] ${cartItem.variant.status === 'OUT_OF_STOCK' ? 'text-[#00000099]' : 'text-[#0000008C]'}`}
                          >
                            <div className="flex gap-[10px] relative">
                              <div className="sm:!w-[80px] !w-[70px] sm:!h-[80px] !h-[70px] rounded-[6px] relative overflow-hidden">
                                {mediaType === 'image' ? (
                                  <Image
                                    src={
                                      cartItem?.variant?.media
                                        ? cartItem?.variant?.media[0]?.url
                                        : ''
                                    }
                                    alt="cart image"
                                    className={`sm:!w-[80px] !w-[70px] sm:!h-[80px] !h-[70px] rounded-[6px] border border-[#00000014] object-fit ${cartItem.variant.status == 'OUT_OF_STOCK' ? 'greyscale' : ''}`}
                                  />
                                ) : (
                                  <VideoSrc
                                    className={`sm:!w-[80px] !w-[70px] sm:!h-[80px] !h-[70px] rounded-[6px] border border-[#00000014] object-fit ${cartItem.variant.status == 'OUT_OF_STOCK' ? 'greyscale' : ''}`}
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
                                className={`flex flex-col ${Object.keys(cartItem?.variant?.properties ?? {}).length > 2 ? 'gap-[2.8px]' : 'gap-[6px]'}`}
                              >
                                <p
                                  className={`font-semibold sm:text-[16px] text-[14px] sm:leading-[24px] leading-[22px] ${cartItem.variant.status === 'OUT_OF_STOCK' ? 'text-[#00000099]' : 'text-[#000000E0]'}`}
                                >
                                  {cartItem?.variant?.product?.name ||
                                    'Selected item'}{' '}
                                </p>
                                <p
                                  className={`font-normal ${Object.keys(cartItem?.variant?.properties ?? {}).length > 2 ? 'text-[13.5px] leading-[16px]' : 'text-[14px] leading-[16.94px]'}`}
                                >
                                  Quantity:{' '}
                                  {`${cartItem?.quantity} ${displayStockUnit(
                                    cartItem.variant.stockUnit
                                  )}${cartItem?.quantity > 1 ? 's' : ''}`}
                                </p>
                                {cartItem?.variant?.properties?.color && (
                                  <p
                                    className={`font-normal capitalize ${Object.keys(cartItem?.variant?.properties ?? {}).length > 2 ? 'text-[13.5px] leading-[16px]' : 'text-[14px] leading-[16.94px]'}`}
                                  >
                                    Color:{' '}
                                    {cartItem?.variant?.properties?.color[0] === '#' ? getClosestColorName(cartItem?.variant?.properties?.color) : cartItem?.variant?.properties?.color}
                                  </p>
                                )}
                                {cartItem?.variant?.size && (
                                  <p className="font-normal text-[13.5px] leading-[16px]">
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
                                        className="font-normal text-[13.5px] leading-[16px] capitalize"
                                      >
                                        {`${key}: ${Array.isArray(value) ? value.join(', ') : value}`}
                                      </p>
                                    );
                                  })}
                              </div>
                            </div>

                            {
                              <RxCross2
                                className="w-fit cursor-pointer text-[#DE3838]"
                                onClick={() => removeFromCart(cartItem.id)}
                              />
                            }
                          </div>

                          {cartItem?.userConfigurations &&
                            Object.keys(cartItem.userConfigurations).length >
                            0 && (
                              <div className="px-[12px] pb-[12px]">
                                <div className="pt-[10px] flex flex-col gap-[6px]">
                                  <div className="flex gap-[8px] flex-wrap relative">
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

                          <div className="px-[12px] pb-[12px] flex justify-between items-center">
                            <div className="flex md:items-center md:gap-[8px] md:flex-row flex-col">
                              <p
                                className={`font-semibold md:text-[20px] sm:text-[16px] text-[14px] md:leading-[28px] sm:leading-[24px] leading-[22px] ${cartItem.variant.status === 'OUT_OF_STOCK' ? 'text-[#00000099]' : ''}`}
                              >
                                {formatNumberAsPrice(linePrices.displayPrice)}
                              </p>
                              {linePrices.hasSlash && (
                                <div className="flex flex-wrap md:gap-[8px] gap-[4px] items-center">
                                  {getStrikethroughAmounts(linePrices).map(
                                    (amount, idx) => (
                                      <p
                                        key={idx}
                                        className={`font-normal md:text-[16px] sm:text-[12px] text-[10px] md:leading-[24px] sm:leading-[20px] leading-[18px] line-through text-[#00000099]  ${cartItem.variant.status === 'OUT_OF_STOCK' ? 'text-[#00000099]' : ''}`}
                                      >
                                        {formatNumberAsPrice(amount)}
                                      </p>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="border border-[#00000014] flex justify-between items-center  p-[4px] rounded-[100px] bg-[#F5F5F5] w-[150px]">
                              {cartItem.variant.status === 'OUT_OF_STOCK' ? (
                                <div className="text-[14px] grid font-normal text-[#00000099]  w-full">
                                  <span className="text-center">
                                    Out of stock
                                  </span>
                                </div>
                              ) : (
                                <>
                                  <span
                                    className="bg-white p-[6px] rounded-full flex flex-col items-center hover:cursor-pointer"
                                    onClick={() => decrement(cartItem)}
                                  >
                                    {cartItem?.quantity ===
                                      cartItem?.variant?.minPurchaseQuantity ? (
                                      <PiTrashSimple className="w-[20px] h-[20px] text-[#00000099]" />
                                    ) : (
                                      <PiMinus className="w-[20px] h-[20px] text-[#00000099]" />
                                    )}
                                  </span>
                                  <span className="grow font-medium leading-[19.36px] text-[16px]">
                                    {cartItem?.quantity}
                                  </span>
                                  <span
                                    className="bg-white p-[6px] rounded-full flex flex-col items-center hover:cursor-pointer"
                                    onClick={() => increment(cartItem)}
                                  >
                                    <PiPlus className="w-[20px] h-[20px] text-[#00000099]" />
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
                <div className="border-t border-[#00000014] flex flex-col p-[24px] gap-[16px] absolute bottom-0 left-0 w-full bg-white shadow-[0px_-2px_4px_#494F5E1F]">
                  <div className="flex flex-col gap-[6px]">
                    <p className="py-[12px] flex items-center justify-between text-[16px] leading-[24px]">
                      <span className="font-normal">Subtotal</span>
                      <span className="font-medium" key={cart.id}>
                        {shouldShowSubtotalLoader ? (
                          <div className="bg-[#00000014] w-[100px] h-[30px] rounded-[6px] animate-pulse"></div>
                        ) : (
                          formatNumberAsPrice(cart.totalDiscountedPrice)
                        )}
                        {/* {formatNumberAsPrice(cart?.cartItems
                          .filter(item => item.variant.status !== 'OUT_OF_STOCK')
                          .reduce((acc, item) => acc + item.totalPrice, 0))} */}
                        { }
                      </span>
                    </p>
                    <p className="font-normal text-[14px] leading-[22px] text-[#00000099]">
                      Shipping and taxes are calculated at checkout.
                    </p>
                  </div>
                  <button
                    className="bg-brand text-white py-[12px] px-[24px] rounded-[6px] leading-[19px] border border-none font-medium cursor-pointer w-full hover:bg-brand-hover transition-all duration-500 disabled:bg-[#676767]"
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
            className="relative cursor-pointer bg-[#F3F3F3] flex items-center gap-[8px] w-[70px] rounded-[6px] px-[5px] py-[5px]"
          >
            <p className="h-[30px] w-[30px] flex items-center justify-center bg-[#0357EE] rounded-[6px] text-white font-medium">
              <span>{cart.cartItems.length}</span>
            </p>
            <span
              className="cart-icon flex flex-col justify-center items-center"
              style={{ position: 'relative', display: '' }}
            >
              <PiShoppingCartBold className="text-black w-[18px] h-[18px]" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniCart;
