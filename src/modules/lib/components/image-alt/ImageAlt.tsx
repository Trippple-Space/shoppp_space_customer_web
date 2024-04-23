'use client'
import { FC } from 'react'
import Icon from '../icon/Icon'

export interface IImage {
    src: string
    className?: string
    type?: 'image' | 'logo' | 'icon' | unknown
    onClick?: Function
    width?: number
    height?: number
    ext?: string
    iconClassName?: string
}

const ImageAlt: FC<IImage> = ({className, src, width , height, type, onClick, iconClassName}) => {
  return (
    <>
        {
            type == 'image' ?
            <div 
                className={className}
                style={{
                backgroundImage: `url(${src || 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.CbnlATT_jbAeLrkZUOt8xAHaEO%26pid%3DApi&f=1&ipt=aa751399ece28d50d1301b7f48aafb96c63f196f9399c7caac4640ec4247ccd5&ipo=images'})`,
                backgroundPosition: `center`,
                backgroundSize: `cover`,
                backgroundRepeat: `no-repeat`,
                }
            } onClick={() => onClick?.()}></div>

            : <Icon className={iconClassName} height={height} width={width} ext='' name={src} />
        }
    </>
  )
}


export default ImageAlt