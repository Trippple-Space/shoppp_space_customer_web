'use client'

import { useNavbarView } from '@/modules/lib/utility/hooks/views/use-navbar-view'
import { paths } from '@/modules/lib/utility/paths'
import useUserStore from '@/modules/lib/utility/store/user.store'
import config from '../../../../../../env'
import Link from 'next/link'
import React, { FC } from 'react'
import { useOrders } from '@/modules/lib/utility/hooks/use-orders'
import { useSavedVariant } from '@/modules/lib/utility/hooks/use-saved-variants'
import { onGoingOrderStatusQuery } from '@/modules/lib/utility/utility'
import { useRouter } from 'next/navigation'


interface IUserProfileDropdown {
  handleCloseDropdown: () => void
  setProfileModal?: any
}

const UserProfileDropdown: FC<IUserProfileDropdown> = ({
  handleCloseDropdown,
  setProfileModal
}) => {
  const { user, signOut } = useNavbarView()
  const { isAuthenticated } = useUserStore()
  const query: any = onGoingOrderStatusQuery;
     const router = useRouter()
  const { orders } = useOrders({
    filters: { status: { In: query } }
  })

  const { savedVariants } = useSavedVariant()

  const profileModals = [
    'orders',
    'saved items',
    'recently viewed',
    'recently searched'
  ]
  {/*'ratings & reviews', */}


  console.log({user})
  return (
    <>
      {/* Overlay */}
      <div
        className='fixed inset-0 bg-black opacity-10 z-10 sm:block hidden'
        onClick={handleCloseDropdown}
      />

      {/* Dropdown */}
      <div
        className='absolute font-inter r-0 l:t-54 t-50 w-360 z-20 sm:block hidden pb-64'
        style={{ height: isAuthenticated ? 'calc(100dvh - 64px)' : '336px' }}
      >
        <div className='bg-white g|box-shadow:0px|_|8px|_|16px|_|#494F5E1F; radius-8 border border-#00000014 color-#000000E0 h-full g|max-height:500px; scroll-y no-scrollbar'>
          <div className=''>
            {isAuthenticated && (
              <>
                <div className='flex items-center gap-8 p-24'>
                  <div className=''>
                    <img
                      className='l:w-60 l:h-60 w-40 h-40 border-solid border-0.5 border-#00000014 radius-50p'
                      src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user?.firstName}`}
                      alt='user'
                    />
                  </div>

                  <div className=''>
                    <p className='capitalize weight-600 text-14 line-height-22'>{`${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`}</p>
                    <p className='text-12 line-height-20 color-#00000099 weight-400'>
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className='border-t border-1 border-#00000014 py-20'>
                  {profileModals.map((modal, i) => (
                    <div
                      key={i}
                      className='py-10 px-24 hover:bg-grey-100 g|transition:0.3s pointer flex items-center gap-10 text-16'
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
                          {modal === 'saved items' ? `Saved items (${savedVariants.length})` : modal}
                        </p>
                      )}
                    </div>
                  ))}

                  <div
                    className='py-10 px-24 hover:bg-red-100 g|transition:0.3s pointer flex items-center gap-10 text-16'
                    onClick={() => signOut()}
                  >
                    <p className='line-height-24 weight-400 color-#D4280C g|transition:0.5s'>
                      Logout
                    </p>
                  </div>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className='flex flex-col gap-8 p-24 text-14'>
                <button
                  className='bg-green text-white py-12 px-16 radius-6 line-height-19 border border-none weight-500 pointer w-full hover:bg-darkgreen g|transition:0.5s disabled:bg-grey'
                    onClick={() => {router.push(paths.login)}}
                >
                  Login
                </button>
                <Link
                  className='bg-#F5F5F5 text-#333333 py-12 px-16 radius-6 line-height-19 text-center w-full weight-500 border border-none hover:pointer'
                  href={paths.signup}
                >
                  Sign Up
                </Link>
              </div>
            )}

            <div className='flex flex-col py-20 weight-400 text-16 line-height-24 border-t border-1 border-#00000014'>
              <Link
                href={config.VENDOR_CENTER_HOST}
                target='_blank'
                className='py-10 px-24 hover:bg-grey-100 g|transition:0.3s'
              >
                Sell on Asoebi.Africa
              </Link>
              <Link
                href={'/'}
                className='py-10 px-24 hover:bg-grey-100 g|transition:0.3s'
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserProfileDropdown
