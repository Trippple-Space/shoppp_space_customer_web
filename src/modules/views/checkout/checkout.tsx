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
  const [isCartCollapsed, setIsCartCollapsed] = useState(false);
  const selectedDeliveryOptionDetails = deliveryOptions[selectedDeliveryOption];

  const [cartItemsByStore, setcartItemsByStore] = useState<any[]>([]);

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

  return (
    <>
      <HomepageNavBar parent={"checkout"} />
      <div className="md:pt-69.6 pt-64 mb-60">
        <div className="flex">
          <div className="l:w-54.2p py-44 px-80 flex flex-col gap-28 bg-white">
            <div className="flex flex-col gap-6">
              <h1 className="weight-600 text-24 line-height-32">
                Order Summary
              </h1>
              <p className="weight-400 text-16 line-height-24">
                Check your item and add your delivery address for better
                delivery experience.
              </p>
            </div>

            <div className="py-20 px-24 border border-#00000014 flex flex-col gap-24 radius-8">
              <h2 className="color-#000000E0 text-20 weight-600 line-height-24">
                Delivery address
              </h2>

              <div className="flex space-between a-items-center">
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
                  className="text-16 line-height-24 weight-400 color-#1677FF underline pointer w-fit"
                  onClick={openAddressModal}
                >
                  {selectedAddress ? "Change" : "Add delivery address"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-14">
              {cartItemsByStore?.map((store, i: number) => (
                <div className="flex flex-col gap-16" key={i}>
                  <div
                    className="flex space-between pointer a-items-center"
                    onClick={() => {
                      setcartItemsByStore((prevCartItems) =>
                        prevCartItems.map((item, index) =>
                          index === i
                            ? { ...item, visible: !item.visible }
                            : item
                        )
                      );
                    }}
                  >
                    <h6 className="text-14 weight-400 line-height-22 color-#00000099">
                      {store?.name}
                    </h6>
                    {store.visible ? (
                      <PiCaretDown className="w-18 h-18" />
                    ) : (
                      <PiCaretUp className="w-18 h-18" />
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

          <div className="l:w-45.8p bg-#F5F5F5 flex flex-col gap-16 py-44 px-80">
            <div className="bg-white py-20 px-24 radius-8 border border-#00000014 flex flex-col gap-24">
              <h2 className="text-20 line-height-28 weight-600">
                Delivery options
              </h2>
              <div className="">
                <div className="flex flex-col gap-12">
                  {Object.entries(deliveryOptions).map(([key, option]) => (
                    <BoxRadio
                      id="delivery-type"
                      name="delivery-type"
                      key={key}
                      value={key}
                      className="checkout"
                      label={
                        <div className="flex gap-8">
                          <div className="flex flex-col gap-4">
                            <h3 className="weight-600 text-16 line-height-24 capitalize">
                              {option.title}
                            </h3>
                            <p className="weight-400 text-14 line-height-22">
                              {option.description}
                            </p>
                          </div>
                          <p
                            className={` w-fit text-right  px-10 py-2 h-fit radius-4 ${
                              selectedDeliveryOption === key
                                ? "color-#0B9378 bg-#007B5D1F"
                                : "color-#000000E0 bg-#F5F5F5"
                            }`}
                          >
                            {formatNumberAsPrice(option.price)}
                          </p>
                        </div>
                      }
                      checked={selectedDeliveryOption === key}
                      onChange={() =>
                        setSelectedDeliveryOption(
                          key as keyof typeof deliveryOptions
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="py-20 px-24 border border-#00000014 bg-white radius-8 flex flex-col gap-24">
              <h2 className="color-#000000E0 text-20 line-height-28 weight-600">
                Payment Summary
              </h2>
              <OrderSummary
                subTotal={cart.subTotal}
                extraSavings={cart.total - cart.subTotal}
                shippingFee={selectedDeliveryOptionDetails.price}
                total={cart.total + selectedDeliveryOptionDetails.price}
              />
              <button
                onClick={() =>
                  payWithPaystack({
                    addressId: selectedAddress?.id,
                    deliveryOption: selectedDeliveryOption,
                  })
                }
                disabled={canProceedToPayment}
                className="w-full border-none bg-#0B9378 disabled:bg-green-300 m:flex text-white text-16 weight-500 line-height-22 px-24 py-12 radius-6 pointer l:float-right j-content-center"
              >
                <span className="">Proceed to payment</span>
                <PuffLoader
                  size={15}
                  loading={isPaymentLoading}
                  className="ml-10"
                />
              </button>

              <p className="text-16 line-height-24 weight-400 text-center">
                By clicking place order, you confirmed you have read and
                acknowledge <Link href={'/checkout'} className="color-#1677FF">all terms and policies.</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
