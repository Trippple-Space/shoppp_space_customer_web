'use client'

import { ILayout } from '@/app/layout'
import AuthHeader from '@/modules/lib/components/auth-header/AuthHeader'
import Image from '@/modules/lib/components/image/Image'
import { paths } from '@/modules/lib/utility/paths'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useEffect } from 'react'
import config from '../../../env'
import { FcGoogle } from 'react-icons/fc'
import { useGoogleOauth } from '@/modules/lib/utility/hooks/use-google-oauth'
import { useAuthGuard } from '@/modules/lib/utility/hooks/use-auth-guard'
import endpoints from '@/modules/lib/utility/endpoints'

const Layout: FC<ILayout> = ({ children }) => {
  const router = useRouter()
  const pathName = usePathname()
  const path = pathName.split('/')[2] || ''
  const { googleOauthInitializer } = useGoogleOauth()
  const { user, checking } = useAuthGuard()  

  const isAuthRoute = pathName.startsWith('/auth')

  useEffect(() => {
    if (!checking && user && isAuthRoute) {
      router.replace('/')
    }
  }, [checking, user, isAuthRoute, router])

  if (checking) return null

  if (user && isAuthRoute) return null

  const VendorSignUp = () => (
    <div className="hidden lg:block text-right">
      <span>Not a vendor? </span>
      <Link href={paths.signup} className="text-brand-hover cursor-pointer">
        Sign up here instead
      </Link>
    </div>
  )

  const CustomerSignUp = () => (
    <div className="text-right relative hidden lg:block">
      <span>Do you want to sell? </span>
      <Link
        href={config.VENDOR_CENTER_HOST}
        target="_blank"
        className="text-brand-hover cursor-pointer"
      >
        Join now
      </Link>
    </div>
  )

  return (
    <>
    { <div className="flex h-screen w-full overflow-hidden">
      <Link
        href="/"
        className="lg:hidden w-full bg-brand top-0 fixed z-[10px] px-[15px] py-[18px] text-[20px] font-bold text-white"
      >
        Shoppp Space
      </Link>

      <div className="lg:w-1/2 hidden lg:block p-[15px]">
        <div className="bg-brand flex flex-col h-full rounded-[15px]">
          <div>
            <Link
              href="/"
              className="inline-block mt-[20px] ml-[20px] text-[28px] font-bold text-white"
            >
              Shoppp Space
            </Link>
          </div>
          <div className="relative w-full h-full">
            <Image
              className="absolute !h-[95%] !w-fit right-0 bottom-0"
              src="carton-man-0.png"
              alt="Delivery"
              width={1000}
            />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 p-[15px] flex flex-col h-full md:mt-[50px] mt-[20px] lg:mt-0">
        <div className="relative mx-[5px]">
          <div className="w-full h-screen relative flex justify-center">
            <div
              style={{ maxHeight: '' }}
              className="flex flex-col overflow-auto justify-center mb-[10px]"
            >
              <div className="mb-[20px]">
                <div className="mt-[10px]">
                  {pathName === paths.vendor_signup ? (
                    <VendorSignUp />
                  ) : (
                    <CustomerSignUp />
                  )}
                </div>
              </div>

              {pathName !== paths.vendor_signup && (
                <AuthHeader activeTab={path} />
                )}
                
                <div className='w-full overflow-auto'>
                {children}
                    <>
               {pathName != paths.google &&  <div className="flex justify-between items-center text-[#59534E] mt-[20px] mb-[20px]">
                  <div className="border border-[#00000014] w-1/2 mr-[10px]"></div>
                  <span style={{ fontStyle: 'italic' }}>or</span>
                  <div className="border border-[#00000014] w-1/2 ml-[10px]"></div>
                </div>}

                <div className="mb-[20px]" onClick={googleOauthInitializer}>
                  <div className="flex bg-[#F5F5F5] items-center justify-center p-[10px] gap-[5px] rounded-[5px] cursor-pointer">
                    <FcGoogle className="w-[24px] h-[24px]" />
                    <span className="font-medium">Continue with Google</span>
                  </div>
                </div>
              </>
                </div>



          

              <p className="text-center text-[14px] pb-[20px] mt-[20px]">
                By continuing, you agree to the Shoppp Space{' '}
                <Link
                  className="color-link cursor-pointer"
                  href={paths.legal_document}
                >
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <span className="color-link cursor-pointer">
                  <Link href={paths.legal_document}>Privacy Policy</Link>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>}
    </>
      
  )
}

export default Layout
