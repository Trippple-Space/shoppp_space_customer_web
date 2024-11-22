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
    console.log({ product })
    const [variants, setVariants] = useState(activeVariant ? [activeVariant] : product.variants)
    const [activeMedium, setActiveMedium] = useState(variants[0].media[0])

    return (

        <div className='flex flex-col w-fit gap-20 py-10'>
            <div className='w-600 h-600 relative'>
                <p className='w-fit absolute t-15 l-15'>
                    {
                        product.keywords.map((keyword) => (
                            <span className='text-green text-11 bg-light-green py-3 px-5 radius-5 m-2'>{keyword}</span> 
                        ))
                    }
                </p>
                <div className='h-full w-full'>
                    <Image
                        className='w-full h-full radius-5'
                        src={activeMedium.url}
                        alt='product'
                        type='image'
                    />
                </div>
            </div>
            {/* <div className='flex gap-10'>
                {
                    variants.map((variant): any => (
                        variant.media.map((medium) => (
                            <Image
                                className={cx('w-60 radius-3', {
                                    'border border-green border-2': activeMedium.url === medium.url
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