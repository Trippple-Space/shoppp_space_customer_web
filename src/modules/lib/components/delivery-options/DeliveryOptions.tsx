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
  selectedDeliveryOption,
  setSelectedDeliveryOption,
  deliveryOptions,
  loading,
  retry,
  selectedAddress
}) => {

  const isAllActive = (items?: {status: string | null}[]) =>
    Array.isArray(items) && items.length > 0 &&
    items.every(item => item.status === 'active');

  const vendorManagedOption = deliveryOptions.vendorManaged;

  const vendorManagedAvailable =
    isAllActive(vendorManagedOption?.pickup) ||
    isAllActive(vendorManagedOption?.vendorManaged);


const visibleOptions: Record<string, typeof deliveryOptions[keyof typeof deliveryOptions]> = 
  { ...deliveryOptions };

if (!vendorManagedAvailable) {
  delete visibleOptions.vendorManaged;
}

  const showVendorSubSelect =
    selectedDeliveryOption === 'vendorManaged' && vendorManagedAvailable;

const selectedVendorOptions =
  deliveryOptions.vendorManaged?.vendorManaged ?? [];

  return (
    <div className="bg-white py-20 px-24 radius-8 border border-#00000014 flex flex-col md:gap-24 gap-16">
      <h2 className="md:text-20 text-16 md:line-height-28 line-height-24 weight-600">Delivery options</h2>
      {selectedAddress ? (
        <div>
          <div className="flex flex-wrap md:flex-col sm:flex-row flex-col gap-12">
            <p>Asoebi Africa Delivery</p>

            {Object.entries(visibleOptions).map(([key, option]) => (
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
                      {(('price' in option && (isNaN((option as any).price) || (option as any).price === null)) && !loading) ? (
                        <p className="weight-400 text-14 line-height-22 flex a-items-center j-content-center gap-3">
                          <span>This service is currently unavailable.</span>
                          <span
                            className="underline cursor-pointer color-link"
                            onClick={retry}
                          >
                            Retry
                          </span>
                        </p>
                      ) : (
                        <p className="weight-400 text-14 line-height-22">
                          {'description' in option ? option.description : ''}
                        </p>
                      )}
                    </div>
                    {(loading || ('price' in option && (option as any).price !== null && !isNaN((option as any).price))) && (
                      <p
                        className={`w-fit text-right px-10 py-2 h-fit radius-4 text-12 weight-400 line-height-20 ${
                          loading && 'animate-pulse'
                        } ${
                          selectedDeliveryOption === key
                            ? 'color-#0B9378 bg-#007B5D1F'
                            : 'color-#000000E0 bg-#F5F5F5'
                        }`}
                      >
                        {('price' in option && (option as any).price === 0) ? (
                          <span>Free</span>
                        ) : loading ? (
                          <div className="w-50 h-24 radius-6"></div>
                        ) : (
                          <span>{'price' in option ? formatNumberAsPrice((option as any).price) : ''}</span>
                        )}
                      </p>
                    )}
                  </div>
                }
                checked={selectedDeliveryOption === key}
                disabled={
                  (('price' in option && (isNaN((option as any).price) || (option as any).price === null)) || loading)
                }
                onChange={() =>
                  setSelectedDeliveryOption(key as keyof typeof deliveryOptions)
                }
              />
            ))}
          </div>

          {showVendorSubSelect && (
            <div className="mt-12 p-12 radius-8 gap-8 w-fit">
              <div className="flex gap-8">
                {isAllActive(vendorManagedOption?.pickup) && (
                  <BoxRadio
                    id="vendor-pickup"
                    name="vendor-subtype"
                    value="pickup"
                    label="Pick-up"
                    checked={selectedDeliveryOption === 'pickup'}
                    onChange={() => setSelectedDeliveryOption('pickup')}
                  />
                )}
                {isAllActive(vendorManagedOption?.vendorManaged) && (
                  <BoxRadio
                    id="vendor-managed"
                    name="vendor-subtype"
                    value="vendorManaged"
                    label="Vendor Delivery"
                    checked={selectedDeliveryOption === 'vendorManaged'}
                    onChange={() => setSelectedDeliveryOption('vendorManaged')}
                  />
                )}
              </div>
            </div>
          )}

{selectedDeliveryOption === "vendorManaged" && (
  <div className="mt-12 p-12 radius-8 flex flex-col gap-8 w-full md:w-auto">
    <div className="flex a-items-center gap-8 ">
      <p className="weight-400 text-14 line-height-22 flex a-items-center gap-3 color-#00000099">
        Vendor’s Own Delivery (managed directly by the store)
      </p>
  <div className="hidden xl:block w-full border border-#E7E7E7"></div>
    </div>

    <div className="mt-8 flex flex-col gap-12">
      {selectedVendorOptions.map((vendor, idx) => (
        <div
          key={idx}
          className="flex j-content-between a-items-center flex-wrap lg:flex-nowrap gap-4"
        >
          <p className="weight-400 text-12 lg:text-16 line-height-22 flex a-items-center gap-3 flex-wrap">
            {vendor.storeName}
            {vendor.estimatedTime && (
              <span className="color-#00000099 text-10 lg:text-14">
                ({vendor.estimatedTime})
    
              </span>
            )}
          </p>
          <p className="weight-600 text-14 md:text-16">
            {formatNumberAsPrice(vendor.fee)}
          </p>
        </div>
      ))}
    </div>
  </div>
)}

<div className="mt-12 p-12 radius-8 flex a-items-center gap-8 bg-#F5F5F5 w-full">
  <p
    className="text-14 text-center color-#00000099"
    style={{ fontStyle: "italic" }}
  >
    Asoebi Africa is only responsible for deliveries handled through “Asoebi
    Africa Delivery.” For orders shipped via “Vendor’s Own Delivery,” please
    contact the store directly for delivery status or issues.
  </p>
</div>

          </div>
 
      ) : (
        <div className="flex j-content-center">
          <p className="weight-400 text-16 line-height-24">
            Please select a delivery address to continue.
          </p>
        </div>
      )}
    </div>
  );
};


export default DeliveryOptions
