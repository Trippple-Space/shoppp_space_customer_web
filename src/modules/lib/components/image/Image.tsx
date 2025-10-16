'use client'

import NextImage from 'next/image'
import React, { useState } from 'react'
import { ImageSrcFolder, getImageDir } from '../../utility/utility'

export interface IImageProps {
  src: string
  alt: string
  className?: string
  type?: 'image' | 'logo' | 'icon'
  onClick?: () => void
}

const Image = React.forwardRef<HTMLImageElement, IImageProps>(
  ({ className, src, alt, type = 'image', onClick }, ref) => {
    const [hidden, setHidden] = useState(true)

    return src ? (
      <img
        ref={ref}
        className={className}
        src={getImageDir((type + 's') as ImageSrcFolder, src)}
        alt={alt}
        onClick={onClick}
        loading='lazy'
        onLoad={() => setHidden(false)}
      />
    ) : null
  }
)

Image.displayName = 'Image'
export default Image
