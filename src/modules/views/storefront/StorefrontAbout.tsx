import Image from '@/modules/lib/components/image/Image'
import StorefrontNavBar from '@/modules/lib/components/nav-bar/StorefrontNavBar'
import React from 'react'
import {RxCalendar} from 'react-icons/rx'
import {FaRegUserCircle} from 'react-icons/fa'
import {IoBagCheckOutline} from 'react-icons/io5'
import Icon from '@/modules/lib/components/icon/Icon'

const StorefrontAbout = () => {
  return (
    <>
    <div className="bg-white w-full ">
        <StorefrontNavBar />

        <div className="app-width mt-80">
          <div className="relative">
              <div className="relative flex z-1 gap-50">
                <div className='w-60p'>
                  <div className="flex gap-15">
                    <Image src='billgram.png' className='w-80 h-80' alt='' />
                    <div className='a-self-center'>
                      <h3 className='text-35'>Bill<span className='text-green'>Gram</span></h3>
                      <p>Online store in your wardrobe</p>
                    </div>
                  </div>
                  <div className='mt-48'>
                    <h1 className='text-48 weight-700'>About BillGram</h1>
                    <p className='max-w-550 mt-20 text-20 line-height-38 letter-spacing-1 weight-400'>Launched in 2021, Billgram is the leading Asoebi fashion store for global wholesale trade. We serve millions of Buyers and suppliers around Nigeria.  </p>
                  </div>

                  <div className='flex mt-44 gap-30'>

                    <div className='w-fit text-left border-r border-lightest-grey w-200 '>
                      <RxCalendar className='inline-block w-40 h-40 m-15 ' />
                      <div className="text-16">Monthly unique visit</div>
                      <div className='text-24 weight-700 mt-15' >20,254</div>
                    </div>

                    <div className='w-fit text-left border-r border-lightest-grey w-200'>
                      <FaRegUserCircle className='inline-block w-40 h-40 m-15 ' />
                      <div className="text-16">Active Customers</div>
                      <div className='text-24 weight-700 mt-15' >12,000</div>
                    </div>

                    <div className='w-fit text-left w-200'>
                      <IoBagCheckOutline className='inline-block w-40 h-40 m-15 ' />
                      <div className="text-16">Product Sold</div>
                      <div className='text-24 weight-700 mt-15' >96,000</div>
                    </div>

                  </div>

                </div>
                <div className="relative w-full">
                    <Icon className='absolute z-0 inline w-fit t--10 r-0 h-full' name='store-about-dots-bg' />
                    <div className="pr-70 w-full grid grid-3-cols-1fr grid-3-rows-1fr w-full max-w-700 absolute r-0 h-430 gap-27 mt-50">
                      <div className=" grid-row-span-1 grid-col-span-2 grid grid-3-cols-1fr gap-17">
                        <div className='grid-col-span-2
                                        radius-t-l-0 radius-30 bg-cover 
                                        g|background-repeat:no-repeat; 
                                        g|background-image:url(https://res.cloudinary.com/codennerd/image/upload/v1689377575/WhatsApp_Image_2023-07-15_at_12.23.11_AM_sniizk.jpg);
                        '>
                        </div>
                        <div className='grid-col-span-1 
                                        radius-t-r-0 radius-30 bg-cover
                                        g|background-repeat:no-repeat; 
                                        g|background-image:url(https://res.cloudinary.com/codennerd/image/upload/v1689377575/WhatsApp_Image_2023-07-15_at_12.23.11_AM_sniizk.jpg);

                        '>
                        </div>
                      </div>
                      <div className="grid-col-span-1 grid-row-span-3
                                      radius-t-r-0 radius-b-l-0 radius-30 bg-cover
                                      g|background-repeat:no-repeat; 
                                      g|background-image:url(https://res.cloudinary.com/codennerd/image/upload/v1689377575/WhatsApp_Image_2023-07-15_at_12.23.11_AM_sniizk.jpg);
                      ">
                      </div>
                      <div className="h-full grid-row-span-2 grid-col-span-2
                                      radius-30 bg-cover
                                      g|background-repeat:no-repeat; 
                                      g|background-image:url(https://res.cloudinary.com/codennerd/image/upload/v1689377575/WhatsApp_Image_2023-07-15_at_12.23.11_AM_sniizk.jpg);
                      ">
                      </div>
                    </div> 
                </div>
              </div>          
          </div>
        </div>
    </div>

</>
  )
}

export default StorefrontAbout
