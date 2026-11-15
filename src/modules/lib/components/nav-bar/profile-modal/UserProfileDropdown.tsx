'use client';

import { useNavbarView } from '@/modules/lib/utility/hooks/views/use-navbar-view';
import { paths } from '@/modules/lib/utility/paths';
import useUserStore from '@/modules/lib/utility/store/user.store';
import config from '../../../../../../env';
import Link from 'next/link';
import React, { FC } from 'react';
import { useOrders } from '@/modules/lib/utility/hooks/use-orders';
import { useSavedVariant } from '@/modules/lib/utility/hooks/use-saved-variants';
import { onGoingOrderStatusQuery } from '@/modules/lib/utility/utility';
import { useRouter } from 'next/navigation';

interface IUserProfileDropdown {
  handleCloseDropdown: () => void;
  setProfileModal?: any;
}

const UserProfileDropdown: FC<IUserProfileDropdown> = ({
  handleCloseDropdown,
  setProfileModal,
}) => {
  const { user, signOut } = useNavbarView();
  const { isAuthenticated } = useUserStore();
  const query: any = onGoingOrderStatusQuery;
  const router = useRouter();
  const { orders } = useOrders({
    filters: { status: { In: query } },
  });

  const { savedVariants } = useSavedVariant();

  const profileModals = [
    'orders',
    'saved items',
    'recently viewed',
    'recently searched',
  ];
  {
    /*'ratings & reviews', */
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-10 z-[10px] sm:block hidden"
        onClick={handleCloseDropdown}
      />

      {/* Dropdown */}
      <div
        className="absolute font-inter right-0 lg:top-[54px] top-[50px] w-[360px] z-[20px] sm:block hidden pb-[64px]"
        style={{ height: isAuthenticated ? 'calc(100dvh - 64px)' : '336px' }}
      >
        <div className="bg-white shadow-[0px_8px_16px_#494F5E1F] rounded-[8px] border border-[#00000014] text-[#000000E0] h-full max-h-[500px] scroll-y no-scrollbar">
          <div className="">
            {isAuthenticated && (
              <>
                <div className="flex items-center gap-[8px] p-[24px]">
                  <div className="">
                    <img
                      className="lg:w-[60px] lg:h-[60px] w-[40px] h-[40px] border-solid border-0.5 border-[#00000014] rounded-full"
                      src={`https://api.dicebear.com/7.x/thumbs/png?seed=${user?.firstName}`}
                      alt="user"
                    />
                  </div>

                  <div className="">
                    <p className="capitalize font-semibold text-[14px] leading-[22px]">{`${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`}</p>
                    <p className="text-[12px] leading-[20px] text-[#00000099] font-normal">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="border-t border border-[#00000014] py-[20px]">
                  {profileModals.map((modal, i) => (
                    <div
                      key={i}
                      className="py-[10px] px-[24px] hover:bg-[#F7F6F5] transition-all duration-300 cursor-pointer flex items-center gap-[10px] text-[16px]"
                      onClick={() => {
                        setProfileModal(modal === 'orders' ? '' : modal);
                        handleCloseDropdown();
                      }}
                    >
                      {modal === 'orders' ? (
                        <Link
                          href={'/orders'}
                          className="leading-[24px] font-normal capitalize w-full"
                        >
                          Orders ({orders.length})
                        </Link>
                      ) : (
                        <p className="leading-[24px] font-normal capitalize">
                          {modal === 'saved items'
                            ? `Saved items (${savedVariants.length})`
                            : modal}
                        </p>
                      )}
                    </div>
                  ))}

                  <div
                    className="py-[10px] px-[24px] hover:bg-red-100 transition-all duration-300 cursor-pointer flex items-center gap-[10px] text-[16px]"
                    onClick={() => signOut()}
                  >
                    <p className="leading-[24px] font-normal text-[#D4280C] transition-all duration-500">
                      Logout
                    </p>
                  </div>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="flex flex-col gap-[8px] p-[24px] text-[14px]">
                <button
                  className="bg-brand text-white py-[12px] px-[16px] rounded-[6px] leading-[19px] border border-none font-medium cursor-pointer w-full hover:bg-brand-hover transition-all duration-500 disabled:bg-[#676767]"
                  onClick={() => {
                    router.push(paths.login);
                  }}
                >
                  Login
                </button>
                <Link
                  className="bg-[#F5F5F5] text-[#333333] py-[12px] px-[16px] rounded-[6px] leading-[19px] text-center w-full font-medium border border-none hover:cursor-pointer"
                  href={paths.signup}
                >
                  Sign Up
                </Link>
              </div>
            )}

            <div className="flex flex-col py-[20px] font-normal text-[16px] leading-[24px] border-t border border-[#00000014]">
              <Link
                href={config.VENDOR_CENTER_SIGNUP}
                target="_blank"
                className="py-[10px] px-[24px] hover:bg-[#F7F6F5] transition-all duration-300"
              >
                Sell on Shoppp Space
              </Link>
              <Link
                href={paths.contact_us}
                target="_blank"
                className="py-[10px] px-[24px] hover:bg-[#F7F6F5] transition-all duration-300"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfileDropdown;
