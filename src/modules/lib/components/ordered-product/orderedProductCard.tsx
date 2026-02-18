import {
  checkMediaType,
  formatNumberAsPrice,
  getCartItems,
} from '@/modules/lib/utility/utility';
import React from 'react';
import Image from '../image/Image';
import VideoSrc from '../video-src/VideoSrc';

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
                <div className="flex gap-10 l:w-60p w-90p">
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
                    />
                  )}
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
                      {item.variant.size ? (
                        <p className="color-#0000008C text-14 w-fit">
                          Size: {item.variant.size}
                        </p>
                      ) : null}
                      {item.variant.properties.color && (
                        <p className="color-#0000008C text-14">
                          Color: {item.variant.properties.color}
                        </p>
                      )}
                      {item?.variant?.properties &&
                        Object.entries(item.variant.properties).map(
                          ([key, value]) => {
                            if (key === 'color') return null;
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

              {item?.userConfigurations && (
                <div className="py-12">
                  {Object.keys(item?.userConfigurations ?? {}).length >
                    0 && (
                    <div className="border-t border-#00000014 flex flex-col gap-4">
                      <p className="text-12 weight-500 uppercase color-#000000E0 line-height-16 mt-12">
                        Customizations
                      </p>

                      <div className="flex flex-col gap-2">
                        {Object.entries(item?.userConfigurations ?? {}).map(
                          ([key, value]) => {
                            if (
                              value === undefined ||
                              value === null ||
                              value === '' ||
                              (Array.isArray(value) && value.length === 0) ||
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
                          }
                        )}
                      </div>
                    </div>
                  )}
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
