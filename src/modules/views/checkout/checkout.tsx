'use client';
import Image from '@/modules/lib/components/image/Image';
import React, { useEffect, useRef, useState } from 'react';
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar';
import { useRouter } from 'next/navigation';
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
import VideoSrc from '@/modules/lib/components/video-src/VideoSrc';
import { toast } from 'sonner';

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
  const { cart, removeFromCart, removeDiscountCode, fetchCart } = useCart();
  const { openAddressModal, selectedAddress } = useAddress();
  const router = useRouter();
  const { fetchAddresses } = useAddressStore();
  const { loading: isPaymentLoading, payWithPaystack } = usePayment();
  const { calculateFee } = useCalculatedeliveryFee();
  const [calculatingFee, setCalculatingFee] = useState<boolean>(true);
  const selectedDeliveryOptionDetails = selectedDeliveryOption
    ? deliveryOptions[selectedDeliveryOption]
    : null;
  const canProceedToPayment = !(
    !isPaymentLoading &&
    selectedAddress &&
    user &&
    !calculatingFee &&
    selectedDeliveryOptionDetails !== null &&
    'price' in selectedDeliveryOptionDetails &&
    !isNaN(selectedDeliveryOptionDetails.price)
  );
  const [devOptions, setDevOptions] = useState<string>();
  const [showSummary, setshowSummary] = useState(true);
  const [devAddressError, setDevAddressError] = useState(false);

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
    if (user) {
      fetchAddresses(user?.id);
      if (cart.cartItems.length === 0) {
        router.push(paths.homepage);
      }
    }
  }, [cart]);

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
      fetchCart(true);
    }
  }, []);

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

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(paths.homepage);
    }
  }, []);

  return (
    <>
      <HomepageNavBar parent={'checkout'} />
      <div className="md:pt-69.6 pt-64 sm:mb-60 mb-111 h-full">
        <DeliveryMessage />
        <div
          className="md:flex overflow-hidden"
          style={{ height: 'calc(100dvh - 146px)' }}
        >
          <div
            ref={rightScrollRef}
            className={`flex-grow-1 l:w-54.2p md:w-50p h-full overflow-auto no-scrollbar md:pt-44 sm:pt-32 pt-24 xl:pl-80 l:pl-70 md:pl-60 sm:pl-40 pl-24 xl:pr-80 l:pr-70 sm:pr-40 pr-24 flex flex-col gap-28 bg-white md:pb-90 ${showSummary ? `${selectedAddress ? 'sm:pb-320 pb-350' : 'sm:pb-200 pb-247'}` : 'sm:pb-99 pb-147'}`}
          >
            <div className="flex flex-col gap-6">
              <h1 className="weight-600 md:text-24 text-20 md:line-height-32 line-heigth-28">
                Order Summary
              </h1>
              <p className="weight-400 text-16 line-height-24">
                Check your item and add your delivery address for better
                delivery experience.
              </p>
            </div>

            <div className="flex flex-col gap-8">
              <div
                className={`py-20 px-24 border flex flex-col gap-24 radius-8 ${devAddressError ? 'border-#D4280C border-2' : 'border-#00000014'}`}
              >
                <h2 className="color-#000000E0 md:text-20 text-16 weight-600 line-height-24">
                  Delivery address
                </h2>

                <div className="flex l:flex-row md:flex-col sm:flex-row flex-col l:space-between md:j-content-start sm:space-between l:a-items-center md:a-items-start sm:a-items-center l:gap-0 md:gap-16 sm:gap-0 gap-16">
                  {selectedAddress && (
                    <div className="flex flex-col gap-4">
                      <p className="weight-400 text-16 line-height-24 color-#00000099">
                        {selectedAddress?.contactNo}
                        {selectedAddress?.secondaryContactNo && ', '}
                        {selectedAddress?.secondaryContactNo}
                      </p>
                      <p className="weight-400 text-16 line-height-24 color-#00000099">
                        {selectedAddress?.address}, {selectedAddress?.city},{' '}
                        {selectedAddress?.state}
                      </p>
                      {selectedAddress?.notes && (
                        <p className="weight-400 text-16 line-height-24 color-#00000099">
                          Delivery note: {selectedAddress?.notes}
                        </p>
                      )}
                    </div>
                  )}

                  <p
                    className="text-16 line-height-24 weight-500 color-#1677FF underline pointer w-fit"
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
                <p className="weight-400 text-14 line-height-22 color-#D4280C">
                  Delivery address is required!
                </p>
              )}
            </div>

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
            <div className="flex flex-col gap-14">
              {allCartItems.storeGroups?.map((store, i: number) => (
                <div className="flex flex-col gap-16" key={i}>
                  {store.items.length > 0 && (
                    <div className="flex space-between a-items-center">
                      <h6
                        className="text-14 weight-400 line-height-22 color-#00000099 pointer"
                        onClick={() => {
                          setStoreAccordion(i);
                        }}
                      >
                        {store?.store.name}
                      </h6>
                      {store.visible ? (
                        <PiCaretDown
                          className="w-18 h-18 pointer"
                          onClick={() => setStoreAccordion(i)}
                        />
                      ) : (
                        <PiCaretUp
                          className="w-18 h-18 pointer"
                          onClick={() => setStoreAccordion(i)}
                        />
                      )}
                    </div>
                  )}
                  {store.items.length > 0 &&
                    store.items.map((cartItem: any, j: number) => {
                      const mediaType =
                        checkMediaType(cartItem.variant.media?.[0].url) ??
                        'image';

                      return (
                        <div className="flex flex-col gap-4">
                          <div
                            className={`gap-12 ${store.visible ? 'flex a-items-center' : 'hidden'}`}
                            key={j}
                          >
                            {mediaType === 'image' ? (
                              <Image
                                src={cartItem.variant.media?.[0].url}
                                alt="order image"
                                className="w-73 h-75 radius-6 border border-#00000014 object-fit"
                              />
                            ) : (
                              <VideoSrc
                                className="w-73 h-75 radius-6 border border-#00000014 object-fit"
                                src={cartItem.variant.media?.[0].url}
                              />
                            )}
                            <div
                              className={`flex-grow-1 flex flex-col ${Object.keys(cartItem?.variant?.properties ?? {}).length > 2 ? 'gap-2.8' : 'gap-6'} overflow-hidden white-space-nowrap text-overflow-ellipsis`}
                            >
                              <p className="weight-600 text-14 line-height-22 color-#000000E0">
                                {cartItem?.variant?.product?.name}
                              </p>
                              <p
                                className={`weight-400 color-#0000008C ${Object.keys(cartItem?.variant?.properties ?? {}).length > 2 ? 'text-13.5 line-height-16' : 'text-14 line-height-16.94'}`}
                              >
                                Quantity:{' '}
                                {`${cartItem?.quantity} ${displayStockUnit(
                                  cartItem.variant.stockUnit
                                )}${cartItem?.quantity > 1 ? 's' : ''}`}
                              </p>
                              {cartItem?.variant?.properties?.color && (
                                <p
                                  className={`weight-400 color-#0000008C capitalize ${Object.keys(cartItem?.variant?.properties ?? {}).length > 2 ? 'text-13.5 line-height-16' : 'text-14 line-height-16.94'}`}
                                >
                                  Color: {cartItem?.variant?.properties?.color}
                                </p>
                              )}
                              {cartItem?.variant?.size && (
                                <p className="weight-400 text-13.5 line-height-16 color-#0000008C">
                                  Size: {cartItem?.variant?.size}
                                </p>
                              )}

                              {cartItem?.variant?.properties &&
                                Object.entries(
                                  cartItem.variant.properties ?? {}
                                ).map(([key, value]) => {
                                  if (key === 'color') return null;
                                  return (
                                    <p
                                      key={key}
                                      className="weight-400 text-13.5 line-height-16 capitalize color-#0000008C"
                                    >
                                      {`${key}: ${Array.isArray(value) ? value.join(', ') : value}`}
                                    </p>
                                  );
                                })}
                            </div>
                            <div className="flex flex-col gap-10 a-items-end">
                              <div className="flex a-items-center gap-8">
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
                              <p
                                className="weight-400 text-14 line-height-22 text-danger underline pointer"
                                onClick={async () => {
                                  try {
                                    await removeFromCart(cartItem?.id);
                                    setAllAddressDeliveryPrice([]);
                                    //setShouldUpdateFee(true);
                                  } catch (error) {}
                                }}
                              >
                                Remove
                              </p>
                            </div>
                          </div>

                          {cartItem?.userConfigurations && (
                            <div className="">
                              {Object.keys(cartItem?.userConfigurations ?? {})
                                .length > 0 && (
                                <div className="border-b pb-12 border-#00000014 flex flex-col gap-4">
                                  <p className="text-12 weight-500 uppercase color-#000000E0 line-height-16 mt-12">
                                    Customizations
                                  </p>

                                  <div className="flex flex-col gap-2">
                                    {Object.entries(
                                      cartItem?.userConfigurations ?? {}
                                    ).map(([key, value]) => {
                                      if (
                                        value === undefined ||
                                        value === null ||
                                        value === '' ||
                                        (Array.isArray(value) &&
                                          value.length === 0) ||
                                        (typeof value === 'object' &&
                                          !Array.isArray(value) &&
                                          Object.keys(value ?? {}).length === 0)
                                      ) {
                                        return null;
                                      }

                                      let display = '';

                                      if (
                                        value &&
                                        typeof value === 'object' &&
                                        !Array.isArray(value)
                                      ) {
                                        display = Object.entries(value)
                                          .map(([k, v]) => {
                                            if (v && typeof v === 'object') {
                                              return `${k.replaceAll('_', ' ')}: ${Object.entries(
                                                v
                                              )
                                                .map(
                                                  ([nk, nv]) =>
                                                    `${nk.replaceAll('_', ' ')}: ${nv}`
                                                )
                                                .join(', ')}`;
                                            }
                                            return `${k.replaceAll('_', ' ')}: ${v}`;
                                          })
                                          .join(', ');
                                      } else if (Array.isArray(value)) {
                                        display = value.join(', ');
                                      } else {
                                        display = String(value);
                                      }

                                      return (
                                        <div
                                          key={key}
                                          className="flex justify-between text-12 flex-col"
                                        >
                                          <span className="color-#00000099 weight-400 capitalize">
                                            {key.replaceAll('_', ' ')}
                                          </span>

                                          <span className="weight-500 color-#00000099 ml-5">
                                            {display}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>

          <div className="relative bg-#F5F5F5 l:w-45.8p md:w-50p max-w-661">
            <div
              ref={leftScrollRef}
              className={`m:h-full overflow-auto no-scrollbar bg-#F5F5F5 md:pt-44 md:pb-85 xl:pl-80 l:pl-70 md:pl-40 xl:pr-80 l:pr-70 md:pr-60 flex flex-col gap-16 ${devOptions === 'smaller' ? 'fixed l-0 r-0 b-0 z-4' : ''}`}
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
              <div className="md:py-20 py-12 md:px-24 sm:px-40 px-24 md:border border-t border-#00000014 md:bg-white bg-#F5F5F5 md:radius-8 flex flex-col sm:gap-24 gap-20">
                <h2 className="color-#000000E0 text-20 line-height-28 weight-600 md:block hidden">
                  Payment Summary
                </h2>
                <div className={`${showSummary ? 'block' : 'md:block hidden'}`}>
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
                <div className="flex sm:flex-row flex-col sm:gap-0 gap-20 space-between a-items-center">
                  <div
                    className={`absolute t-0 sm:w-fit w-full sm:px-0 px-24 bg-#F5F5F5 pt-12 md:hidden block ${showSummary ? 'sm:b-20 sm:g|top:auto pt-22' : 'sm:t-10'}`}
                  >
                    <p
                      className={`md:hidden flex gap-12 a-items-center color-#00000099 sm:w-fit w-full space-between pointer ${showSummary && 'border-b border-b-#00000014 sm:border-b-#F5F5F5 pb-20 sm:pb-0'}`}
                      onClick={() => setshowSummary(!showSummary)}
                    >
                      <span className="text-16 weight-400 line-height-24">
                        {showSummary
                          ? 'Hide payment summary'
                          : 'Show payment summary'}
                      </span>
                      {showSummary ? (
                        <PiCaretDown className="w-20 h-20 mt-4" />
                      ) : (
                        <PiCaretUp className="w-20 h-20 mt-6" />
                      )}
                    </p>
                  </div>
                  <div className="flex gap-14 a-items-center sm:j-content-end w-full">
                    {!showSummary && (
                      <span className="md:hidden sm:block hidden sm:weight-600 weight-700 sm:text-16 text-14 sm:line-height-22 line-height-19">
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
                    <button
                      onClick={() => {
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
                            payWithPaystack({
                              addressId: selectedAddress?.id,
                              deliveryOption: selectedDeliveryOption,
                            });
                          }
                        }
                      }}
                      className={`md:w-full sm:w-fit w-full border-none m:flex text-white md:text-16 text-14 weight-500 md:line-height-22 line-height-19 md:px-24 px-16 py-12 radius-6 l:float-right j-content-center ${!showSummary && 'sm:mt-0 mt-56'} ${canProceedToPayment ? 'bg-#D1D5DB opacity-80 g|box-shadow:inset|_|0px|_|2px|_|4px|_|#0000001A color-#6B7280 cursor-not-allowed' : 'bg-#0B9378 pointer'}`}
                      title={
                        selectedAddress
                          ? ''
                          : 'Add an address to proceed to payment'
                      }
                    >
                      <span className="">
                        Proceed to payment{' '}
                        {!showSummary && (
                          <span className="sm:hidden weight-700">
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
                        className="ml-10"
                      />
                    </button>
                  </div>
                </div>

                <p className="text-16 line-height-24 weight-400 text-center md:block hidden">
                  By clicking place order, you confirmed you have read and
                  acknowledge{' '}
                  <Link href={'/checkout'} className="color-#1677FF">
                    all terms and policies.
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <AddressModal />
    </>
  );
};

export default CheckoutPage;
