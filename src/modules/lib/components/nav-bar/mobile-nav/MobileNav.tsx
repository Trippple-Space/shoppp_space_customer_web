'use client'
import { useAuthGuard } from '@/modules/lib/utility/hooks/use-auth-guard'
import { useNavbarView } from '@/modules/lib/utility/hooks/views/use-navbar-view'
import useUserStore from '@/modules/lib/utility/store/user.store'
import React, { FC, useEffect, useState } from 'react'
import { RxCross1, RxHamburgerMenu } from 'react-icons/rx'
import Link from 'next/link'
import { paths } from '@/modules/lib/utility/paths'
import config from '../../../../../../env'
import { useOrders } from '@/modules/lib/utility/hooks/use-orders'
import { onGoingOrderStatus, onGoingOrderStatusQuery } from '@/modules/lib/utility/utility'
import { useRouter } from 'next/navigation'


interface IMobileNav {
  handleCloseDropdown: () => void
  setProfileModal?: any
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  hideTrigger?: boolean
  className?: string
}

const MobileNav: FC<IMobileNav> = ({
  handleCloseDropdown,
  setProfileModal,
  isOpen,
  onOpenChange,
  hideTrigger = false,
  className,
}) => {
  useAuthGuard() // TODO: refactor to rely on Next 13 auth middleware
  const [internalOpen, setInternalOpen] = useState(false);
  const hamburgerMenu = isOpen !== undefined ? isOpen : internalOpen;
  const setHamburgerMenu = (val: boolean) => {
    if (onOpenChange) onOpenChange(val);
    else setInternalOpen(val);
  };
  //const [hamburgerMenu, setHamburgerMenu] = useState<boolean>(false)
  const { user, signOut } = useNavbarView()
    const router = useRouter()
  const { isAuthenticated } = useUserStore()

  const query: any = onGoingOrderStatusQuery;

  const { orders } = useOrders({
    filters: { status: { In: query } }
  })

  useEffect(() => {
    if (hamburgerMenu) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [hamburgerMenu]);

  const toggleHamburgerMenu = () => {
    setHamburgerMenu(!hamburgerMenu);
  };

  const profileModals = [
    'orders',
    'saved items',
    'recently viewed',
    'recently searched'
  ]
  {/*'ratings & reviews', */ }

  return (
    <div className='md:hidden flex items-center'>
      {!hideTrigger && (
        hamburgerMenu ? (
          <RxCross1 onClick={toggleHamburgerMenu} className="w-[24px] h-[24px]" />
        ) : (
          <RxHamburgerMenu onClick={toggleHamburgerMenu} className="w-[24px] h-[24px]" />
        )
      )}
      {hamburgerMenu && (
        <div
          className={`md:hidden z-[5px] overflow-hidden bg-white right-0 w-full top-[64px] fixed border-t border border-[#00000014] shadow-[0px_8px_16px_#494F5E1F] ${className}`}
          style={{ height: 'calc(100dvh - 64px)' }}
        >
          <div className='scroll-y no-scrollbar flex flex-col justify-between h-full py-[24px]'>
            <div className='flex flex-col gap-[14px]'>
              {isAuthenticated && (
                <div>
                  {profileModals.map((modal, i) => (
                    <div
                      key={i}
                      className='py-[10px] hover:bg-[#F7F6F5] transition-all duration-300 cursor-pointer flex items-center gap-[10px] text-[16px] sm:px-[36px] px-[24px]'
                      onClick={() => {
                        setProfileModal(modal === 'orders' ? '' : modal)
                        handleCloseDropdown()
                      }}
                    >
                      {modal === 'orders' ? (
                        <Link
                          href={'/orders'}
                          className='leading-[24px] font-normal capitalize w-full'
                        >
                          Orders ({orders.length})
                        </Link>
                      ) : (
                        <p className='leading-[24px] font-normal capitalize'>
                          {modal}
                        </p>
                      )}
                    </div>
                  ))}

                  <div
                    className='py-[10px] hover:bg-red-100 transition-all duration-500 cursor-pointer flex items-center gap-[10px] text-[16px] sm:px-[36px] px-[24px]'
                    onClick={() =>  signOut()}
                  >
                    <p className='leading-[24px] font-normal text-[#D4280C]'>
                      Logout
                    </p>
                  </div>
                </div>
              )}

              <div
                className={`flex flex-col pt-[5px] text-[16px] font-normal leading-[24px] ${isAuthenticated &&
                  'border-t border border-[#00000014]'
                  }`}
              >
                <Link
                  href={config.VENDOR_CENTER_SIGNUP}
                  target='_blank'
                  className='py-[10px] hover:bg-[#F7F6F5] sm:px-[36px] px-[24px] transition-all duration-300'
                >
                  Sell on Shoppp Space
                </Link>
                <p className='py-[10px] hover:bg-[#F7F6F5] sm:px-[36px] px-[24px] transition-all duration-300'>
                  Help Center
                </p>
              </div>
            </div>

            {isAuthenticated ? (
              <div className='flex items-center gap-[8px] py-[16px] sm:px-[36px] px-[24px] border-t border border-[#00000014] mt-[30px]'>
                <div className=''>
                  <img
                    className='w-[60px] h-[60px] border-solid border-0.5 border-[#00000014] rounded-full'
                    src={`https://api.dicebear.com/7.x/thumbs/png?seed=${user?.firstName}`}
                    alt='user'
                  />
                </div>

                <div className=''>
                  <p className='capitalize font-semibold text-[14px] leading-[22px]'>{`${user?.profile?.firstName} ${user?.profile?.lastName}`}</p>
                  <p className='text-[12px] leading-[20px] text-[#00000099] font-normal'>
                    {user?.email}
                  </p>
                </div>
              </div>
            ) : (
              <div className='flex flex-col gap-[8px] sm:px-[36px] px-[24px]'>
                <button
                  className='bg-brand text-white py-[12px] px-[16px] border-none rounded-[6px] w-full text-[14px] leading-[19px] hover:cursor-pointer font-inter hover:bg-brand-hover transition-all duration-300 disabled:bg-[#676767] font-medium'
                  onClick={() => {router.push(paths.login)}}
                >
                  Login
                </button>
                <Link
                  className='bg-transparent text-black py-[12px] px-[16px] rounded-[6px] w-full border border-[2px] border-[#000000E0] text-center text-[14px] font-medium leading-[19px] cursor-pointer font-inter'
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
  );
}

export default MobileNav
