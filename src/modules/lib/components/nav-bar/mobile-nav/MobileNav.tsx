"use client";
import { useAuthGuard } from "@/modules/lib/utility/hooks/use-auth-guard";
import { useOrders } from "@/modules/lib/utility/hooks/use-orders";
import { useNavbarView } from "@/modules/lib/utility/hooks/views/use-navbar-view";
import useUserStore from "@/modules/lib/utility/store/user.store";
import { usePathname } from "next/navigation";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { PiStorefrontBold } from "react-icons/pi";
import { RxHamburgerMenu } from "react-icons/rx";
import { SlArrowDown } from "react-icons/sl";
import AsoebiLinksModal from "../AsoebiLinksModal";
import Link from "next/link";
import { paths } from "@/modules/lib/utility/paths";
import config from '../../../../../../env'

function MobileNav() {
  useAuthGuard(); // TODO: refactor to rely on Next 13 auth middleware
  const [asoebiMobileModal, setAsoebiMobileModal] = useState<boolean>(false);
  const [hamburgerMenu, setHamburgerMenu] = useState<boolean>(false);
  const { signOut } = useNavbarView();
  const { isAuthenticated } = useUserStore();

  const handleAsoebiMobileDropdown = () => {
    setAsoebiMobileModal((prev) => !prev);
  };

  const toogleHamburgerMenu = () => {
    setHamburgerMenu((prev) => !prev);
  };

  return (
    <div className="l:hidden flex a-items-center">
      <RxHamburgerMenu onClick={toogleHamburgerMenu} className="w-24 h-24" />
      {hamburgerMenu && (
        <div
          className="l:hidden flex flex-col space-between z-5 bg-#F5F5F5 r-0 w-100p t-60 p-20 h-70p fixed"
        >
          <div className="flex flex-col gap-25">
            <div
              className="flex a-items-center space-between w-100p h-60 pb-20 border-b border-b-#00000014"
              onClick={handleAsoebiMobileDropdown}
            >
              <p className="flex a-items-center gap-10 weight-500">
                <PiStorefrontBold />
                <span>Asoebi</span>
              </p>
              <SlArrowDown className="w-20" />
            </div>
            {asoebiMobileModal && (
              <div>
                <AsoebiLinksModal sellOnAsoebi={false} />
              </div>
            )}
            <div className="flex flex-col gap-20">
              <Link href={config.VENDOR_CENTER_HOST} target="_blank">
                Sell on asoebi.africa
              </Link>
              <p>Help Center</p>
            </div>
          </div>
          <div className="flex flex-col gap-15">
            <button
              className="bg-green text-white py-8 l:py-10 radius-6 w-full border 
                                    text-10 l:text-12 hover:pointer font-inter
                                    hover:bg-darkgreen g|transition:0.5s disabled:bg-grey weight-600"
              style={{ background: isAuthenticated ? "red" : "" }}
              onClick={() => signOut()}
            >
              {isAuthenticated ? "Logout" : "Login"}
            </button>
            {!isAuthenticated && (
              <Link
                className="bg-none text-black py-8 l:py-10 radius-6 w-full border text-center
                                    text-10 hover:pointer font-inter"
                href={paths.signup}
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileNav;
