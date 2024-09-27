'use client'

import NextImage from 'next/image'
import { FC, useState } from 'react'
import { ImageSrcFolder, getImageDir } from '../../utility/utility'

export interface IImage {
    src: string,
    alt: string,
    className?: string,
    type?: 'image' | 'logo' | 'icon',
    onClick?: Function
}

const Image: FC<IImage> = ({className, src, alt, type = 'image', onClick}) => {
  const [hidden, setHidden] = useState(true)
  return (
    <img
      className={className}
      src={getImageDir((type + 's' as ImageSrcFolder), src)}
      alt={alt}
      // hidden={hidden}
      onClick={() => onClick?.()}
      loading="lazy"
      onLoad={() => setHidden(false)}
    />
  )
}


export default Image