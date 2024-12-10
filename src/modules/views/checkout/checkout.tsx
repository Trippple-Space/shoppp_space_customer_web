"use client";
import Icon from "@/modules/lib/components/icon/Icon";
import Image from "@/modules/lib/components/image/Image";
import React, { useEffect, useState } from "react";
import HomepageNavBar from "@/modules/lib/components/nav-bar/HomepageNavBar";
import { useRouter } from "next/navigation";
import Footer from "@/modules/lib/components/footer/Footer";
import useUserStore from "@/modules/lib/utility/store/user.store";
import { useCart } from "@/modules/lib/utility/hooks/use-cart";
import { getCartItemVariantPropertiesAsJsx } from "@/modules/lib/components/minicart/minicart.helper";
import { useSignOut } from "@/modules/lib/utility/hooks/use-sign-out";
import useAddressStore from "@/modules/lib/utility/store/address.store";
import useAddress from "@/modules/lib/utility/hooks/use-address";
import usePayment from "@/modules/lib/utility/hooks/use-payment";
import PuffLoader from "@/modules/lib/components/puff-loader/PuffLoader";
import BoxRadio from "@/modules/lib/components/box-radio/BoxRadio";
import {
  cx,
  displayStockUnit,
  formatNumberAsPrice,
} from "@/modules/lib/utility/utility";
import { BiCaretDown, BiChevronDown } from "react-icons/bi";
import { BsCaretDown } from "react-icons/bs";
import { FaCaretDown } from "react-icons/fa";
import { deliveryOptions } from "@/modules/lib/utility/constants";
import OrderSummary from "@/modules/lib/components/order-summary/OrderSummary";
import ImageAlt from "@/modules/lib/components/image-alt/ImageAlt";
import { PiCaretDown, PiCaretUp } from "react-icons/pi";
import Link from "next/link";
import DeliveryOptions from "@/modules/lib/components/delivery-options/DeliveryOptions";

