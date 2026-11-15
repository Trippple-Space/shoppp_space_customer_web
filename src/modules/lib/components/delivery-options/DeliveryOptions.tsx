import React, { FC } from 'react';
import BoxRadio from '../box-radio/BoxRadio';
import { formatNumberAsPrice } from '../../utility/utility';
import { DeliveryOption } from '../../utility/types/delivery.interface';
import { Address } from '../../utility/types/address.interface';

interface IDeliveryOptions {
  selectedDeliveryOption: any;
  setSelectedDeliveryOption: any;
  deliveryOptions: DeliveryOption;
  loading?: boolean;
  retry?: () => void;
  selectedAddress?: Address;
}

const DeliveryOptions: FC<IDeliveryOptions> = ({
  selectedDeliveryOption,
  setSelectedDeliveryOption,
  deliveryOptions,
  loading,
  retry,
  selectedAddress,
}) => {
  const isAllActive = (items?: { status: string | null }[]) =>
    Array.isArray(items) &&
    items.length > 0 &&
    items.every((item) => item.status === 'active');

  const vendorManagedOption = deliveryOptions.vendorManaged;

  const vendorManagedAvailable =
    isAllActive(vendorManagedOption?.pickup) ||
    isAllActive(vendorManagedOption?.vendorManaged);

  const visibleOptions: Record<
    string,
    (typeof deliveryOptions)[keyof typeof deliveryOptions]
  > = { ...deliveryOptions };

  if (!vendorManagedAvailable) {
    delete visibleOptions.vendorManaged;
  }

  const showVendorSubSelect =
    selectedDeliveryOption === 'vendorManaged' && vendorManagedAvailable;

  const selectedVendorOptions =
    deliveryOptions.vendorManaged?.vendorManaged ?? [];

  const isComingSoon = (option: any) => option?.title === 'Same Day Delivery';

  return (
    <div className="bg-white py-[20px] px-[24px] rounded-[8px] border border-[#00000014] flex flex-col md:gap-[24px] gap-[16px]">
      <h2 className="md:text-[20px] text-[16px] md:leading-[28px] leading-[24px] font-semibold">
        Delivery options
      </h2>
      {selectedAddress ? (
        <div>
          <div className="flex flex-wrap md:flex-col sm:flex-row flex-col gap-[12px]">
            <p>Shoppp Space Delivery</p>

            {Object.entries(visibleOptions).map(([key, option]) => {
              const comingSoon = isComingSoon(option);

              return (
                <BoxRadio
                  id="delivery-type"
                  name="delivery-type"
                  key={key}
                  value={key}
                  className="checkout"
                  label={
                    <div className="relative">
                      <div
                        className="flex gap-[8px]"
                        style={comingSoon ? { filter: 'blur(1px)' } : undefined}
                      >
                        <div className="flex flex-col md:gap-[4px] gap-[2px]">
                          <h3 className="font-semibold md:text-[16px] text-[14px] md:leading-[24px] leading-[22px] capitalize">
                            {option.title}
                          </h3>
                          {'price' in option &&
                          (isNaN((option as any).price) ||
                            (option as any).price === null) &&
                          !loading && !comingSoon ? (
                            <p className="font-normal text-[14px] leading-[22px] flex items-center justify-center gap-[3px]">
                              <span>
                                This service is currently unavailable.
                              </span>
                              <span
                                className="underline cursor-pointer color-link"
                                onClick={retry}
                              >
                                Retry
                              </span>
                            </p>
                          ) : (
                            <p className="font-normal text-[14px] leading-[22px]">
                              {'description' in option
                                ? option.description
                                : ''}
                            </p>
                          )}
                        </div>
                        {(loading ||
                          ('price' in option &&
                            (option as any).price !== null &&
                            !isNaN((option as any).price))) && (
                          <p
                            className={`w-fit text-right px-[10px] py-[2px] h-fit rounded-[4px] text-[12px] font-normal leading-[20px] ${
                              loading && 'animate-pulse'
                            } ${
                              selectedDeliveryOption === key
                                ? 'text-[#0357EE] bg-[#007B5D1F]'
                                : 'text-[#000000E0] bg-[#F5F5F5]'
                            }`}
                          >
                            {'price' in option &&
                            (option as any).price === 0 ? (
                              <span>Free</span>
                            ) : loading ? (
                              <div className="w-[50px] h-[24px] rounded-[6px]"></div>
                            ) : (
                              <span>
                                {'price' in option
                                  ? formatNumberAsPrice((option as any).price)
                                  : ''}
                              </span>
                            )}
                          </p>
                        )}
                      </div>

                      {comingSoon && (
                        <span className="absolute right-0 top-0 border-none text-[#D4280C] bg-[#FFDBD6] py-[4px] px-[12px] rounded-[4px] text-[12px]">
                          Coming soon
                        </span>
                      )}
                    </div>
                  }
                  checked={selectedDeliveryOption === key}
                  disabled={
                    comingSoon ||
                    ('price' in option &&
                      (isNaN((option as any).price) ||
                        (option as any).price === null)) ||
                    loading
                  }
                  onChange={() => {
                    if (comingSoon) return;
                    setSelectedDeliveryOption(
                      key as keyof typeof deliveryOptions
                    );
                  }}
                />
              );
            })}
          </div>

          {showVendorSubSelect && (
            <div className="mt-[12px] p-[12px] rounded-[8px] gap-[8px] w-fit">
              <div className="flex gap-[8px]">
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

          {selectedDeliveryOption === 'vendorManaged' && (
            <div className="mt-[12px] p-[12px] rounded-[8px] flex flex-col gap-[8px] w-full md:w-auto">
              <div className="flex items-center gap-[8px] ">
                <p className="font-normal text-[14px] leading-[22px] flex items-center gap-[3px] text-[#00000099]">
                  Vendor’s Own Delivery (managed directly by the store)
                </p>
                <div className="hidden xl:block w-full border border-[#E7E7E7]"></div>
              </div>

              <div className="mt-[8px] flex flex-col gap-[12px]">
                {selectedVendorOptions.map((vendor, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center flex-wrap lg:flex-nowrap gap-[4px]"
                  >
                    <p className="font-normal text-[12px] lg:text-[16px] leading-[22px] flex items-center gap-[3px] flex-wrap">
                      {vendor.storeName}
                      {vendor.estimatedTime && (
                        <span className="text-[#00000099] text-[10px] lg:text-[14px]">
                          ({vendor.estimatedTime})
                        </span>
                      )}
                    </p>
                    <p className="font-semibold text-[14px] md:text-[16px]">
                      {formatNumberAsPrice(vendor.fee)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-[12px] p-[12px] rounded-[8px] flex items-center gap-[8px] bg-[#F5F5F5] w-full">
            <p
              className="text-[14px] text-center text-[#00000099]"
              style={{ fontStyle: 'italic' }}
            >
              Shoppp Space is only responsible for deliveries handled through
              “Shoppp Space Delivery.” For orders shipped via “Vendor’s Own
              Delivery,” please contact the store directly for delivery status
              or issues.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <p className="font-normal text-[16px] leading-[24px]">
            Please select a delivery address to continue.
          </p>
        </div>
      )}
    </div>
  );
};

export default DeliveryOptions;
