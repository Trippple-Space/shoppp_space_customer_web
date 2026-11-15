'use client';
import Image from '@/modules/lib/components/image/Image';
import React, { useEffect, useRef, useState } from 'react';
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar';
import Footer from '@/modules/lib/components/footer/Footer';
import useUserStore from '@/modules/lib/utility/store/user.store';
import { useCart } from '@/modules/lib/utility/hooks/use-cart';
import useAddressStore from '@/modules/lib/utility/store/address.store';
import useAddress from '@/modules/lib/utility/hooks/use-address';
import usePayment from '@/modules/lib/utility/hooks/use-payment';
import PuffLoader from '@/modules/lib/components/puff-loader/PuffLoader';
import {
  checkMediaType,
  displayStockUnit,
  formatNumberAsPrice,
  getClosestColorName,
} from '@/modules/lib/utility/utility';
import { PiCaretDown, PiCaretUp } from 'react-icons/pi';
import Link from 'next/link';
import DeliveryOptions from '@/modules/lib/components/delivery-options/DeliveryOptions';
import DeliveryMessage from '@/modules/lib/components/delivery-in-lagos/DeliveryMessage';
import { paths } from '@/modules/lib/utility/paths';
import AddressModal from '@/modules/lib/components/address-modal/AddressModal';
import OrderSummary from '@/modules/lib/components/order-summary/OrderSummary';
import { CartItem } from '@/modules/lib/utility/types/cart.interface';
import { useCalculatedeliveryFee } from '@/modules/lib/utility/hooks/use-calculate-deliveryFee';
import { DeliveryOption } from '@/modules/lib/utility/types/delivery.interface';
import { ShareLinkResponse } from '@/modules/lib/utility/types/payment.interface';
import VideoSrc from '@/modules/lib/components/video-src/VideoSrc';
import { toast } from 'sonner';
import { ConfigPill } from '@/modules/lib/components/product-detail-modal/productConfigurationsHelper';
import EmptyCheckout from './empty-checkout';
import { DotsLoader } from '@/modules/lib/components/dots-loader/DotsLoader';
import {
  MARKETPLACE_OPENS_DATE,
  MARKETPLACE_PURCHASES_ENABLED,
} from '@/modules/lib/utility/constants';
import { useCartStore } from '@/modules/lib/utility/store/cart.store';
import {
  getLineDisplayPrices,
  getStrikethroughAmounts,
} from '@/modules/lib/utility/visible-discount';

type DeliveryOptionKey = 'standard' | 'express' | 'vendorManaged';
type addressDeliveryPrice = {
  addressId: string;
  deliveryOptions: DeliveryOption;
  coordinates: {
    lat: string;
    lon: string;
  };
};

