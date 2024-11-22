'use client'
import StorefrontNavBar from '@/modules/lib/components/nav-bar/StorefrontNavBar'
import React from 'react'

const Storefront = ({ store }: { store: any }) => {
  return (
    <>
      <div className='bg-light-yellow w-full g|padding-top:60px; g|margin-top:-6px;'>
        <StorefrontNavBar />

        <div className='app-width mt-80 pb-70'>
          <div className=''>
            <h2 className='weight-500 text-58 letter-spacing-3 line-height-70 max-w-840'>
              Discover, style, and own {store.name}
            </h2>
            <p className='text-22 weight-300 g|letter-spacing:1.2px; line-height-38 max-w-700 mt-30'>
              {store.description}
            </p>
          </div>

          <div className='mt-85 max-w-600 '>
            <div className='flex space-between'>
              {[0, 0, 0, 0, 0].map(() => (
                <div className='bg-white w-fit round overflow-hidden border border-2 border-green p-1 '>
                  <div
                    className='w-90 h-90 bg-white round bg-cover'
                    style={{ background: `url(${store.thumbnail})` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className='w-450 hidden l:block
                g|box-shadow:-2px|_|8px|_|50px|_|4px|_|rgba(0,0,0,0.20)|_|inset; 
                bg-light-grey h-591 absolute r-0 b-0 radius-t-l-40 radius-b-l-40
                bg-cover border border-5 g|border-color:rgba(217,217,217,0.70); border-r-0 
            '
        style={{
          background: `url(${store.thumbnail})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      ></div>
    </>
  )
}

export default Storefront