const CheckoutPage = () => {
  const [unitCounter, setUnitCounter] = useState<number>(1);
  const [selectedDeliveryOption, setSelectedDeliveryOption] =
    useState<keyof typeof deliveryOptions>("standard");
  const router = useRouter();
  const { user } = useUserStore();
  const { cart, removeFromCart } = useCart();
  const signOut = useSignOut();
  const { openAddressModal, selectedAddress } = useAddress();
  const { loading: isPaymentLoading, payWithPaystack } = usePayment();
  const canProceedToPayment = !(!isPaymentLoading && selectedAddress && user);
  const selectedDeliveryOptionDetails = deliveryOptions[selectedDeliveryOption];
  const [cartItemsByStore, setcartItemsByStore] = useState<any[]>([]);
  const [devOptions, setDevOptions] = useState<string>();
  const [showSummary, setshowSummary] = useState(true);

  const setStoreAccordion = (i: number) => {
    setcartItemsByStore((prevCartItems) =>
      prevCartItems.map((item, index) =>
        index === i
          ? { ...item, visible: !item.visible }
          : item
      )
    );
  }

  const getCartItemsByStore = () => {
    const cartItems = cart.cartItems;
    const stores: any[] = [];
    if (cartItems.length !== 0) {
      cartItems.forEach((item) => {
        if (!stores.includes(item.variant.product?.store?.name)) {
          stores.push(item.variant.product?.store?.name);
        }
      });

      const storeCartItems: any[] = [];

      stores.forEach((store) => {
        const storeName = store;
        const storeItems = cartItems.filter(
          (item) => item.variant.product?.store.name === storeName
        );
        const storeObject: { [key: string]: any } = {};
        storeObject.name = storeName;
        storeObject.visible = true;
        storeObject.items = storeItems;

        storeCartItems.push(storeObject);
      });
      setcartItemsByStore(storeCartItems);
    }
  };

  useEffect(() => {
    getCartItemsByStore();
  }, [cart]);

  useEffect(() => {
    const checkScreenWidth = () => {
      setDevOptions(screen.width >= 768 ? "larger" : "smaller");
    };
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  return (
    <>
      <HomepageNavBar parent={"checkout"} />
      <div className="md:pt-69.6 pt-64 md:mb-60 mb-111">
        <div className="md:flex">
          <div className="l:w-54.2p md:w-50p md:py-44 sm:py-32 py-24 xl:pl-80 l:pl-70 md:pl-60 sm:pl-40 pl-24 xl:pr-80 l:pr-70 sm:pr-40 pr-24 flex flex-col gap-28 bg-white">
            <div className="flex flex-col gap-6">
              <h1 className="weight-600 md:text-24 text-20 md:line-height-32 line-heigth-28">
                Order Summary
              </h1>
              <p className="weight-400 text-16 line-height-24">
                Check your item and add your delivery address for better
                delivery experience.
              </p>
            </div>

            <div className="py-20 px-24 border border-#00000014 flex flex-col gap-24 radius-8">
              <h2 className="color-#000000E0 md:text-20 text-16 weight-600 line-height-24">
                Delivery address
              </h2>

              <div className="flex l:flex-row md:flex-col sm:flex-row flex-col l:space-between md:j-content-start sm:space-between l:a-items-center md:a-items-start sm:a-items-center l:gap-0 md:gap-16 sm:gap-0 gap-16">
                {selectedAddress && (
                  <div className="flex flex-col gap-4">
                    <p className="weight-400 text-16 line-height-24 color-#00000099">
                      {selectedAddress?.contactNo}
                    </p>
                    <p className="weight-400 text-16 line-height-24 color-#00000099">
                      {selectedAddress?.address}, {selectedAddress?.city},{" "}
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
                  onClick={openAddressModal}
                >
                  {selectedAddress ? "Change" : "Add delivery address"}
                </p>
              </div>
            </div>

            {devOptions === "smaller" && <DeliveryOptions />}
            <div className="flex flex-col gap-14">
              {cartItemsByStore?.map((store, i: number) => (
                <div className="flex flex-col gap-16" key={i}>
                  <div className="flex space-between pointer a-items-center">
                    <h6 className="text-14 weight-400 line-height-22 color-#00000099" onClick={() => setStoreAccordion(i)}>
                      {store?.name}
                    </h6>
                    {store.visible ? (
                      <PiCaretDown className="w-18 h-18" onClick={() => setStoreAccordion(i)} />
                    ) : (
                      <PiCaretUp className="w-18 h-18" onClick={() => setStoreAccordion(i)} />
                    )}
                  </div>
                  {store.items.map((cartItem: any, j: number) => (
                    <div
                      className={`gap-12 ${store.visible ? "flex" : "hidden"}`}
                      key={j}
                    >
                      <Image
                        src={cartItem.variant.media?.[0].url}
                        alt="order image"
                        className="w-70 h-70 radius-6 border border-#00000014 object-fit"
                      />
                      <div className="flex-grow-1 flex flex-col gap-6">
                        <p className="weight-600 text-14 line-height-22 color-#000000E0">
                          {cartItem?.variant?.product?.name}
                        </p>
                        <p className="weight-400 text-14 line-height-16.94 color-#0000008C">
                          Size:{" "}
                          {`${cartItem?.quantity} ${displayStockUnit(
                            cartItem.variant.stockUnit
                          )}${cartItem?.quantity > 1 ? "s" : ""}`}
                        </p>
                        <p className="weight-400 text-14 line-height-16.94 color-#0000008C">
                          Color: {cartItem?.variant?.properties?.color}
                        </p>
                      </div>
                      <div className="flex flex-col gap-10 a-items-end">
                        <h3 className="weight-600 text-16 line-height-24">
                          {formatNumberAsPrice(cartItem?.variant?.finalPrice)}
                        </h3>
                        <p
                          className="weight-400 text-14 line-height-22 text-danger underline pointer"
                          onClick={() => removeFromCart(cartItem?.id)}
                        >
                          Remove
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="relative l:w-45.8p md:w-50p bg-#F5F5F5">
            <div className="md:absolute fixed l-0 r-0 md:t-0 md:b-0 b--0 md:z-0 z-4 md:py-44 xl:pl-80 l:pl-70 md:pl-40 xl:pr-80 l:pr-70 md:pr-60 flex flex-col gap-16">
              {devOptions === "larger" && <DeliveryOptions />}
              <div className="md:py-20 py-12 md:px-24 sm:px-40 px-24 md:border border-t border-#00000014 md:bg-white bg-#F5F5F5 md:radius-8 flex flex-col gap-24">
                <h2 className="color-#000000E0 text-20 line-height-28 weight-600 md:block hidden">
                  Payment Summary
                </h2>
                <div className={`${showSummary ? 'block' : 'hidden'}`}>
                  <OrderSummary
                    subTotal={cart.subTotal}
                    extraSavings={cart.total - cart.subTotal}
                    shippingFee={selectedDeliveryOptionDetails.price}
                    total={cart.total + selectedDeliveryOptionDetails.price}
                  />
                </div>
                <div className="flex sm:flex-row flex-col sm:gap-0 gap-20 space-between a-items-center">
                  <p className="md:hidden flex gap-12 a-items-center color-#00000099 sm:w-fit w-full space-between pointer" onClick={() => setshowSummary(!showSummary)}>
                    <span className="text-16 weight-400 line-height-24">
                      {showSummary ? 'Hide payment summary' : 'Show payment summary'}
                    </span>
                    {
                      showSummary ? <PiCaretDown className="w-20 h-20" /> : <PiCaretUp className="w-20 h-20" />
                    }
                  </p>
                  <button
                    onClick={() =>
                      payWithPaystack({
                        addressId: selectedAddress?.id,
                        deliveryOption: selectedDeliveryOption,
                      })
                    }
                    disabled={canProceedToPayment}
                    className="md:w-full sm:w-fit w-full border-none bg-#0B9378 disabled:bg-green-300 m:flex text-white md:text-16 text-14 weight-500 md:line-height-22 line-height-19 md:px-24 px-16 py-12 radius-6 pointer l:float-right j-content-center"
                  >
                    <span className="">
                      Proceed to payment{" "}
                      {
                        !showSummary && <span className="weight-700">
                          (
                          {formatNumberAsPrice(
                            cart.total + selectedDeliveryOptionDetails.price
                          )}
                          )
                        </span>
                      }
                    </span>
                    <PuffLoader
                      size={15}
                      loading={isPaymentLoading}
                      className="ml-10"
                    />
                  </button>
                </div>

                <p className="text-16 line-height-24 weight-400 text-center md:block hidden">
                  By clicking place order, you confirmed you have read and
                  acknowledge{" "}
                  <Link href={"/checkout"} className="color-#1677FF">
                    all terms and policies.
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
