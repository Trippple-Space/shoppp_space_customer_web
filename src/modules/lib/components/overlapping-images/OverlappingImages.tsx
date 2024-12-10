import React from 'react'
import Image from '../image/Image'
import classNames from 'classnames'

const OverlappingImages = ({ orderItem }: any) => {
  // Limit the number of items displayed to 3
  const cartItems = orderItem?.cart?.cartItems || []
  const maxVisibleItems = 3

  return (
    <div className='flex gap-10 a-items-center relative'>
      {cartItems.slice(0, maxVisibleItems).map((variant: any, idx: number) => {
        const media = variant.variant.media?.[0]
        return (
          media && (
            <div
              className={classNames(
                `absolute radius-100 border border-2 border-white overflow-hidden bg-white w-40 h-40  mr-10`
              )}
              style={{
                right: `${idx * 15}px`, 
                zIndex: maxVisibleItems - idx
              }}
              key={idx}
            >
              <Image
                src={media.url}
                alt={`image-${idx}`}
                className='w-40 h-40 object-cover'
                type={media.type}
              />
            </div>
          )
        )
      })}
      {cartItems.length > maxVisibleItems && (
        <div
          className='w-35 h-35 radius-100 flex a-items-center j-content-center bg-#F5F5F5 text-12 weight-500'
          style={{
            left: `${maxVisibleItems * 15}px`,
            zIndex: maxVisibleItems + 1
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
