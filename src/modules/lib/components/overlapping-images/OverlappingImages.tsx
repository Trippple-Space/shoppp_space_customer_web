import React from 'react'
import Image from '../image/Image'
import classNames from 'classnames'
import { checkMediaType, getCartItems } from '../../utility/utility'
import VideoSrc from '../video-src/VideoSrc'

const OverlappingImages = ({ orderItem }: any) => {
  const cartItems = getCartItems(orderItem?.cart?.storeGroups)
  const maxVisibleItems = 4

  return (
    <div className='flex gap-[10px] items-center relative'>
      {cartItems.slice(0, maxVisibleItems).map((variant: any, idx: number) => {
        const media = variant.variant.media?.[0]
        const mediaType = checkMediaType(variant.variant.media?.[0].url) ?? 'image';

        return (
          media && (
            <div
              className={classNames(
                `absolute rounded-[100px] border border-[2px] border-white overflow-hidden bg-white w-[40px] h-[40px] relative`
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
                    className='w-[40px] h-[40px] object-cover'
                    type={media.type}
                  />
                  :
                  <VideoSrc
                    className='w-[40px] h-[40px] object-contain'
                    src={media.url}
                    hasLoader={true}
                  />
              }
            </div>
          )
        )
      })}
      {cartItems.length > maxVisibleItems && (
        <div
          className='w-[40px] h-[40px] rounded-[100px] flex items-center justify-center bg-[#F5F5F5] text-[12px] font-medium'
          style={{
            left: `${maxVisibleItems * 15}px`, // Place "+X" after last image
            zIndex: maxVisibleItems
          }}
        >
          <p className='text-[#00000099]'>
            +{cartItems.length - maxVisibleItems}
          </p>
        </div>
      )}
    </div>
  )
}

export default OverlappingImages
