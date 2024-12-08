'use client'

import { useOrders } from '@/modules/lib/utility/hooks/use-orders'
import { useNavbarView } from '@/modules/lib/utility/hooks/views/use-navbar-view'
import useUserStore from '@/modules/lib/utility/store/user.store'
import Link from 'next/link'
import React, { FC } from 'react'

interface IUserProfileDropdown {
  handleCloseDropdown: () => void
  setUserOrderDropdown?: any
}

const UserProfileDropdown: FC<IUserProfileDropdown> = ({
  handleCloseDropdown,
  setUserOrderDropdown
}) => {
  const { user, signOut, openAddressModal } = useNavbarView()
  const { isAuthenticated } = useUserStore()
  const { orders } = useOrders()

  return (
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
            <img
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
          <Link
            href='/orders'
            className='p-15 hover:bg-grey-100 pointer flex items-center gap-10 text-grey-700'
            onClick={() => {
              // setUserOrderDropdown(true);
              handleCloseDropdown()
            }}
          >
            <div className='text-12 weight-500'>Orders ({orders.length})</div>
          </Link>

          <div
            className='p-15 hover:bg-grey-100 pointer flex items-center gap-10 text-grey-700'
            onClick={() => {
              openAddressModal()
              handleCloseDropdown()
            }}
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
            <div className=''>{isAuthenticated ? 'Logout' : 'Login'}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserProfileDropdown
