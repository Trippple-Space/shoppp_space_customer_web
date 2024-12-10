import React, { FC } from "react";
import { formatNumberAsPrice } from "../../utility/utility";

interface IOrderSummary {
  subTotal: number;
  extraSavings: number;
  shippingFee?: number;
  total: any;
}

const OrderSummary: FC<IOrderSummary> = ({
  subTotal,
  extraSavings,
  shippingFee,
  total,
}) => {
  return (
    <div className="w-full flex flex-col gap-24">
      <div className="flex flex-col gap-16 text-16 line-height-24 weight-400 color-#000000E0">
        <div className="flex space-between">
          <div className="">Subtotal</div>
          <div className="">{formatNumberAsPrice(subTotal)}</div>
        </div>

        <div className="flex space-between">
          <div className="">Promo Code</div>
          <div className="color-#1677FF underline pointer">Enter code</div>
        </div>

        {!!extraSavings && (
          <div className="flex space-between">
            <div className="">Extra savings</div>
            <div className="">-{formatNumberAsPrice(extraSavings)}</div>
          </div>
        )}

        {!!shippingFee && (
          <div className="flex space-between">
            <div className="">Delivery fee</div>
            <div className="">{formatNumberAsPrice(shippingFee)}</div>
          </div>
        )}
      </div>
      {!!total && (
        <div className="flex space-between border-t border-grey-300 text-20 line-height-24 weight-600 pt-24">
          <div className="">Total</div>
          <div className="">
            {formatNumberAsPrice(total)}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
