'use client'

import classNames from 'classnames'
import NextImage from 'next/image'
import React, { useState } from 'react'
import { ImageSrcFolder, getImageDir } from '../../utility/utility'

export interface IImageProps {
  src: string
  alt: string
  className?: string
  type?: 'image' | 'logo' | 'icon'
  onClick?: () => void
  width?: number
  height?: number
  fill?: boolean
  hasLoader?: boolean
}

const extractSize = (className: string | undefined, prefix: 'w' | 'h'): number | undefined => {
  if (!className) return undefined

  const regex = new RegExp(`${prefix}-(\\d+)`)
  const match = className.match(regex)

  return match ? Number(match[1]) : undefined
}

const Image = React.forwardRef<HTMLImageElement, IImageProps>(
  ({ className, src, alt, type = 'image', onClick, width, height, fill, hasLoader }, ref) => {
    
    const [loaded, setLoaded] = useState(false);
    const autoWidth = width ?? extractSize(className, 'w') ?? 0
    const autoHeight = height ?? extractSize(className, 'h') ?? 0

    return src ? (
      <>
      {!loaded && hasLoader && (
        <div className="absolute g|inset:0px z-2 pulsing-multi-color-bg" 
        />
      )}
      <NextImage
        ref={ref}
        className={classNames(
          "transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0", className
        )}
        src={getImageDir((type + 's') as ImageSrcFolder, src)}
        alt={alt}
        onClick={onClick}
        loading='lazy'
        onLoadingComplete={() => setLoaded(true)}
        width={autoWidth}
        height={autoHeight}
        fill={fill}
      />
      </>
    ) : null
  }
)

Image.displayName = 'Image'
export default Image
