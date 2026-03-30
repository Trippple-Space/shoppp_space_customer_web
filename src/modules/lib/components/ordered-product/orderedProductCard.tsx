import {
  checkMediaType,
  formatNumberAsPrice,
  getCartItems,
  getClosestColorName,
} from '@/modules/lib/utility/utility';
import React from 'react';
import Image from '../image/Image';
import VideoSrc from '../video-src/VideoSrc';
import { ConfigPill } from '../product-detail-modal/productConfigurationsHelper';

function orderedProductCard({ orderedProducts }: any) {
  const cartItems = getCartItems(orderedProducts?.cart?.storeGroups);
  return (
    <>
      <div className="flex flex-col gap-10">
        {cartItems.map((item: any) => {
          const mediaType =
            checkMediaType(item?.variant.media[0].url) ?? 'image';

          return (
            <div className="flex flex-col gap-4 bg-whitesmoke radius-5 p-10">
              <div className="l:flex space-between a-items-start">
                <div className="flex gap-10 l:w-60p w-90p relative">
                  <div className="w-60 h-60 radius-8 relative overflow-hidden">
                    {mediaType === 'image' ? (
                      <Image
                        src={item?.variant.media[0].url}
                        alt={item.variant?.product?.name || ''}
                        className="w-60 h-60 radius-8 object-fit-cover"
                      />
                    ) : (
                      <VideoSrc
                        className="w-60 h-60 radius-8 object-fit-cover"
                        src={item?.variant.media[0].url}
                        hasLoader={true}
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-10 pb-10 l:pb-0">
                    <div className="flex flex-col gap-3">
                      <p className="weight-600 text-14 w-fit">
                        {item.variant.product?.name}
                      </p>
                      <p className="color-#0000008C text-12">
                        {item.variant.product?.store.name}
                      </p>
                    </div>
                    <div className="flex flex-col gap-5">
                      {' '}
                      {item.variant?.size ? (
                        <p className="color-#0000008C text-14 w-fit">
                          Size: {item.variant?.size}
                        </p>
                      ) : null}
                      {item.variant?.properties?.color && (
                        <p className="color-#0000008C text-14">
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
                                className="color-#0000008C text-14 w-fit"
                              >
                                {`${key}: ${Array.isArray(value) ? value.join(', ') : value}`}
                              </p>
                            );
                          }
                        )}
                    </div>
                  </div>
                </div>
                <div className="flex space-between flex-row-reverse l:grid gap-5 pt-5 border-t border-t-#00000014 l:border-none">
                  <p className="text-14 weight-500">
                    {formatNumberAsPrice(item.totalPrice)}
                  </p>
                  <p className="text-12 text-right"> X {item.quantity}</p>
                </div>
              </div>

              {item?.userConfigurations &&
                Object.keys(item.userConfigurations).length > 0 && (
                  <div className="py-12">
                    <div className="pt-10 flex flex-col gap-6">
                      <div className="flex gap-8 flex-wrap relative">
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
