'use client'

import { ILayout } from '@/app/layout'
import AuthHeader from '@/modules/lib/components/auth-header/AuthHeader'
import Image from '@/modules/lib/components/image/Image'
import { paths } from '@/modules/lib/utility/paths'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC } from 'react'

const layout: FC<ILayout> = ({ children }) => {
  const pathName = usePathname()
  const path = pathName.split('/')[2]





  const VendorSignUp = () => {
    return (
      <div className="hidden l:block text-right">
        <span>Not a vendor? </span>
        <Link href={paths.signup} className='text-green-700 pointer'>Sign up here instead</Link>
      </div>
    )
  }

  const CustomerSignUp = () => {
    return (
      <div className="text-right relative hidden l:block">
        <span>Do you want to sell? </span>
        <Link href={paths.vendor_signup} className="text-green-700 cursor-pointer">
          Join now
        </Link>
      </div>)
  }







  return (
    <div className="flex h-100vh w-full overflow-hidden">

      <Link href={'/'} className="l:hidden w-full bg-green  t-0 fixed z-10">
        <Image
          className="w-100 h-30 my-20 m-15"
          src="new-asoebi-logo-white.svg"
          alt="logo"
          type="logo"
        />
      </Link>
      <div className="l:w-50p hidden l:block p-15">
        <div className="bg-green flex flex-col h-100p radius-15">
          <div>
            <Link href={'/'}>
              <Image
                className='w-115 h-31 ml-40 mt-20'
                src='new-asoebi-logo-white.svg'
                alt='logo'
                type='logo'
              />
            </Link>
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
      <div className="w-full l:w-50p p-15 flex flex-col h-100p md:mt-50 mt-20 l:mt-0">

        <div className="relative mx-5">


          <div className="w-full h-100vh relative  flex j-content-center">

            <div style={{ maxHeight: '' }} className='flex flex-col overflow-auto j-content-center mb-10'>
              <div className=" mb-20">
                <div className='mt-10'> {pathName === paths.vendor_signup ?
                  <VendorSignUp /> : <CustomerSignUp />}
                </div>
              </div>
              {pathName !== paths.vendor_signup && <AuthHeader activeTab={path} />}
              {children}

              {/**/}
              {/* <div className="flex j-content-between a-items-center  text-grey-800 mt-20 mb-20"> */}
              {/**/}
              {/*   <div className="border border-#00000014 w-50p mr-10"></div> */}
              {/*   <span style={{ fontStyle: "italic" }} className="">or</span> */}
              {/*   <div className="border border-#00000014 w-50p ml-10"></div> */}
              {/* </div> */}
              {/* <div className='mb-20'> */}
              {/*   <div className="flex bg-whitesmoke a-items-center j-content-center p-10 gap-5 radius-5 cursor-pointer"> */}
              {/*     <FcGoogle className="w-24 h-24"/> */}
              {/*     <span className="weight-500">Continue with Google</span> */}
              {/*   </div> */}
              {/* </div> */}
              <p className="text-center text-14 pb-20 mt-20">By continuing, you agree to the Asoebi.africa <span className="color-link pointer">Terms & Conditions</span> and <span className="color-link pointer">
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
