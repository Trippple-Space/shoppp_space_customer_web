'use client'

import { ILayout } from '@/app/layout'
import AuthHeader from '@/modules/lib/components/auth-header/AuthHeader'
import Image from '@/modules/lib/components/image/Image'
import Input from '@/modules/lib/components/input/Input'
import { paths } from '@/modules/lib/utility/paths'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { FC, useEffect, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'

const layout: FC<ILayout> = ({ children }) => {
  const pathName = usePathname()
  const path = pathName.split('/')[2]





  const VendorSignUp = () => {
    return (
      <div className="text-right w-full l:w-80p mt-53 mx-25 hidden l:block">
        <span>Not a vendor? </span>
        <Link href={paths.signup} className='text-green-700 pointer'>Sign up here instead</Link>
      </div>
    )
  }
  
  const CustomerSignUp = () => {
    return ( <div className="text-right relative w-full l:w-80p hidden l:block">
        <div className="absolute r-0 mx-25 mt-53 z-1">
        <span>Do you want to sell? </span>
        <Link href={paths.vendor_signup} className="text-green-700 cursor-pointer">
          Join now
        </Link>
          </div>
      </div>)
  }







  return (
    <div className="flex h-100vh w-full">
      <div className="l:w-50p hidden l:block m-15">
        <div className="bg-green flex flex-col h-100p radius-15 overflow-hidden">
          <div>
            <Image
              className='w-115 h-31 ml-40 mt-20'
              src='new-asoebi-logo-white.svg'
              alt='logo'
              type='logo'
            />
          </div>
          <div className='relative w-100p h-100p'>
            <Image
              className='absolute h-95p w-fit r-0 b-0'
              src='carton-man-0.png'
              alt='Delivery'
            />
          </div>
        </div>
      </div>
      <div className="w-100p l:w-50p h-full overflow-hidden">
        {pathName === paths.vendor_signup ?
          <VendorSignUp /> : <CustomerSignUp/>
         }
      <div className="relative mx-25 flex-col flex h-full items-center j-content-center">
        
       <div className="l:hidden w-full bg-green t-0 fixed">
          <Image
            className="w-100 h-30 my-20 m-15"
            src="new-asoebi-logo-white.svg"
            alt="logo"
            type="logo"
            />
        </div>
    
        <div className="w-full l:w-60p h-full flex flex-col j-content-center">
            {pathName !== paths.vendor_signup && <AuthHeader activeTab={path} />}
            {children}
          <div className="mt-30">
              {/* <div className="flex j-content-between a-items-center  text-grey-800">
          
                <div className="border border-#00000014 w-50p mr-10"></div>
                  <span style={{ fontStyle: "italic" }} className="">or</span>
               <div className="border border-#00000014 w-50p ml-10"></div>
              </div>
              <div className='mb-20'>
                <div className="flex bg-whitesmoke a-items-center j-content-center p-10 gap-5 mt-30 radius-5 cursor-pointer">
                  <FcGoogle className="w-24 h-24"/>
                  <span className="weight-500">Continue with Google</span>
                </div>
              </div> */}
                <p className="text-center text-14">By continuing, you agree to the Asoebi.africa <span className="color-link pointer">Terms & Conditions</span> and <span className="color-link pointer">
                  Privacy Policy
                  </span>
                </p>
          </div>
        </div>
          
      </div>
      </div>
    </div>
  )
}

export default layout
