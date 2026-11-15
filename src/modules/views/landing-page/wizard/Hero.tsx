import Icon from '@/modules/lib/components/icon/Icon'
import React from 'react'
import Image from '@/modules/lib/components/image/Image'

const Hero = () => {
  return (
    <div className='bg-[#F0F0F0]'>
      <div className='relative app-width px-[10px] pb-[80px] lg:pb-[75px] lg:px-[40px] flex justify-between'>
        <div className='w-full lg:w-1/2 pt-[40px] mt-[30px] lg:pt-[80px] lg:ml-[50px]'>
          <div className='text-[#1F1B17] text-[38px] lg:text-[56px] font-extrabold w-full lg:w-fit letter-spacing-6'>
            <div className='bg-white px-[20px] tilt'>
              <p className='notilt'>ELEVATE</p>
            </div>
            <div className='px-[20px] pt-[20px] pb-[10px]'>YOUR</div>
            <div className='bg-[#FACE33] px-[20px] tilt'>
              <p className='notilt'>WARDROBE</p>
            </div>
          </div>

          <div className='text-[16px] lg:text-[20px] font-medium text-[#1F1B17] py-[20px] mt-[23px]'>
            <p>
              Discover Nigerian Fashion Heritage at Its Finest, Curated by
              Talented Sellers!
            </p>
          </div>
          <div className='flex gap-[34px] pt-[36px] items-center'>
            <div>
              <Icon name='Ellipse' className='w-[80px] h-[40px] lg:w-[100px] lg:h-[75px]' />
            </div>
            <div>
              <button className='border-none bg-black text-white text-[18px] lg:text-[18px] py-[10px] px-[20px] rounded-[5px] font-medium'>
                Get Started
              </button>
            </div>
          </div>
        </div>
        <div className='absolute right-0 bottom-0 hidden lg:flex items-end'>
          <Image
            className='w-fit bottom-0 h-[550px]'
            src='hero-image.svg'
            alt='Delivery'
          />
        </div>
      </div>
    </div>
  )
}

export default Hero
