import React, { FC } from "react";
import BoxRadio from "../box-radio/BoxRadio";
import { formatNumberAsPrice } from "../../utility/utility";
import { DeliveryOption } from "../../utility/types/delivery.interface";
import { Address } from "../../utility/types/address.interface";

interface IDeliveryOptions {
  selectedDeliveryOption: any;
  setSelectedDeliveryOption: any
  deliveryOptions: DeliveryOption
  loading?: boolean
  retry?: () => void
  selectedAddress?: Address
}

const DeliveryOptions: FC<IDeliveryOptions> = ({
  selectedDeliveryOption, setSelectedDeliveryOption,
  deliveryOptions,
  loading,
  retry,
  selectedAddress
}) => {

  return (
    <div className="bg-white py-20 px-24 radius-8 border border-#00000014 flex flex-col md:gap-24 gap-16">
      <h2 className="md:text-20 text-16 md:line-height-28 line-height-24 weight-600">Delivery options</h2>
      {
        selectedAddress ?
          <div className="">
            <div className="flex md:flex-col sm:flex-row flex-col gap-12">
              {Object.entries(deliveryOptions).map(([key, option]) => {
                return (
                  <BoxRadio
                    id="delivery-type"
                    name="delivery-type"
                    key={key}
                    value={key}
                    className="checkout"
                    label={
                      <div className="flex gap-8">
                        <div className="flex flex-col md:gap-4 gap-2">
                          <h3 className="weight-600 md:text-16 text-14 md:line-height-24 line-height-22 capitalize">
                            {option.title}
                          </h3>
                          {
                            ((isNaN(option.price) || option.price === null) && !loading) ?
                              <p className="weight-400 text-14 line-height-22 flex a-items-center j-content-center gap-3">
                                <span>This service is currently unavailable.</span>
                                <span className="underline cursor-pointer color-link" onClick={retry}>Retry</span>
                              </p>
                              :
                              <p className="weight-400 text-14 line-height-22">
                                {option.description}
                              </p>
                          }
                        </div>
                        {
                          (loading || (option.price !== null && !isNaN(option.price))) &&
                          <p
                            className={`w-fit text-right px-10 py-2 h-fit radius-4 text-12 weight-400 line-height-20 ${loading && 'animate-pulse'} ${selectedDeliveryOption === key
                              ? "color-#0B9378 bg-#007B5D1F"
                              : "color-#000000E0 bg-#F5F5F5"
                              }`}
                          >
                            {option.price === 0 ? <span>Free</span> :
                              loading ?
                                <div className="w-50 h-24 radius-6"></div>
                                :
                                <span>{formatNumberAsPrice(option.price)}</span>
                            }
                          </p>
                        }
                      </div>
                    }
                    checked={selectedDeliveryOption === key}
                    disabled={((isNaN(option.price) || option.price === null) && !loading)}
                    onChange={() =>
                      setSelectedDeliveryOption(key as keyof typeof deliveryOptions)
                    }
                  />
                )
              })}
            </div>
          </div>
          :
          <div className="flex j-content-center">
            <p className="weight-400 text-16 line-height-24">Please select a delivery address to continue.</p>
          </div>
      }
    </div>
  );
}

export default DeliveryOptions
