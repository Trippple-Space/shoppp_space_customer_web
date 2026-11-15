'use client';

import React, { useState } from 'react';
import { Store } from '../../utility/types/store.interface';
import SearchInput from '../search-input/SearchInput';
import MiniCart from '../minicart/MiniCart';
import { HiMenuAlt3 } from 'react-icons/hi';
import { useNavbarView } from '../../utility/hooks/views/use-navbar-view';
import MobileNav from './mobile-nav/MobileNav';
import UserProfileDropdown from './profile-modal/UserProfileDropdown';
import OrdersModal from './profile-modal/OrdersModal';
import RecentlySearchItems from './profile-modal/RecentlySearchItems ';
import RecentlyViewedItems from './profile-modal/RecentlyViewedItems ';
import SavedItemsModal from './profile-modal/SavedItems';
import Image from '../image/Image';

const StorefrontNavBar = ({ store }: { store?: Store }) => {
  const { user } = useNavbarView();
  const [userProfileDropdown, setUserProfileDropdown] =
    useState<boolean>(false);
  const [profileModal, setProfileModal] = useState<string>('');

  const handleUserProfileDropdown = () => {
    setUserProfileDropdown((prev) => !prev);
  };

  const handleCloseDropdown = () => {
    setUserProfileDropdown(false);
  };

  return (
    <nav className="flex flex-row justify-between gap-[20px] items-center border border-0 border-b-1 border-b-[#00000014] sm:py-[14px] py-[12px] lg:px-[80px] md:px-[60px] sm:px-[40px] px-[24px] fixed w-full bg-white z-[10px]">
      <div
        className="md:flex-grow-0 grow flex flex-row"
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'block',
          maxWidth: '100%',
        }}
      >
        <h1
          className="font-robotoMono font-medium md:text-[28px] sm:text-[26px] text-[22px] w-fit"
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block',
            maxWidth: '100%',
          }}
        >
          {store?.name}
        </h1>
      </div>

      <SearchInput
        placeholder={'Search'}
        component={'store'}
        storeSlug={store?.slug}
      />
      <div className="">
        <div className="flex flex-row md:gap-[24px] gap-[10px] items-center">
          <MiniCart />
          <div
            className="flex flex-row md:gap-[24px] gap-[20px] items-center"
            onClick={handleUserProfileDropdown}
          >
            <div className="sm:flex hidden flex-row items-center gap-[8px] p-[4px] pl-[12px] border border-[#00000014] rounded-[999px] cursor-pointer">
              <HiMenuAlt3 className="w-[24px] h-[24px]" />
              <img
                src={`https://api.dicebear.com/7.x/thumbs/png?seed=${user?.firstName}`}
                alt="user"
                className="w-[42px] h-[42px] object-fit rounded-full border border-[#00000014]"
              />
            </div>
          </div>
          <div className="sm:hidden block">
            <MobileNav
              handleCloseDropdown={handleCloseDropdown}
              setProfileModal={setProfileModal}
            />
          </div>
        </div>
        <div className="lg:px-[80px] md:px-[60px] sm:px-[40px] px-[24px] relative -top-[46px] sm:block hidden">
          {userProfileDropdown && (
            <UserProfileDropdown
              handleCloseDropdown={handleCloseDropdown}
              setProfileModal={setProfileModal}
            />
          )}
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
    </nav>
  );
};

export default StorefrontNavBar;
