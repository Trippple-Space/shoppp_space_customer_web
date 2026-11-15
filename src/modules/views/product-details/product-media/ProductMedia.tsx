'use client'

import { Product, ProductVariant } from '@/modules/lib/utility/types/product.interface'
import React, { FC, useState } from 'react'
import Image from '@/modules/lib/components/image/Image'
import { cx } from '@/modules/lib/utility/utility'


interface IProductMedia {
    product: Product,
    activeVariant: ProductVariant | null
}

const ProductMedia: FC<IProductMedia> = ({ product, activeVariant }) => {

    const [variants, setVariants] = useState(activeVariant ? [activeVariant] : product.variants)
    const [activeMedium, setActiveMedium] = useState(variants[0].media[0])

    return (

        <div className='flex flex-col w-fit gap-[20px] py-[10px]'>
            <div className='w-[600px] h-[600px] relative'>
                <p className='w-fit absolute top-[15px] left-[15px]'>
                    {
                        product.keywords.map((keyword) => (
                            <span className='text-brand text-[11px] bg-brand-tint py-[3px] px-[5px] rounded-[5px] m-[2px]'>{keyword}</span> 
                        ))
                    }
                </p>
                <div className='h-full w-full'>
                    <Image
                        className='w-full h-full rounded-[5px]'
                        src={activeMedium.url}
                        alt='product'
                        type='image'
                    />
                </div>
            </div>
            {/* <div className='flex gap-[10px]'>
                {
                    variants.map((variant): any => (
                        variant.media.map((medium) => (
                            <Image
                                className={cx('w-[60px] rounded-[3px]', {
                                    'border border-brand border-[2px]': activeMedium.url === medium.url
                                })}
                                src={medium.url}
                                alt='product'
                                type='image'
                                onClick={() => setActiveMedium(medium)}
                            />                            
                        ))
                    ))
                }
            </div> */}
        </div>
    )
}

export default ProductMedia