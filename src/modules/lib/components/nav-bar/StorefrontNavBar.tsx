"use client";

import React, { useState } from "react";
import { Store } from "../../utility/types/store.interface";
import SearchInput from "../search-input/SearchInput";
import MiniCart from "../minicart/MiniCart";
import { HiMenuAlt3 } from "react-icons/hi";
import { useNavbarView } from "../../utility/hooks/views/use-navbar-view";
import MobileNav from "./mobile-nav/MobileNav";
import UserProfileDropdown from "./profile-modal/UserProfileDropdown";
import OrdersModal from "./profile-modal/OrdersModal";
import RecentlySearchItems from "./profile-modal/RecentlySearchItems ";
import RecentlyViewedItems from "./profile-modal/RecentlyViewedItems ";
import SavedItemsModal from "./profile-modal/SavedItems";

const StorefrontNavBar = ({ store }: { store?: Store }) => {
  const { user } = useNavbarView();
  const [userProfileDropdown, setUserProfileDropdown] =
    useState<boolean>(false);
  const [profileModal, setProfileModal] = useState<string>("");

  const handleUserProfileDropdown = () => {
    setUserProfileDropdown((prev) => !prev);
  };

  const handleCloseDropdown = () => {
    setUserProfileDropdown(false);
  };

  return (
    <nav className="flex flex-row j-content-between a-items-center border border-0 border-b-1 border-b-#00000014 sm:py-14 py-12 l:px-80 md:px-60 sm:px-40 px-24">
      <div className="md:flex-grow-0 flex-grow-1">
        <h1 className="font-robotoMono weight-500 md:text-28 sm:text-26 text-22 w-fit">
          {store?.name}
        </h1>
      </div>

      <SearchInput placeholder={"Search"} component={"store"} storeSlug={store?.slug} />
      <div className="">
        <div className="flex flex-row md:gap-24 gap-10 a-items-center">
          <MiniCart />
          <div
            className="flex flex-row md:gap-24 gap-20 a-items-center"
            onClick={handleUserProfileDropdown}
          >
            <div className="sm:flex hidden flex-row a-items-center gap-8 p-4 pl-12 border border-#00000014 radius-999 pointer">
              <HiMenuAlt3 className="w-24 h-24" />
              <img
                src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user?.username}`}
                alt="user"
                className="w-42 h-42 object-fit round border border-#00000014"
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
        <div className="l:px-80 md:px-60 sm:px-40 px-24 relative t--46 sm:block hidden">
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
              modalOpen={profileModal === "orders"}
              handleCloseModal={() => setProfileModal("")}
              data={undefined}
            />
            <RecentlySearchItems
              modalOpen={profileModal === "recently searched"}
              handleCloseModal={() => setProfileModal("")}
              data={undefined}
            />
            <RecentlyViewedItems
              modalOpen={profileModal === "recently viewed"}
              handleCloseModal={() => setProfileModal("")}
              data={undefined}
            />
            <SavedItemsModal
              modalOpen={profileModal === "saved items"}
              handleCloseModal={() => setProfileModal("")}
              data={undefined}
            />
          </>
        )}
      </div>
    </nav>
  );
};

export default StorefrontNavBar;
