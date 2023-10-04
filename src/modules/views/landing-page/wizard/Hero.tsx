import Icon from '@/modules/lib/components/icon/Icon'
import React from 'react'
import Image from "@/modules/lib/components/image/Image";


const Hero = () => {
  return (
    <div className="bg-offwhitegrey">
        <div className="app-width px-10 pb-30 l:pb-0 l:px-40 flex space-between">
            <div className="w-100p l:w-50p pt-40 l:pt-80 l:ml-50">
                <div className="text-black text-38 l:text-64 weight-800 w-100p l:w-75p letter-spacing-6">
                    <div className="bg-white px-20 tilt">
                        <p className="notilt">ELEVATE</p>
                    </div>
                    <div className="px-20 py-7">
                        YOUR
                    </div>
                    <div className="bg-yellow px-20 tilt">
                        <p className="notilt">WARDROBE</p>
                    </div>
                </div>

                <div className="text-16 l:text-24 weight-500 text-black py-20">
                    <p>Discover Nigerian Fashion Heritage at Its Finest, Curated by Talented Sellers!</p>
                </div>
                <div className="flex gap-30 pt-20">
                    <div><Icon name='Ellipse' className='w-80 h-40 l:w-100 l:h-75' /></div>
                    <div><button className='border-none bg-black text-white text-18 l:text-24 py-10 px-20 radius-5 weight-500'>Get Started</button></div>
                </div>
            </div>
            <div className="relative b-0 hidden l:flex a-items-end">
                <Image
                    className='w-fit b-0 h-85p'
                    src='landingpage.png'
                    alt='Delivery'
                />
            </div>
        </div>
    </div>
  )
}

export default Hero