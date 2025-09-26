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
    <div className="hidden l:block text-right">
      <span>Not a vendor? </span>
      <Link href={paths.signup} className="text-green-700 pointer">
        Sign up here instead
      </Link>
    </div>
  )

  const CustomerSignUp = () => (
    <div className="text-right relative hidden l:block">
      <span>Do you want to sell? </span>
      <Link
        href={config.VENDOR_CENTER_HOST}
        target="_blank"
        className="text-green-700 cursor-pointer"
      >
        Join now
      </Link>
    </div>
  )

  return (
    <>
    { <div className="flex h-100vh w-full overflow-hidden">
      <Link href="/" className="l:hidden w-full bg-green t-0 fixed z-10">
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
            <Link href="/">
              <Image
                className="w-160 h-50 mt-20 ml-20"
                src="Main logo white.svg"
                alt="logo"
                type="logo"
              />
            </Link>
          </div>
          <div className="relative w-100p h-100p">
            <Image
              className="absolute h-95p w-fit r-0 b-0"
              src="carton-man-0.png"
              alt="Delivery"
            />
          </div>
        </div>
      </div>

      <div className="w-full l:w-50p p-15 flex flex-col h-100p md:mt-50 mt-20 l:mt-0">
        <div className="relative mx-5">
          <div className="w-full h-100vh relative flex j-content-center">
            <div
              style={{ maxHeight: '' }}
              className="flex flex-col overflow-auto j-content-center mb-10"
            >
              <div className="mb-20">
                <div className="mt-10">
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

              {children}

              <>
               {pathName != paths.google &&  <div className="flex j-content-between a-items-center text-grey-800 mt-20 mb-20">
                  <div className="border border-#00000014 w-50p mr-10"></div>
                  <span style={{ fontStyle: 'italic' }}>or</span>
                  <div className="border border-#00000014 w-50p ml-10"></div>
                </div>}

                <div className="mb-20" onClick={googleOauthInitializer}>
                  <div className="flex bg-whitesmoke a-items-center j-content-center p-10 gap-5 radius-5 cursor-pointer">
                    <FcGoogle className="w-24 h-24" />
                    <span className="weight-500">Continue with Google</span>
                  </div>
                </div>
              </>

              <p className="text-center text-14 pb-20 mt-20">
                By continuing, you agree to the Asoebi.africa{' '}
                <Link
                  className="color-link pointer"
                  href={paths.legal_document}
                >
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <span className="color-link pointer">
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
