"use client"
import Image from '@/modules/lib/components/image/Image'
import StorefrontNavBar from '@/modules/lib/components/nav-bar/StorefrontNavBar'
import React, { useEffect } from 'react'
import {RxCalendar} from 'react-icons/rx'
import {FaRegUserCircle} from 'react-icons/fa'
import {IoBagCheckOutline} from 'react-icons/io5'
import Icon from '@/modules/lib/components/icon/Icon'
import { useStoreProductsView } from '@/modules/lib/utility/hooks/views/use-store-products-view'

const StorefrontAbout = ({ store }: { store: any }) => { 
  const { products } = useStoreProductsView()
  useEffect(() => {
    console.log(products)
  }, [products])
  // console.log(products?.[0].variants?.[0].media?.[0].url)
  return (
    <>
    <div className="bg-white w-full ">
        <StorefrontNavBar />

        <div className="app-width mt-80">
          <div className="relative">
              <div className="relative flex z-1 gap-50">
                <div className='w-60p'>
                  <div className="flex gap-15">
                    <Image src={store.thumbnail} className='w-80 h-80 radius-8' alt='' />
                    <div className='a-self-center'>
                      <h3 className='text-35'>
                        {store.name}
                        {/* <span className='text-green'>Gram</span> */}
                      </h3>
                      <p>{store.byline || 'Online store in your wardrobe'}</p>
                    </div>
                  </div>
                  <div className='mt-48'>
                    <h1 className='text-48 weight-600'>About {store.name}</h1>
                    <p className='max-w-550 mt-20 text-20 line-height-38 letter-spacing-1 weight-300'>
                      {store.description}
                    </p>
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
                    <div className="pr-70 w-full grid grid-3-cols-1fr grid-3-rows-1fr w-full max-w-700 absolute r-0 h-430 gap-27 mt-70">
                      <div className=" grid-row-span-1 grid-col-span-2 grid grid-3-cols-1fr gap-17">
                        <div className='grid-col-span-2
                          radius-t-l-0 radius-30' 
                          style={{
                            backgroundImage: `url(${products?.[0]?.variants?.[0]?.media?.[0].url})`,  
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover'
                          }
                        }>
                        </div>
                        <div className='grid-col-span-1 
                          radius-t-r-0 radius-30'
                          style={{
                            backgroundImage: `url(${products?.[0]?.variants?.[1]?.media?.[0].url})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover'
                          }}
                        >
                        </div>
                      </div>
                      <div className="grid-col-span-1 grid-row-span-3
                        radius-t-r-0 radius-b-l-0 radius-30"
                        style={{
                          backgroundImage: `url(${products?.[0]?.variants?.[2]?.media?.[0].url})`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center',
                          backgroundSize: 'cover'
                        }
                      }>
                      </div>
                      <div className="h-full grid-row-span-2 grid-col-span-2
                        radius-30"
                        style={{
                          backgroundImage: `url(${products?.[1]?.variants?.[0]?.media?.[0].url})`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center',
                          backgroundSize: 'cover'
                        }
                      }>
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
