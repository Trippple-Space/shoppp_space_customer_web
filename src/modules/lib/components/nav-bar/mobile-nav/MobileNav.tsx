'use client'
import { useAuthGuard } from '@/modules/lib/utility/hooks/use-auth-guard'
import { useNavbarView } from '@/modules/lib/utility/hooks/views/use-navbar-view'
import useUserStore from '@/modules/lib/utility/store/user.store'
import React, { FC, useState } from 'react'
import { PiStorefront } from 'react-icons/pi'
import { RxCross1, RxHamburgerMenu } from 'react-icons/rx'
import { SlArrowDown } from 'react-icons/sl'
import AsoebiLinksModal from '../AsoebiLinksModal'
import Link from 'next/link'
import { paths } from '@/modules/lib/utility/paths'
import config from '../../../../../../env'
import { useOrderView } from '@/modules/lib/utility/hooks/views/use-order-view'

interface IMobileNav {
  handleCloseDropdown: () => void
  setProfileModal?: any
}

const MobileNav: FC<IMobileNav> = ({
  handleCloseDropdown,
  setProfileModal
}) => {
  useAuthGuard() // TODO: refactor to rely on Next 13 auth middleware
  const [asoebiMobileModal, setAsoebiMobileModal] = useState<boolean>(false)
  const [hamburgerMenu, setHamburgerMenu] = useState<boolean>(false)
  const { user, signOut } = useNavbarView()
  const { isAuthenticated } = useUserStore()

  const { orders } = useOrderView({
  filters: { status: { In: ['ONGOING'] } }
})


  const handleAsoebiMobileDropdown = () => {
    setAsoebiMobileModal(prev => !prev)
  }

  const toogleHamburgerMenu = () => {
    setHamburgerMenu(prev => !prev)
  }

  const profileModals = [
    'orders',
    'saved items',
    'ratings & reviews',
    'recently viewed',
    'recently searched'
  ]

  return (
    <div className='md:hidden flex a-items-center'>
      {hamburgerMenu ? (
        <RxCross1 onClick={toogleHamburgerMenu} className='w-24 h-24' />
      ) : (
        <RxHamburgerMenu onClick={toogleHamburgerMenu} className='w-24 h-24' />
      )}

      {hamburgerMenu && (
        <div
          className='md:hidden z-5 overflow-hidden bg-white r-0 w-100p t-64 fixed border-t border-1 border-#00000014 g|box-shadow:0px|_|8px|_|16px|_|#494F5E1F;'
          style={{ height: 'calc(100dvh - 64px)' }}
        >
          <div className='scroll-y no-scrollbar flex flex-col space-between h-full py-24'>
            <div className='flex flex-col gap-14'>
              <div
                className='flex a-items-center space-between w-100p pb-20 border-b border-b-#00000014 pointer sm:px-36 px-24'
                onClick={handleAsoebiMobileDropdown}
              >
                <p className='flex a-items-center gap-12 weight-500'>
                  <PiStorefront className='w-24 h-24' />
                  <span className='text-16 line-height-24 font-inter'>
                    Asoebi
                  </span>
                </p>
                <SlArrowDown className='w-12 h-12' />
              </div>
              {asoebiMobileModal && (
                <div className='sm:px-36 px-24'>
                  <AsoebiLinksModal sellOnAsoebi={false} />
                </div>
              )}

              {isAuthenticated && (
                <div
                  className={`${
                    asoebiMobileModal && 'border-t border-1 border-#00000014'
                  }`}
                >
                  {profileModals.map((modal, i) => (
                    <div
                      key={i}
                      className='py-10 hover:bg-grey-100 g|transition:0.3s pointer flex items-center gap-10 text-16 sm:px-36 px-24'
                      onClick={() => {
                        setProfileModal(modal === 'orders' ? '' : modal)
                        handleCloseDropdown()
                      }}
                    >
                      {modal === 'orders' ? (
                        <Link
                          href={'/orders'}
                          className='line-height-24 weight-400 capitalize w-full'
                        >
                          Orders ({orders.length})
                        </Link>
                      ) : (
                        <p className='line-height-24 weight-400 capitalize'>
                          {modal}
                        </p>
                      )}
                    </div>
                  ))}

                  <div
                    className='py-10 hover:bg-red-100 g|transition:0.5s pointer flex items-center gap-10 text-16 sm:px-36 px-24'
                    onClick={() => signOut()}
                  >
                    <p className='line-height-24 weight-400 color-#D4280C'>
                      Logout
                    </p>
                  </div>
                </div>
              )}

              <div
                className={`flex flex-col pt-5 text-16 weight-400 line-height-24 ${
                  (asoebiMobileModal || isAuthenticated) &&
                  'border-t border-1 border-#00000014'
                }`}
              >
                <Link
                  href={config.VENDOR_CENTER_HOST}
                  target='_blank'
                  className='py-10 hover:bg-grey-100 sm:px-36 px-24 g|transition:0.3s'
                >
                  Sell on asoebi.africa
                </Link>
                <p className='py-10 hover:bg-grey-100 sm:px-36 px-24 g|transition:0.3s'>
                  Help Center
                </p>
              </div>
            </div>

            {isAuthenticated ? (
              <div className='flex items-center gap-8 py-16 sm:px-36 px-24 border-t border-1 border-#00000014 mt-30'>
                <div className=''>
                  <img
                    className='w-60 h-60 border-solid border-0.5 border-#00000014 radius-50p'
                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user?.username}`}
                    alt='user'
                  />
                </div>

                <div className=''>
                  <p className='capitalize weight-600 text-14 line-height-22'>{`${user?.profile.firstName} ${user?.profile.lastName}`}</p>
                  <p className='text-12 line-height-20 color-#00000099 weight-400'>
                    {user?.email}
                  </p>
                </div>
              </div>
            ) : (
              <div className='flex flex-col gap-8 sm:px-36 px-24'>
                <button
                  className='bg-green text-white py-12 px-16 border-none radius-6 w-full text-14 line-height-19 hover:pointer font-inter hover:bg-darkgreen g|transition:0.3s disabled:bg-grey weight-500'
                  onClick={() => signOut()}
                >
                  Login
                </button>
                <Link
                  className='bg-none text-black py-12 px-16 radius-6 w-full border border-2 border-#000000E0 text-center text-14 weight-500 line-height-19 pointer font-inter'
                  href={paths.signup}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MobileNav
