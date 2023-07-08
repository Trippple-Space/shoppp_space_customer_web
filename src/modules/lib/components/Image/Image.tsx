import NextImage from 'next/image'
import { FC } from 'react'
import { ImageSrcFolder, getImageDir } from '../../utility/utility'

export interface IImage {
    src: string,
    alt: string,
    className?: string,
    type?: 'image' | 'logo' | 'icon',
}

const Image: FC<IImage> = ({className, src, alt, type = 'image'}) => {
  return (
    <img
        className={className}
        src={getImageDir((type + 's' as ImageSrcFolder), src)}
        alt={alt}
    />
  )
}


export default Image