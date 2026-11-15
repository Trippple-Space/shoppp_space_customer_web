import {
  checkMediaType,
  formatNumberAsPrice,
  getClosestColorName,
  getOrderCartLinesWithStatus,
} from '@/modules/lib/utility/utility';
import React from 'react';
import Image from '../image/Image';
import VideoSrc from '../video-src/VideoSrc';
import { ConfigPill } from '../product-detail-modal/productConfigurationsHelper';
import {
  getLineDisplayPrices,
  getStrikethroughAmounts,
} from '@/modules/lib/utility/visible-discount';

function orderedProductCard({ orderedProducts }: any) {
  const cartItems = getOrderCartLinesWithStatus(orderedProducts);
  return (
    <>
      <div className="flex flex-col gap-[10px]">
        {cartItems.map((item: any) => {
          const isRemoved = item?.lineStatus === 'REMOVED';
          const mediaType =
            checkMediaType(item?.variant.media[0].url) ?? 'image';
          const linePrices = getLineDisplayPrices({
            totalPrice: Number(item?.totalPrice ?? 0),
            discountedPrice: Number(item?.discountedPrice ?? 0),
            variant: item?.variant,
            orderHistory: true,
          });

          return (
            <div
              className={`flex flex-col gap-[4px] bg-[#F5F5F5] rounded-[5px] p-[10px] ${isRemoved ? 'opacity-70' : ''}`}
            >
              <div className="lg:flex justify-between items-start">
                <div className="flex gap-[10px] lg:w-[60%] w-[90%] relative">
                  <div className="w-[60px] h-[60px] rounded-[8px] relative overflow-hidden">
                    {mediaType === 'image' ? (
                      <Image
                        src={item?.variant.media[0].url}
                        alt={item.variant?.product?.name || ''}
                        className="w-[60px] h-[60px] rounded-[8px] object-fit-cover"
                      />
                    ) : (
                      <VideoSrc
                        className="w-[60px] h-[60px] rounded-[8px] object-fit-cover"
                        src={item?.variant.media[0].url}
                        hasLoader={true}
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-[10px] pb-[10px] lg:pb-0">
                    <div className="flex flex-col gap-[3px]">
                      <p className="font-semibold text-[14px] w-fit flex flex-wrap items-center gap-[2px]">
                        <span>{item.variant.product?.name}</span>
                        {isRemoved && (
                          <span className="text-[10px] uppercase font-semibold px-[2px] py-[0.5px] rounded bg-[#6C757D] text-white">
                            Removed
                          </span>
                        )}
                      </p>
                      <p className="text-[#0000008C] text-[12px]">
                        {item.variant.product?.store.name}
                      </p>
                    </div>
                    <div className="flex flex-col gap-[5px]">
                      {' '}
                      {item.variant?.size ? (
                        <p className="text-[#0000008C] text-[14px] w-fit">
                          Size: {item.variant?.size}
                        </p>
                      ) : null}
                      {item.variant?.properties?.color && (
                        <p className="text-[#0000008C] text-[14px]">
                          Color: {item?.variant?.properties?.color[0] === '#' ? getClosestColorName(item?.variant?.properties?.color) : item?.variant?.properties?.color}
                        </p>
                      )}
                      {item?.variant?.properties &&
                        Object.entries(item.variant?.properties).map(
                          ([key, value]) => {
                            if (
                              key === 'color' ||
                              key === 'size' ||
                              value === null ||
                              value === undefined ||
                              (typeof value === 'string' &&
                                value.trim() === '') ||
                              (Array.isArray(value) &&
                                value.filter(
                                  (v) => String(v ?? '').trim() !== ''
                                ).length === 0) ||
                              (typeof value === 'object' &&
                                !Array.isArray(value) &&
                                Object.keys(value).length === 0)
                            )
                              return null;
                            return (
                              <p
                                key={key}
                                className="text-[#0000008C] text-[14px] w-fit"
                              >
                                {`${key}: ${Array.isArray(value) ? value.join(', ') : value}`}
                              </p>
                            );
                          }
                        )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between flex-row-reverse lg:grid gap-[5px] pt-[5px] border-t border-t-[#00000014] lg:border-none">
                  <div className="flex flex-col items-end">
                    <p className="text-[14px] font-medium">
                      {formatNumberAsPrice(linePrices.displayPrice)}
                    </p>
                    {linePrices.hasSlash && (
                      <div className="flex flex-col gap-[2px] items-end">
                        {getStrikethroughAmounts(linePrices).map(
                          (amount, idx) => (
                            <p
                              key={idx}
                              className="text-[12px] text-[#00000099] line-through"
                            >
                              {formatNumberAsPrice(amount)}
                            </p>
                          )
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-[12px] text-right"> X {item.quantity}</p>
                </div>
              </div>

              {item?.userConfigurations &&
                Object.keys(item.userConfigurations).length > 0 && (
                  <div className="py-[12px]">
                    <div className="pt-[10px] flex flex-col gap-[6px]">
                      <div className="flex gap-[8px] flex-wrap relative">
                        {Object.entries(item.userConfigurations).map(
                          ([recordName, recordValue]) => {
                            if (
                              !recordValue ||
                              typeof recordValue !== 'object' ||
                              Object.keys(recordValue).length === 0
                            )
                              return null;

                            return (
                              <ConfigPill
                                key={recordName}
                                title={recordName.replaceAll('_', ' ')}
                                value={recordValue}
                              />
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default orderedProductCard;
