'use client'
import React, { FC, ReactNode, useEffect, useState } from 'react'
import Image from '../image/Image'
import OrdersModal from './profile-modal/OrdersModal'
import MiniCart from '../minicart/MiniCart'
import { cx, getGreeting } from '../../utility/utility'
import { usePathname } from 'next/navigation'
import { useNavbarView } from '../../utility/hooks/views/use-navbar-view'
import { useAuthGuard } from '../../utility/hooks/use-auth-guard'
import useUserStore from '../../utility/store/user.store'
import { useOrders } from '../../utility/hooks/use-orders'
import { PiStorefront } from 'react-icons/pi'
import Link from 'next/link'
import { paths } from '../../utility/paths'
import { TbWorld } from 'react-icons/tb'
import { RxHamburgerMenu } from 'react-icons/rx'
import AsoebiLinksModal from './AsoebiLinksModal'
import { SlArrowDown } from 'react-icons/sl'

interface IBaseNavBar {
  links: ReactNode
}

const BaseNavBar: FC<IBaseNavBar> = ({ links }) => {
  useAuthGuard() // TODO: refactor to rely on Next 13 auth middleware
  const [userProfileDropdown, setUserProfileDropdown] = useState<boolean>(false)
  const [userOrderDropdown, setUserOrderDropdown] = useState<boolean>(false)
  const [asoebiModal, setAsoebiModal] = useState<boolean>(false)
  const [asoebiMobileModal, setAsoebiMobileModal] = useState<boolean>(false)
  const [hamburgerMenu, setHamburgerMenu] = useState<boolean>(false)
  const pathname = usePathname()
  const { user, signOut, openAddressModal } = useNavbarView()
  const { isAuthenticated } = useUserStore()

  const { orders } = useOrders()

  const handleUserProfileDropdown = () => {
    setUserProfileDropdown(prev => !prev)
  }

  const handleAsoebiDropdown = () => {
    setAsoebiModal(prev => !prev)
  }
  const handleAsoebiMobileDropdown = () => {
    setAsoebiMobileModal(prev => !prev)
  }

  const toogleHamburgerMenu = () => {
    setHamburgerMenu(prev => !prev)
  }

  const handleCloseDropdown = () => {
    setUserProfileDropdown(false)
  }

  return (
    <div className='fixed w-full t-0 l-0 bg-white border-b border-whitesmoke z-5'>
      <div
        className={cx('flex a-items-center app-width space-between py-15', {
          'max-w-1400!': pathname.startsWith('/products/')
        })}
      >
        <div className='w-fit'>
          <Image
            className='w-70 l:w-100'
            src='new-asoebi-logo.svg'
            alt='logo'
            type='logo'
          />
        </div>

        <div className='w-fit text-center'>{links}</div>

        <div className='l:block l:flex l:a-items-center gap-30 w-fit relative j-self-end'>
          <div
            className='hidden l:block l:cursor-pointer'
            onClick={handleAsoebiDropdown}
          >
            <p className='flex a-items-center gap-10 weight-500'>
              <PiStorefront />
              Asoebi
            </p>
          </div>
          {asoebiModal && (
            <>
              <div
                className='fixed inset-0 bg-black opacity-10 z-10'
                onClick={handleAsoebiDropdown}
              />
              <div className='l:absolute r-0 t-70 l:p-10 bg-white z-20 radius-8 w-150p'>
                <AsoebiLinksModal sellOnAsoebi={true} />
              </div>
            </>
          )}

          <div className='flex l:gap-20 gap-12 a-items-center'>
            <MiniCart />
            <div
              className='flex gap-7 items-center w-fit h-fit m-auto radius-50 text-grey-700 pointer relative'
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
                <div className='whitespace-nowrap text-green weight-600 l:text-14 text-12'>{`${
                  user?.profile?.firstName || 'Guest User'
                }`}</div>
              </div>
            </div>
            <div className='l:hidden relative'>
              <RxHamburgerMenu onClick={toogleHamburgerMenu} />
              {hamburgerMenu && (
                <div
                  className='l:hidden flex flex-col space-between
                  bg-#F5F5F5 r-0 w-100p t-60 p-20 h-70p fixed'
                >
                  <div className='flex flex-col gap-25'>
                    <div
                      className='flex a-items-center space-between w-100p h-60 pb-20 border-b border-b-#00000014'
                      onClick={handleAsoebiMobileDropdown}
                    >
                      <p className='flex a-items-center gap-10 weight-500'>
                        <PiStorefront />
                        Asoebi
                      </p>
                      <SlArrowDown className='w-20' />
                    </div>
                    {asoebiMobileModal && (
                      <div>
                        <AsoebiLinksModal sellOnAsoebi={false} />
                      </div>
                    )}
                    <div className='flex flex-col gap-20'>
                      <Link href={paths.vendor_signup} target='_blank'>
                        Sell on asoebi.africa
                      </Link>
                      <p>Help Center</p>
                    </div>
                  </div>
                  <div className='flex flex-col gap-15'>
                    <button
                      className='bg-green text-white py-8 l:py-10 radius-6 w-full border 
                                    text-10 l:text-12 hover:pointer font-inter
                                    hover:bg-darkgreen g|transition:0.5s disabled:bg-grey weight-600'
                      style={{ background: isAuthenticated ? 'red' : '' }}
                      onClick={() => signOut()}
                    >
                      {isAuthenticated ? 'Logout' : 'Login'}
                    </button>
                    {!isAuthenticated && (
                      <Link
                        className='bg-none text-black py-8 l:py-10 radius-6 w-full border text-center
                                    text-10 hover:pointer font-inter'
                        href={paths.signup}
                      >
                        Sign Up
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {userProfileDropdown && (
            <>
              {/* Overlay */}
              <div
                className='fixed inset-0 bg-black opacity-10 z-10'
                onClick={handleCloseDropdown}
              />

              {/* Dropdown */}
              <div className='absolute r-0 l:t-60 t-50 bg-white g|box-shadow:0px|_|-2px|_|10px|_|rgba(0,0,0,0.10); radius-8 z-20'>
                <div className='flex items-center gap-10 p-20'>
                  <div className=''>
                    <Image
                      className='l:w-60 l:h-60 w-40 h-40 border-solid border-2 border-grey-300 radius-50p'
                      src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user?.username}`}
                      alt='user'
                    />
                  </div>

                  <div className=''>
                    <div className='weight-500 l:text-18 text-14 whitespace-nowrap flex items-center gap-20'>
                      <div className='capitalize'>
                        {user?.profile.firstName || 'Guest'}{' '}
                        {user?.profile.lastName || 'User'}
                      </div>
                    </div>
                    <div className='l:text-10 text-8 text-green weight-600'>
                      {user?.email}
                    </div>
                  </div>
                </div>

                <div className='border-t border-5 border-grey-200'>
                  <div
                    className='p-15 hover:bg-grey-100 pointer flex items-center gap-10 text-grey-700'
                    onClick={() => {
                      setUserOrderDropdown(true)
                      handleCloseDropdown()
                    }}
                  >
                    <div className='text-12 weight-500'>
                      Orders ({orders.length})
                    </div>
                  </div>

                  <div
                    className='p-15 hover:bg-grey-100 pointer flex items-center gap-10 text-grey-700'
                    onClick={openAddressModal}
                  >
                    <div className='text-12 weight-500'>Address book</div>
                  </div>

                  {/* <div className='p-15 hover:bg-grey-100 pointer flex items-center gap-10 text-grey-700'>
                                        <div className="text-12 weight-500">Close account</div>
                                    </div> */}
                </div>

                <div className='border-t border-5 border-grey-200 pointer'>
                  <div
                    className='l:p-20 p-10 text-center text-12 flex items-center justify-center gap-10 w-fit mx-auto weight-500 text-green'
                    style={{ color: isAuthenticated ? 'red' : '' }}
                    onClick={() => signOut()}
                  >
                    <div className=''>
                      {isAuthenticated ? 'Logout' : 'Login'}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
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
