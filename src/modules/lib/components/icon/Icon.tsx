import Image from 'next/image'
import React, { FC } from 'react'
import { getImageDir } from '../../utility/utility'

interface IIcon {
    name: string,
    ext?: string,
    width?: number,
    height?: number,
    alt?: string,
    className?: string
}
const Icon: React.FC<IIcon> = ({name, ext ='.svg', width = 18, height = 18, alt= 'icon', className = ''}) => {
  
  return (
    <img
      className={'inline-block ' + className}
      src={getImageDir('icons', `${name}${ext}`)}
      width={width}
      height={height}
      alt={alt}
    />
  )
}

export default Icon