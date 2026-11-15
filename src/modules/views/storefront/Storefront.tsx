'use client'
import StorefrontNavBar from '@/modules/lib/components/nav-bar/StorefrontNavBar'
import React from 'react'

const Storefront = ({ store }: { store: any }) => {
  return (
    <>
      <div className='bg-[#FFE68BB2] w-full [padding-top:60px] [margin-top:-6px]'>
        <StorefrontNavBar />

        <div className='app-width mt-[80px] pb-[70px]'>
          <div className=''>
            <h2 className='font-medium text-[58px] letter-spacing-3 leading-[70px] max-w-[840px]'>
              Discover, style, and own {store.name}
            </h2>
            <p className='text-[22px] font-light [letter-spacing:1.2px] leading-[38px] max-w-[700px] mt-[30px]'>
              {store.description}
            </p>
          </div>

          <div className='mt-[85px] max-w-[600px] '>
            <div className='flex justify-between'>
              {[0, 0, 0, 0, 0].map(() => (
                <div className='bg-white w-fit rounded-full overflow-hidden border border-[2px] border-brand p-[1px] '>
                  <div
                    className='w-[90px] h-[90px] bg-white rounded-full bg-cover'
                    style={{ background: `url(${store.thumbnail})` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className='w-[450px] hidden lg:block
                shadow-[-2px_8px_50px_4px_rgba(0,0,0,0.20)_inset] 
                bg-[#A8A6A6] h-[591px] absolute right-0 bottom-0 rounded-tl-[40px] rounded-bl-[40px]
                bg-cover border border-[5px] [border-color:rgba(217,217,217,0.70)] border-r-0 
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