const CheckoutPage = () => {
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption>({
    standard: {
      title: 'Standard Delivery',
      available: true,
      description: '1-3 working days',
      etaInDays: 3,
      price: NaN,
      error: null,
      message: null,
    },
    express: {
      title: 'Same Day Delivery',
      available: true,
      description: 'within 24 hours',
      etaInDays: 1,
      price: NaN,
      error: null,
      message: null,
    },
    vendorManaged: {
      title: 'Vendor Managed Delivery',

      pickup: [
        {
          status: null,
          storeId: '',
          storeName: '',
        },
      ],

      vendorManaged: [
        {
          fee: 0,
          status: null,
          storeId: '',
          storeName: '',
          estimatedTime: null,
        },
      ],
      vendorManagedTotal: 0,
    },
  });
  const [allAddressDeliveryPrice, setAllAddressDeliveryPrice] = useState<
    addressDeliveryPrice[]
  >([]);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<
    keyof typeof deliveryOptions | null
  >(null);
  const { user, isAuthenticated } = useUserStore();
  const isLoginModal = useCartStore((state) => state.isLoginModal);
  const { cart, removeFromCart, removeDiscountCode, fetchCart, fetching } =
    useCart();
  const { openAddressModal, selectedAddress } = useAddress();
  const { fetchAddresses } = useAddressStore();
  const {
    loading: isPaymentLoading,
    sharing: isSharingPaymentLink,
    payWithPaystack,
    sharePaymentLink,
  } = usePayment();
  const { calculateFee } = useCalculatedeliveryFee();
  const [calculatingFee, setCalculatingFee] = useState<boolean>(true);
  const selectedDeliveryOptionDetails = selectedDeliveryOption
    ? deliveryOptions[selectedDeliveryOption]
    : null;
  const formReadyForPayment =
    !isPaymentLoading &&
    selectedAddress &&
    user &&
    !calculatingFee &&
    selectedDeliveryOptionDetails !== null &&
    'price' in selectedDeliveryOptionDetails &&
    !isNaN(selectedDeliveryOptionDetails.price);
  const canProceedToPayment =
    !MARKETPLACE_PURCHASES_ENABLED || !formReadyForPayment;
  const [devOptions, setDevOptions] = useState<string>();
  const [showSummary, setshowSummary] = useState(false);
  const [devAddressError, setDevAddressError] = useState(false);
  const [enableOrderWhatsApp, setEnableOrderWhatsApp] = useState(true);
  const [orderWhatsAppNumber, setOrderWhatsAppNumber] = useState('');
  const [orderWhatsAppError, setOrderWhatsAppError] = useState('');
  const [cachedShareLinkResponse, setCachedShareLinkResponse] =
    useState<ShareLinkResponse | null>(null);

  const [shouldUpdateFee, setShouldUpdateFee] = useState(false);
  const lastAddressRef = useRef<string | null>(null);
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);

  const [allCartItems, setAllCartItems] = useState({
    ...cart,
    storeGroups: cart.storeGroups.map((group) => {
      return {
        ...group,
        visible: true,
      };
    }),

    visible: true,
  });

  useEffect(() => {
    const updatedCart = {
      ...cart,
      storeGroups: cart.storeGroups.map((group) => {
        return {
          ...group,
          visible: true,
        };
      }),
      visible: true,
      showDiscountInput: false,
    };
    setAllCartItems(updatedCart);
  }, [cart]);

  const setStoreAccordion = (i: number) => {
    setAllCartItems((prevItems) => ({
      ...prevItems,
      storeGroups: prevItems.storeGroups.map((group, index) => {
        if (index === i) {
          return {
            ...group,
            visible: !group.visible,
          };
        }
        return group;
      }),
    }));
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchAddresses(user.id);
  }, [user?.id, fetchAddresses]);

  useEffect(() => {
    const checkScreenWidth = () => {
      setDevOptions(window.innerWidth >= 768 ? 'larger' : 'smaller');
    };
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
    return () => window.removeEventListener('resize', checkScreenWidth);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      removeDiscountCode();
    }
    fetchCart(true);
  }, [isAuthenticated]);

  const updateFees = async () => {
    if (selectedAddress && allCartItems.cartItems.length > 0) {
      const getLatLon = (meta: any) => {
        if (meta?.coordinates) {
          return {
            lat: meta.coordinates.lat,
            lon: meta.coordinates.lon,
          };
        } else if (meta?.location) {
          return {
            lat: meta.location.latitude,
            lon: meta.location.longitude,
          };
        }
        return { lat: null, lon: null };
      };

      const selectedType: DeliveryOptionKey = 'standard';

      let updatedOptions = { ...deliveryOptions };
      const { lat, lon } = getLatLon(selectedAddress.meta);

      const existingAddressPrice = allAddressDeliveryPrice.find(
        (addressPrice) => addressPrice.addressId === selectedAddress.id
      );
      if (
        existingAddressPrice &&
        existingAddressPrice.coordinates.lat === lat &&
        existingAddressPrice.coordinates.lon === lon
      ) {
        setDeliveryOptions(existingAddressPrice.deliveryOptions);
      } else {
        try {
          setCalculatingFee(true);
          const feeDetail = await calculateFee({
            addressId: selectedAddress.id,
            deliveryType: selectedType,
          });

          updatedOptions = {
            standard: {
              ...deliveryOptions.standard,
              ...feeDetail.standard,
              price: feeDetail.standard?.fee ?? NaN,
              error: feeDetail.standard?.error ?? null,
              message: feeDetail.standard?.message ?? null,
              available: feeDetail.standard?.available ?? false,
            },

            express: {
              ...deliveryOptions.express,
              ...feeDetail.express,
              price: feeDetail.express?.fee ?? NaN,
              error: feeDetail.express?.error ?? null,
              message: feeDetail.express?.message ?? null,
              available: feeDetail.express?.available ?? false,
            },

            vendorManaged: {
              ...deliveryOptions.vendorManaged,
              pickup: feeDetail.vendorManaged?.pickup ?? [],
              vendorManaged: feeDetail.vendorManaged?.vendorManaged ?? [],
              vendorManagedTotal:
                feeDetail.vendorManaged?.vendorManagedTotal ?? 0,
            },
          };
        } catch (error) {
        } finally {
          setDeliveryOptions(updatedOptions);
          setAllAddressDeliveryPrice((prev) =>
            prev.some((item) => item.addressId === selectedAddress.id)
              ? prev.map((item) =>
                item.addressId === selectedAddress.id
                  ? {
                    addressId: selectedAddress.id,
                    deliveryOptions: updatedOptions,
                    coordinates: {
                      lat,
                      lon,
                    },
                  }
                  : item
              )
              : [
                ...prev,
                {
                  addressId: selectedAddress.id,
                  deliveryOptions: updatedOptions,
                  coordinates: {
                    lat,
                    lon,
                  },
                },
              ]
          );
          setCalculatingFee(false);
        }
      }
    }
  };

  useEffect(() => {
    if (!selectedAddress) return;

    const addressChanged = lastAddressRef.current !== selectedAddress.id;

    if (addressChanged || shouldUpdateFee) {
      lastAddressRef.current = selectedAddress.id;
      updateFees();
      if (shouldUpdateFee) setShouldUpdateFee(false);
    }
  }, [selectedAddress, shouldUpdateFee]);

  useEffect(() => {
    if (!selectedAddress || !enableOrderWhatsApp) return;
    setOrderWhatsAppNumber(selectedAddress.contactNo || '');
    setOrderWhatsAppError('');
  }, [selectedAddress?.id, selectedAddress?.contactNo, enableOrderWhatsApp]);

  useEffect(() => {
    setCachedShareLinkResponse(null);
  }, [
    selectedAddress?.id,
    selectedDeliveryOption,
    cart.total,
    cart.cartItems.length,
  ]);

  const isValidOrderWhatsAppNumber = (value: string) => {
    const normalized = value.replace(/[^\d+]/g, '').trim();
    return /^\+?\d{10,15}$/.test(normalized);
  };

  const hasItems =
    cart && Array.isArray(cart.cartItems) && cart.cartItems.length > 0;

  return (
    <>
      <HomepageNavBar parent={'checkout'} />
      <div className="md:pt-[69.6px] pt-[74.6px] sm:mb-[60px] mb-[111px] overflow-hidden" style={{ height: 'calc(100dvh)' }}>
        {fetching ? (
          <div
            className="w-full flex flex-col items-center justify-center mt-[10px]"
            style={{ height: 'calc(100dvh - 146px)' }}
          >
            <DotsLoader />
          </div>
        ) : !user || !hasItems ? (
          <EmptyCheckout />
        ) : (
          <>
            <DeliveryMessage />
            <div
              className="md:flex overflow-hidden"
              style={{ height: 'calc(100dvh - 146px)' }}
            >
              <div
                ref={rightScrollRef}
                className={`grow lg:w-[54.2%] md:w-[50%] h-full overflow-auto no-scrollbar md:pt-[44px] sm:pt-[32px] pt-[24px] xl:pl-[80px] lg:pl-[70px] md:pl-[60px] sm:pl-[40px] pl-[24px] xl:pr-[80px] lg:pr-[70px] sm:pr-[40px] pr-[24px] flex flex-col gap-[28px] bg-white md:pb-[90px] ${showSummary ? `${selectedAddress ? 'md:pb-[320px] sm:pb-[370px] pb-[410px]' : 'md:pb-[200px] sm:pb-[240px] pb-[327px]'}` : 'md:pb-[99px] sm:pb-[121px] pb-[217px]'}`}
              >
                <div className="flex flex-col gap-[6px]">
                  <h1 className="font-semibold md:text-[24px] text-[20px] md:leading-[32px] leading-[28px]">
                    Order Summary
                  </h1>
                  <p className="font-normal text-[16px] leading-[24px]">
                    Check your item and add your delivery address for better
                    delivery experience.
                  </p>
                </div>

                <div className="flex flex-col gap-[8px]">
                  <div
                    className={`py-[20px] px-[24px] border flex flex-col gap-[24px] rounded-[8px] ${devAddressError ? 'border-[#D4280C] border-[2px]' : 'border-[#00000014]'}`}
                  >
                    <h2 className="text-[#000000E0] md:text-[20px] text-[16px] font-semibold leading-[24px]">
                      Delivery address
                    </h2>

                    <div className="flex lg:flex-row md:flex-col sm:flex-row flex-col lg:justify-between md:justify-start sm:justify-between lg:items-center md:items-start sm:items-center lg:gap-0 md:gap-[16px] sm:gap-0 gap-[16px]">
                      {selectedAddress && (
                        <div className="flex flex-col gap-[4px]">
                          <p className="font-normal text-[16px] leading-[24px] text-[#00000099]">
                            {selectedAddress?.contactNo}
                            {selectedAddress?.secondaryContactNo && ', '}
                            {selectedAddress?.secondaryContactNo}
                          </p>
                          <p className="font-normal text-[16px] leading-[24px] text-[#00000099]">
                            {selectedAddress?.address}, {selectedAddress?.city},{' '}
                            {selectedAddress?.state}
                          </p>
                          {selectedAddress?.notes && (
                            <p className="font-normal text-[16px] leading-[24px] text-[#00000099]">
                              Delivery note: {selectedAddress?.notes}
                            </p>
                          )}
                        </div>
                      )}

                      <p
                        className="text-[16px] leading-[24px] font-medium text-[#1677FF] underline cursor-pointer w-fit"
                        onClick={() => {
                          openAddressModal();
                          setDevAddressError(false);
                        }}
                      >
                        {selectedAddress ? 'Change' : 'Add delivery address'}
                      </p>
                    </div>
                  </div>
                  {devAddressError && (
                    <p className="font-normal text-[14px] leading-[22px] text-[#D4280C]">
                      Delivery address is required!
                    </p>
                  )}
                </div>

                {
                  selectedAddress && (
                    <div className="py-[20px] px-[24px] border border-[#00000014] flex flex-col gap-[14px] rounded-[8px]">
                      <h2 className="text-[#000000E0] md:text-[20px] text-[16px] font-semibold leading-[24px]">
                        WhatsApp updates for this order
                      </h2>
                      <label className="flex gap-[10px] items-start cursor-pointer w-fit">
                        <input
                          type="checkbox"
                          checked={enableOrderWhatsApp}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setEnableOrderWhatsApp(checked);
                            if (!checked) {
                              setOrderWhatsAppError('');
                            } else if (!orderWhatsAppNumber && selectedAddress) {
                              setOrderWhatsAppNumber(selectedAddress.contactNo || '');
                            }
                          }}
                          className="mt-[4px] accent-[#0357EE]"
                        />
                        <span className="font-normal text-[14px] leading-[22px] text-[#00000099]">
                          Send WhatsApp notifications for this order.
                        </span>
                      </label>
                      {enableOrderWhatsApp && (
                        <div className="flex flex-col gap-[6px]">
                          <input
                            type="tel"
                            value={orderWhatsAppNumber}
                            onChange={(e) => {
                              setOrderWhatsAppNumber(e.target.value);
                              if (orderWhatsAppError) setOrderWhatsAppError('');
                            }}
                            placeholder="Enter WhatsApp number"
                            className="w-full border border-[#0000001F] focus:border-[#0357EE] outline-none rounded-[6px] px-[12px] py-[10px] text-[14px] leading-[22px]"
                          />
                          <p className="font-normal text-[12px] leading-[18px] text-[#00000099]">
                            Use a different number only if needed.
                          </p>
                          {orderWhatsAppError && (
                            <p className="font-normal text-[14px] leading-[22px] text-[#D4280C]">
                              {orderWhatsAppError}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                }

                {devOptions === 'smaller' && (
                  <DeliveryOptions
                    deliveryOptions={deliveryOptions}
                    selectedDeliveryOption={selectedDeliveryOption}
                    setSelectedDeliveryOption={setSelectedDeliveryOption}
                    loading={!!(calculatingFee || !selectedAddress)}
                    retry={() => {
                      setAllAddressDeliveryPrice([]);
                      setShouldUpdateFee(true);
                      setSelectedDeliveryOption(null);
                    }}
                    selectedAddress={selectedAddress}
                  />
                )}

                <div className="md:hidden block">
                  <div className="py-[16px] px-[20px] rounded-[8px] border border-[#F59E0B33] bg-[#FFFBEB] flex flex-col gap-[6px]">
                    <h2 className="text-[16px] leading-[24px] font-semibold text-[#92400E]">
                      Return policy
                    </h2>
                    <p className="text-[14px] leading-[22px] font-normal text-[#B45309]">
                      Please inspect your order upon delivery. Returns can only be made while the rider is still present, and cannot be processed once the rider leaves.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-[14px]">
                  {allCartItems.storeGroups?.map((store, i: number) => (
                    <div className="flex flex-col gap-[16px]" key={i}>
                      {store.items.length > 0 && (
                        <div className="flex justify-between items-center">
                          <h6
                            className="text-[14px] font-normal leading-[22px] text-[#00000099] cursor-pointer"
                            onClick={() => {
                              setStoreAccordion(i);
                            }}
                          >
                            {store?.store.name}
                          </h6>
                          {store.visible ? (
                            <PiCaretDown
                              className="w-[18px] h-[18px] cursor-pointer"
                              onClick={() => setStoreAccordion(i)}
                            />
                          ) : (
                            <PiCaretUp
                              className="w-[18px] h-[18px] cursor-pointer"
                              onClick={() => setStoreAccordion(i)}
                            />
                          )}
                        </div>
                      )}
                      {store.items.length > 0 &&
                        store.items.map((cartItem: any, j: number) => {
                          const linePrices = getLineDisplayPrices({
                            totalPrice: Number(cartItem?.totalPrice ?? 0),
                            discountedPrice: Number(cartItem?.discountedPrice ?? 0),
                            variant: cartItem?.variant,
                          });
                          const mediaType =
                            checkMediaType(cartItem.variant.media?.[0].url) ??
                            'image';

                          return (
                            <div
                              className="flex flex-col gap-[4px]"
                              key={j + cartItem?.id}
                            >
                              <div
                                className={`gap-[12px] ${store.visible ? 'flex items-start' : 'hidden'}`}
                                key={j}
                              >
                                <div className="w-[73px] h-[75px] min-w-[73px] min-h-[75px] rounded-[6px] relative overflow-hidden">
                                  {mediaType === 'image' ? (
                                    <Image
                                      src={cartItem.variant.media?.[0].url}
                                      alt="order image"
                                      className="w-[73px] h-[75px] min-w-[73px] min-h-[75px] rounded-[6px] border border-[#00000014] object-fit"
                                    />
                                  ) : (
                                    <VideoSrc
                                      className="w-[73px] h-[75px] min-w-[73px] min-h-[75px] rounded-[6px] border border-[#00000014] object-fit"
                                      src={cartItem.variant.media?.[0].url}
                                      hasLoader={true}
                                    />
                                  )}
                                </div>
                                <div
                                  className={`min-w-0 grow flex flex-col ${Object.keys(cartItem?.variant?.properties ?? {}).length > 2 ? 'gap-[2.8px]' : 'gap-[6px]'} overflow-hidden white-space-nowrap text-overflow-ellipsis`}
                                >
                                  <p className="min-w-0 w-full truncate font-semibold text-[14px] leading-[22px] text-[#000000E0]">
                                    {cartItem?.variant?.product?.name}
                                  </p>
                                  <p
                                    className={`font-normal text-[#0000008C] ${Object.keys(cartItem?.variant?.properties ?? {}).length > 2 ? 'text-[13.5px] leading-[16px]' : 'text-[14px] leading-[16.94px]'}`}
                                  >
                                    Quantity:{' '}
                                    {`${cartItem?.quantity} ${displayStockUnit(
                                      cartItem.variant.stockUnit
                                    )}${cartItem?.quantity > 1 ? 's' : ''}`}
                                  </p>
                                  {cartItem?.variant?.properties?.color && (
                                    <p
                                      className={`font-normal text-[#0000008C] capitalize ${Object.keys(cartItem?.variant?.properties ?? {}).length > 2 ? 'text-[13.5px] leading-[16px]' : 'text-[14px] leading-[16.94px]'}`}
                                    >
                                      Color:{' '}
                                      {cartItem?.variant?.properties?.color[0] === '#' ? getClosestColorName(cartItem?.variant?.properties?.color) : cartItem?.variant?.properties?.color}
                                    </p>
                                  )}
                                  {cartItem?.variant?.size && (
                                    <p className="font-normal text-[13.5px] leading-[16px] text-[#0000008C]">
                                      Size: {cartItem?.variant?.size}
                                    </p>
                                  )}

                                  {cartItem?.variant?.properties &&
                                    Object.entries(
                                      cartItem.variant?.properties ?? {}
                                    ).map(([key, value]) => {
                                      if (
                                        key === 'color' ||
                                        key === 'size' ||
                                        value === null ||
                                        value === undefined ||
                                        (typeof value === 'string' &&
                                          value.trim() === '') ||
                                        (Array.isArray(value) &&
                                          value.filter(
                                            (v) =>
                                              String(v ?? '').trim() !== ''
                                          ).length === 0) ||
                                        (typeof value === 'object' &&
                                          !Array.isArray(value) &&
                                          Object.keys(value).length === 0)
                                      )
                                        return null;
                                      return (
                                        <p
                                          key={key}
                                          className="font-normal text-[13.5px] leading-[16px] capitalize text-[#0000008C]"
                                        >
                                          {`${key}: ${Array.isArray(value) ? value.join(', ') : value}`}
                                        </p>
                                      );
                                    })}
                                </div>
                                <div className="flex flex-col gap-[10px] items-end">
                                  <div className="flex sm:flex-row flex-col sm:items-center items-end gap-[8px]">
                                    <p
                                      className={`font-semibold md:text-[20px] sm:text-[16px] text-[14px] md:leading-[28px] sm:leading-[24px] leading-[22px] ${cartItem.variant.status === 'OUT_OF_STOCK' ? 'text-[#00000099]' : ''}`}
                                    >
                                      {formatNumberAsPrice(linePrices.displayPrice)}
                                    </p>
                                    {linePrices.hasSlash && (
                                      <div className="flex flex-wrap gap-[6px] items-center">
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
                                  <p
                                    className="font-normal text-[14px] leading-[22px] text-danger underline cursor-pointer"
                                    onClick={async () => {
                                      try {
                                        await removeFromCart(cartItem?.id);
                                        setAllAddressDeliveryPrice([]);
                                        setCachedShareLinkResponse(null);
                                        //setShouldUpdateFee(true);
                                      } catch (error) { }
                                    }}
                                  >
                                    Remove
                                  </p>
                                </div>
                              </div>

                              {cartItem?.userConfigurations &&
                                store.visible &&
                                Object.keys(cartItem.userConfigurations)
                                  .length > 0 && (
                                  <div className="pb-[12px]">
                                    <div className="pt-[10px] flex flex-col gap-[6px]">
                                      <div className="flex gap-[8px] flex-wrap relative">
                                        {Object.entries(
                                          cartItem.userConfigurations
                                        ).map(([recordName, recordValue]) => {
                                          if (
                                            !recordValue ||
                                            typeof recordValue !== 'object' ||
                                            Object.keys(recordValue).length ===
                                            0
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
                            </div>
                          );
                        })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative bg-[#F5F5F5] lg:w-[45.8%] md:w-[50%] max-w-[661px]">
                <div
                  ref={leftScrollRef}
                  className={`md:h-full overflow-auto no-scrollbar bg-[#F5F5F5] md:pt-[44px] md:pb-[85px] xl:pl-[80px] lg:pl-[70px] md:pl-[40px] xl:pr-[80px] lg:pr-[70px] md:pr-[60px] flex flex-col gap-[16px] ${devOptions === 'smaller' ? 'fixed left-0 right-0 bottom-0 z-[4px]' : ''}`}
                >
                  {devOptions === 'larger' && (
                    <DeliveryOptions
                      deliveryOptions={deliveryOptions}
                      selectedDeliveryOption={selectedDeliveryOption}
                      setSelectedDeliveryOption={setSelectedDeliveryOption}
                      loading={!!(calculatingFee || !selectedAddress)}
                      retry={() => {
                        setAllAddressDeliveryPrice([]);
                        setShouldUpdateFee(true);
                        setSelectedDeliveryOption(null);
                      }}
                      selectedAddress={selectedAddress}
                    />
                  )}

                  <div className="md:py-[20px] py-[12px] md:px-[24px] sm:px-[40px] px-[24px] md:border border-t border-[#00000014] md:bg-white bg-[#F5F5F5] md:rounded-[8px] flex flex-col sm:gap-[24px] gap-[20px]">
                    <h2 className="text-[#000000E0] text-[20px] leading-[28px] font-semibold md:block hidden">
                      Payment Summary
                    </h2>
                    <div
                      className={`${showSummary ? 'block mt-[40px]' : 'md:block hidden'}`}
                    >
                      <OrderSummary
                        subTotal={cart.subTotal}
                        shippingFee={
                          selectedAddress &&
                            selectedDeliveryOptionDetails &&
                            'price' in selectedDeliveryOptionDetails
                            ? selectedDeliveryOptionDetails.price
                            : undefined
                        }
                        total={
                          selectedAddress
                            ? cart.total +
                            (selectedDeliveryOptionDetails &&
                              'price' in selectedDeliveryOptionDetails &&
                              typeof selectedDeliveryOptionDetails.price ===
                              'number'
                              ? selectedDeliveryOptionDetails.price
                              : 0)
                            : ''
                        }
                        cart={cart}
                        loading={calculatingFee}
                      />
                    </div>
                    <div className="flex sm:flex-row flex-col sm:gap-0 gap-[20px] justify-between items-center">
                      <div
                        className={`absolute top-0 sm:w-fit w-full sm:px-0 px-[24px] bg-[#F5F5F5] pt-[12px] md:hidden block ${showSummary ? 'pt-[22px]' : ''}`}
                      >
                        <p
                          className={`md:hidden flex gap-[12px] items-center text-[#00000099] sm:w-fit w-full justify-between cursor-pointer ${showSummary && 'border-b border-b-[#00000014] sm:border-b-[#F5F5F5] pb-[20px] sm:pb-0'}`}
                          onClick={() => setshowSummary(!showSummary)}
                        >
                          <span className="text-[16px] font-normal leading-[24px]">
                            {showSummary
                              ? 'Hide payment summary'
                              : 'Show payment summary'}
                          </span>
                          {showSummary ? (
                            <PiCaretDown className="w-[20px] h-[20px] mt-[4px]" />
                          ) : (
                            <PiCaretUp className="w-[20px] h-[20px] mt-[6px]" />
                          )}
                        </p>
                      </div>
                      <div className="flex flex-col gap-[12px] w-full sm:w-auto sm:items-end">
                        {!MARKETPLACE_PURCHASES_ENABLED && (
                          <p className="text-[14px] leading-[20px] font-medium text-[#0357EE] text-center sm:text-right">
                            Marketplace opens officially by {MARKETPLACE_OPENS_DATE}. Purchases are not available yet.
                          </p>
                        )}
                        <div className="flex flex-col gap-[12px] items-end sm:justify-end w-full">
                          {!showSummary && (
                            <span className="md:hidden sm:block hidden sm:font-semibold font-bold sm:text-[16px] text-[14px] sm:leading-[22px] leading-[19px]">
                              {formatNumberAsPrice(
                                cart.total +
                                (selectedDeliveryOptionDetails &&
                                  'price' in selectedDeliveryOptionDetails &&
                                  typeof selectedDeliveryOptionDetails.price ===
                                  'number'
                                  ? selectedDeliveryOptionDetails.price
                                  : 0)
                              )}
                            </span>
                          )}
                          <div className="md:block hidden">
                            <div className="py-[16px] px-[20px] rounded-[8px] border border-[#F59E0B33] bg-[#FFFBEB] flex flex-col gap-[6px]">
                              <h2 className="text-[16px] leading-[24px] font-semibold text-[#92400E]">
                                Return policy
                              </h2>
                              <p className="text-[14px] leading-[22px] font-normal text-[#B45309]">
                                Please inspect your order upon delivery. Returns can only be made while the rider is still present, and cannot be processed once the rider leaves.
                              </p>
                            </div>
                          </div>
                          <div className="flex md:flex-col sm:flex-row flex-col gap-[14px] items-center md:justify-end justify-between w-full">
                            <button
                              onClick={() => {
                                if (!isAuthenticated) {
                                  if (typeof window !== 'undefined') {
                                    sessionStorage.setItem(
                                      'post-auth-redirect',
                                      paths.checkout
                                    );
                                  }
                                  isLoginModal();
                                  return;
                                }
                                if (!MARKETPLACE_PURCHASES_ENABLED) return;
                                if (canProceedToPayment) {
                                  if (!selectedAddress) {
                                    setDevAddressError(true);
                                    rightScrollRef.current?.scrollTo({
                                      top: 0,
                                      behavior: 'smooth',
                                    });
                                    toast.error(
                                      'You need to add a delivery address to continue to payment.'
                                    );
                                  } else if (!selectedDeliveryOption) {
                                    leftScrollRef.current?.scrollTo({
                                      top: 0,
                                      behavior: 'smooth',
                                    });
                                    rightScrollRef.current?.scrollTo({
                                      top: 300,
                                      behavior: 'smooth',
                                    });
                                    toast.error(
                                      'You need to select a delivery option to continue to payment.'
                                    );
                                  }
                                } else {
                                  if (selectedDeliveryOption !== null) {
                                    if (enableOrderWhatsApp) {
                                      if (!orderWhatsAppNumber.trim()) {
                                        setOrderWhatsAppError(
                                          'Please enter a WhatsApp number for this order.'
                                        );
                                        toast.error(
                                          'Please enter a WhatsApp number for this order.'
                                        );
                                        return;
                                      }
                                      if (!isValidOrderWhatsAppNumber(orderWhatsAppNumber)) {
                                        setOrderWhatsAppError(
                                          'Please enter a valid WhatsApp number.'
                                        );
                                        toast.error('Please enter a valid WhatsApp number.');
                                        return;
                                      }
                                    }
                                    payWithPaystack({
                                      addressId: selectedAddress?.id,
                                      deliveryOption: selectedDeliveryOption,
                                      customerWhatsAppOptIn: enableOrderWhatsApp,
                                      customerWhatsAppNumber: enableOrderWhatsApp
                                        ? orderWhatsAppNumber.trim()
                                        : undefined,
                                    });
                                  }
                                }
                              }}
                              className={`w-full border-none md:flex text-white md:text-[16px] text-[14px] font-medium md:leading-[22px] leading-[19px] md:px-[24px] px-[16px] py-[12px] rounded-[6px] lg:float-right justify-center ${!showSummary && 'sm:mt-0 mt-[56px]'} ${canProceedToPayment ? 'bg-[#D1D5DB] opacity-80 shadow-[inset_0px_2px_4px_#0000001A] text-[#6B7280] cursor-not-allowed' : 'bg-[#0357EE] cursor-pointer'}`}
                              title={
                                !MARKETPLACE_PURCHASES_ENABLED
                                  ? `Purchases available from ${MARKETPLACE_OPENS_DATE}`
                                  : selectedAddress
                                    ? ''
                                    : 'Add an address to proceed to payment'
                              }
                            >
                              <span className="">
                                Proceed to payment{' '}
                                {!showSummary && (
                                  <span className="sm:hidden font-bold">
                                    (
                                    {formatNumberAsPrice(
                                      cart.total +
                                      (selectedDeliveryOptionDetails &&
                                        'price' in selectedDeliveryOptionDetails &&
                                        typeof selectedDeliveryOptionDetails.price ===
                                        'number'
                                        ? selectedDeliveryOptionDetails.price
                                        : 0)
                                    )}
                                    )
                                  </span>
                                )}
                              </span>
                              <PuffLoader
                                size={15}
                                loading={isPaymentLoading}
                                className="ml-[10px]"
                              />
                            </button>

                            <button
                              onClick={async () => {
                                if (!isAuthenticated) {
                                  if (typeof window !== 'undefined') {
                                    sessionStorage.setItem(
                                      'post-auth-redirect',
                                      paths.checkout
                                    );
                                  }
                                  isLoginModal();
                                  return;
                                }
                                if (canProceedToPayment || selectedDeliveryOption === null) return;
                                if (enableOrderWhatsApp) {
                                  if (!orderWhatsAppNumber.trim()) {
                                    setOrderWhatsAppError(
                                      'Please enter a WhatsApp number for this order.'
                                    );
                                    toast.error(
                                      'Please enter a WhatsApp number for this order.'
                                    );
                                    return;
                                  }
                                  if (!isValidOrderWhatsAppNumber(orderWhatsAppNumber)) {
                                    setOrderWhatsAppError(
                                      'Please enter a valid WhatsApp number.'
                                    );
                                    toast.error('Please enter a valid WhatsApp number.');
                                    return;
                                  }
                                }
                                if (cachedShareLinkResponse?.shareToken) {
                                  const shareLink = `${window.location.origin}/pay/${cachedShareLinkResponse.shareToken}`;
                                  if (typeof navigator.share === 'function') {
                                    try {
                                      await navigator.share({
                                        title: 'Shoppp checkout payment link',
                                        text: 'Complete this order payment using the link below.',
                                        url: shareLink,
                                      });
                                      return;
                                    } catch (error) {
                                      const shareError = error as { name?: string };
                                      if (shareError?.name === 'AbortError') {
                                        return;
                                      }
                                    }
                                  }

                                  await navigator.clipboard.writeText(shareLink);
                                  toast.success('Payment link copied to clipboard');
                                  return;
                                }

                                const shareResponse = await sharePaymentLink({
                                  addressId: selectedAddress?.id,
                                  deliveryOption: selectedDeliveryOption,
                                  customerWhatsAppOptIn: enableOrderWhatsApp,
                                  customerWhatsAppNumber: enableOrderWhatsApp
                                    ? orderWhatsAppNumber.trim()
                                    : undefined,
                                });
                                if (shareResponse) {
                                  setCachedShareLinkResponse(shareResponse);
                                }
                              }}
                              disabled={canProceedToPayment || isSharingPaymentLink}
                              className={`w-full border md:text-[16px] text-[14px] font-medium md:leading-[22px] leading-[19px] md:px-[24px] px-[16px] py-[12px] rounded-[6px] md:flex items-center justify-center gap-[8px] lg:float-right ${canProceedToPayment || isSharingPaymentLink ? 'border-[#D1D5DB] text-[#9CA3AF] bg-[#F9FAFB] cursor-not-allowed' : 'border-[#0357EE] text-[#0357EE] bg-white cursor-pointer hover:bg-[#F0FDF9]'}`}
                              title={
                                canProceedToPayment
                                  ? 'Complete checkout details to share payment link'
                                  : 'Copy share payment link'
                              }
                            >
                              <span>Share payment link</span>
                              <PuffLoader
                                size={14}
                                loading={isSharingPaymentLink}
                                className={isSharingPaymentLink ? 'ml-[4px]' : 'hidden'}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-[16px] leading-[24px] font-normal text-center md:block hidden">
                      By clicking place order, you confirmed you have read and
                      acknowledge{' '}
                      <Link href={'/checkout'} className="text-[#1677FF]">
                        all terms and policies.
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
      <AddressModal />
    </>
  );
};

export default CheckoutPage;
