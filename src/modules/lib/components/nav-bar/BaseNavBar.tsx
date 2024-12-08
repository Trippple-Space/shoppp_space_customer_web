'use client'
import React, { FC, ReactNode, useState } from 'react'
import Image from '../image/Image'
import OrdersModal from './profile-modal/OrdersModal'
import MiniCart from '../minicart/MiniCart'
import { cx, getGreeting } from '../../utility/utility'
import { usePathname } from 'next/navigation'
import { useNavbarView } from '../../utility/hooks/views/use-navbar-view'
import { useAuthGuard } from '../../utility/hooks/use-auth-guard'

import AsoebiLinksModal from './AsoebiLinksModal'
import MobileNav from './mobile-nav/MobileNav'
import { PiStorefrontBold } from 'react-icons/pi'
import { SlArrowDown } from 'react-icons/sl'
import UserProfileDropdown from './profile-modal/UserProfileDropdown'
import Link from 'next/link'

interface IBaseNavBar {
  links: ReactNode
}

const BaseNavBar: FC<IBaseNavBar> = ({ links }) => {
  useAuthGuard() // TODO: refactor to rely on Next 13 auth middleware
  const [userProfileDropdown, setUserProfileDropdown] = useState<boolean>(false)
  const [userOrderDropdown, setUserOrderDropdown] = useState<boolean>(false)
  const [asoebiModal, setAsoebiModal] = useState<boolean>(false)
  const pathname = usePathname()
  const { user } = useNavbarView()

  const handleUserProfileDropdown = () => {
    setUserProfileDropdown(prev => !prev)
  }

  const handleAsoebiDropdown = () => {
    setAsoebiModal(prev => !prev)
  }

  const handleCloseDropdown = () => {
    setUserProfileDropdown(false)
  }

  return (
    <div className='fixed w-full t-0 l-0 bg-white z-5 border-b border-b-#00000014'>
      <div
        className={cx(
          'flex a-items-center relative app-width space-between py-15',
          {
            'max-w-1400!': pathname.startsWith('/products/')
          }
        )}
      >
        <Link href={'/'} className='w-fit'>
          <Image
            className='w-70 l:w-100'
            src='new-asoebi-logo.svg'
            alt='logo'
            type='logo'
          />
        </Link>

        <div className=' flex l:j-content-center w-100p j-content-end'>
          {links}
        </div>

        {asoebiModal && (
          <>
            <div
              className='fixed inset-0 bg-black opacity-10 z-10'
              onClick={handleAsoebiDropdown}
            />

            <div className='l:absolute r-250 t-70 l:p-10 bg-white z-20 radius-8'>
              <AsoebiLinksModal sellOnAsoebi={true} />
            </div>
          </>
        )}

        <div className='l:block flex l:flex a-items-center l:gap-30 gap-10 w-fit relative j-self-end'>
          <div
            className='hidden l:block l:cursor-pointer'
            onClick={handleAsoebiDropdown}
          >
            <p className='flex a-items-center  weight-500'>
              <PiStorefrontBold className='w-30' />
              <span>Asoebi</span>
              <SlArrowDown className='w-10 ml-5' />
            </p>
          </div>
          <div className='flex l:gap-20 gap-10 a-items-center'>
            <MiniCart />

            <div
              className='flex gap-7 a-items-center   text-grey-700 cursor-pointer'
              onClick={handleUserProfileDropdown}
            >
              <div className='h-fit'>
                <Image
                  className='l:w-40 l:h-40 w-30 h-30 border-solid border-2 border-grey-300 radius-50p'
                  src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user?.username}`}
                  alt='user'
                />
              </div>
              <div className='h-fit'>
                <div className='text-grey-500 whitespace-nowrap l:text-12 text-10'>
                  {getGreeting()}
                </div>
                <div className='text-green weight-600 l:text-14 text-12'>
                  {`${user?.profile?.firstName || 'Guest User'}`}
                </div>
              </div>
            </div>

            {userProfileDropdown && (
              <UserProfileDropdown
                handleCloseDropdown={handleCloseDropdown}
                setUserOrderDropdown={setUserOrderDropdown}
              />
            )}
            <MobileNav />
          </div>
          {userOrderDropdown && (
            <OrdersModal
              modalOpen={userOrderDropdown}
              handleCloseModal={() => setUserOrderDropdown(false)}
              data={undefined}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default BaseNavBar
