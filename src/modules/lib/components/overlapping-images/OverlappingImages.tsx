import React from 'react'
import Image from '../image/Image'
import classNames from 'classnames'
import { checkMediaType, getCartItems } from '../../utility/utility'
import VideoSrc from '../video-src/VideoSrc'

const OverlappingImages = ({ orderItem }: any) => {
  const cartItems = getCartItems(orderItem?.cart?.storeGroups)
  const maxVisibleItems = 4

  return (
    <div className='flex gap-10 a-items-center relative'>
      {cartItems.slice(0, maxVisibleItems).map((variant: any, idx: number) => {
        const media = variant.variant.media?.[0]
        const mediaType = checkMediaType(variant.variant.media?.[0].url) ?? 'image';

        return (
          media && (
            <div
              className={classNames(
                `absolute radius-100 border border-2 border-white overflow-hidden bg-white w-40 h-40`
              )}
              style={{
                right: `${idx * 15}px`, // Position from left
                zIndex: maxVisibleItems - idx
              }}
              key={idx}
            >
              {
                mediaType === 'image' ?
                  <Image
                    src={media.url}
                    alt={`image-${idx}`}
                    className='w-40 h-40 object-cover'
                    type={media.type}
                  />
                  :
                  <VideoSrc
                    className='w-40 h-40 object-cover'
                    src={media.url}
                  />
              }
            </div>
          )
        )
      })}
      {cartItems.length > maxVisibleItems && (
        <div
          className='w-40 h-40 radius-100 flex a-items-center j-content-center bg-#F5F5F5 text-12 weight-500'
          style={{
            left: `${maxVisibleItems * 15}px`, // Place "+X" after last image
            zIndex: maxVisibleItems
          }}
        >
          <p className='color-#00000099'>
            +{cartItems.length - maxVisibleItems}
          </p>
        </div>
      )}
    </div>
  )
}

export default OverlappingImages
