'use client'
import React, { FC, ReactNode, useEffect, useState } from 'react'
import Image from '../image/Image'
import OrdersModal from './profile-modal/OrdersModal'
import MiniCart from '../minicart/MiniCart'
import { cx } from '../../utility/utility'
import { usePathname } from 'next/navigation'
import { useNavbarView } from '../../utility/hooks/views/use-navbar-view'
import { useAuthGuard } from '../../utility/hooks/use-auth-guard'

import AsoebiLinksModal from './AsoebiLinksModal'
import MobileNav from './mobile-nav/MobileNav'
import { PiStorefrontBold } from 'react-icons/pi'
import { SlArrowDown } from 'react-icons/sl'
import UserProfileDropdown from './profile-modal/UserProfileDropdown'
import Link from 'next/link'
import RecentlySearchItems from './profile-modal/RecentlySearchItems '
import RecentlyViewedItems from './profile-modal/RecentlyViewedItems '
import SavedItemsModal from './profile-modal/SavedItems'
import { AiOutlineUser } from 'react-icons/ai'

interface IBaseNavBar {
  links: ReactNode
  parent: any
}

const BaseNavBar: FC<IBaseNavBar> = ({ links, parent }) => {
  useAuthGuard()  // TODO: refactor to rely on Next 13 auth middleware
  const [userProfileDropdown, setUserProfileDropdown] = useState<boolean>(false)

  const [profileModal, setProfileModal] = useState<string>('')

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

  useEffect(() => {
    if (asoebiModal || profileModal || userProfileDropdown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [asoebiModal, profileModal, userProfileDropdown])

  return (
    <div
      className={`fixed w-full t-0 l-0 bg-white z-5 ${(parent === 'checkout' || parent === 'orders') && 'border-b border-b-#00000014 md:py-3 py-5.8625'
        }`}
    >
      <div
        className={cx(
          'flex a-items-center relative app-width space-between py-12',
          {
            'max-w-1400!': pathname.startsWith('/products/')
          }
        )}
      >
        <Link href={'/'} className='w-fit'>
          <Image
            className='w-50 l:w-70'
            src='asoebi-stacked-logo.svg'
            alt='logo'
            type='logo'
          />
        </Link>

        <div className='flex md:j-content-center w-100p j-content-end'>
          {links}
        </div>

        {asoebiModal && (
          <>
            <div
              className='fixed inset-0 bg-black opacity-10 z-10'
              onClick={handleAsoebiDropdown}
            />

            <div className='l:absolute r-180 t-70 l:p-10 bg-white z-20 radius-8'>
              <AsoebiLinksModal sellOnAsoebi={true} />
            </div>
          </>
        )}

        <div className='l:block flex l:flex a-items-center l:gap-30 gap-10 w-fit relative j-self-end'>
          <div
            className={`l:cursor-pointer ${parent === 'checkout' ? 'hidden' : 'hidden l:block'
              }`}
            onClick={handleAsoebiDropdown}
          >
            <p className='flex a-items-center  weight-500'>
              <PiStorefrontBold className='w-30' />
              <span>Asoebi</span>
              <SlArrowDown className='w-10 ml-5' />
            </p>
          </div>
          <div className='flex sm:gap-24 gap-20 a-items-center'>
            {parent !== 'checkout' && <MiniCart />}
            <div
              className='md:flex hidden gap-12 a-items-center text-black cursor-pointer'
              onClick={handleUserProfileDropdown}
            >
              <div className='h-fit'>
                {user ? (
                  <Image
                    className='w-34 h-34 border-solid border-2 border-grey-300 radius-50p'
                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user?.username}`}
                    alt='user'
                  />
                ) : (
                  <AiOutlineUser className='w-24 h-24' />
                )}
              </div>
              <SlArrowDown className='w-12 h-12' />
            </div>

            {userProfileDropdown && (
              <UserProfileDropdown
                handleCloseDropdown={handleCloseDropdown}
                setProfileModal={setProfileModal}
              />
            )}
            <MobileNav
              handleCloseDropdown={handleCloseDropdown}
              setProfileModal={setProfileModal}
            />
          </div>
        </div>
        {profileModal && (
          <>
            <OrdersModal
              modalOpen={profileModal === 'orders'}
              handleCloseModal={() => setProfileModal('')}
              data={undefined}
            />
            <RecentlySearchItems
              modalOpen={profileModal === 'recently searched'}
              handleCloseModal={() => setProfileModal('')}
              data={undefined}
            />
            <RecentlyViewedItems
              modalOpen={profileModal === 'recently viewed'}
              handleCloseModal={() => setProfileModal('')}
              data={undefined}
            />
            <SavedItemsModal
              modalOpen={profileModal === 'saved items'}
              handleCloseModal={() => setProfileModal('')}
              data={undefined}
            />
          </>
        )}
      </div>
    </div>
  )
}
export default BaseNavBar
