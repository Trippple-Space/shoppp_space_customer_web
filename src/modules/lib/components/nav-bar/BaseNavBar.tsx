'use client';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import Image from '../image/Image';
import OrdersModal from './profile-modal/OrdersModal';
import MiniCart from '../minicart/MiniCart';
import { cx, onGoingOrderStatusQuery } from '../../utility/utility';
import { usePathname } from 'next/navigation';
import { useNavbarView } from '../../utility/hooks/views/use-navbar-view';
import { useAuthGuard } from '../../utility/hooks/use-auth-guard';

import AsoebiLinksModal from './AsoebiLinksModal';
import MobileNav from './mobile-nav/MobileNav';
import { PiStorefrontBold } from 'react-icons/pi';
import { SlArrowDown } from 'react-icons/sl';
import UserProfileDropdown from './profile-modal/UserProfileDropdown';
import Link from 'next/link';
import RecentlySearchItems from './profile-modal/RecentlySearchItems ';
import RecentlyViewedItems from './profile-modal/RecentlyViewedItems ';
import SavedItemsModal from './profile-modal/SavedItems';
import { AiOutlineUser } from 'react-icons/ai';
import { useOrders } from '../../utility/hooks/use-orders';
import { useCart } from '../../utility/hooks/use-cart';

interface IBaseNavBar {
  links: ReactNode;
  parent: any;
}

const BaseNavBar: FC<IBaseNavBar> = ({ links, parent }) => {
  useAuthGuard(); // TODO: refactor to rely on Next 13 auth middleware
  const [userProfileDropdown, setUserProfileDropdown] =
    useState<boolean>(false);

  const [profileModal, setProfileModal] = useState<string>('');

  const [asoebiModal, setAsoebiModal] = useState<boolean>(false);
  const pathname = usePathname();
  const { user } = useNavbarView();
  const { orders } = useOrders({
    filters: { status: { In: `${onGoingOrderStatusQuery},DELIVERED` } },
  });
  const { cart } = useCart();

  const handleUserProfileDropdown = () => {
    setUserProfileDropdown((prev) => !prev);
  };

  const handleAsoebiDropdown = () => {
    setAsoebiModal((prev) => !prev);
  };

  const handleCloseDropdown = () => {
    setUserProfileDropdown(false);
  };

  useEffect(() => {
    if (asoebiModal || profileModal || userProfileDropdown) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [asoebiModal, profileModal, userProfileDropdown]);

  const [showonBoardingModal, setShowOnBoardingModal] = useState(false);

  //   useEffect(() => {
  //     const stored = localStorage.getItem("seenMiniCart");
  //     console.log(seenAddToCartOnboarding);
  //     if (!stored) {
  //       localStorage.setItem("seenMiniCart", "true");
  //     }

  // /*  AN EVENT DISPATCHER IS BEING TRIGGERED FROM THE PRODUCT TILE FILE! */
  //     const handleShow = () => setShowOnBoardingModal(true);
  //     window.addEventListener("showMiniCartOnboarding", handleShow);
  //     return () => window.removeEventListener("showMiniCartOnboarding", handleShow);
  //   }, []);

  useEffect(() => {
    const handleShow = () => {
      const pathname = window.location.pathname;

      if (pathname.includes('/checkout') || pathname.includes('/orders')) {
        console.log('Onboarding blocked on checkout/orders page');
        return;
      }

      const seenAdd = localStorage.getItem('seenAddToCartIcon') === 'true';
      const seenMini = localStorage.getItem('seenMiniCart') === 'true';

      if (
        seenAdd &&
        !seenMini &&
        orders.length === 0 &&
        cart.cartItems.length === 0
      ) {
        setShowOnBoardingModal(true);
      }
    };

    // 🧹 Always make sure no onboarding is visible on these pages
    const pathname = window.location.pathname;
    if (pathname.includes('/checkout') || pathname.includes('/orders')) {
      setShowOnBoardingModal(false);
    }

    window.addEventListener('showMiniCartOnboarding', handleShow);
    return () => {
      window.removeEventListener('showMiniCartOnboarding', handleShow);
    };
  }, [orders.length, cart.cartItems.length]);

  return (
    <div
      className={`fixed w-full t-0 l-0 bg-white z-5 ${
        (parent === 'checkout' || parent === 'orders') &&
        'border-b border-b-#00000014 md:py-3 py-5.8625'
      }`}
    >
      {showonBoardingModal && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: 0,
            inset: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        ></div>
      )}

      <div
        className={cx(
          'flex a-items-center relative app-width space-between py-12',
          {
            'max-w-1400!': pathname.startsWith('/products/'),
          }
        )}
      >
        <Link href={'/'} className="w-fit">
          <Image
            className="w-100! l:w-110! h-27!"
            src="Main logo green.svg"
            alt="logo"
            type="logo"
            priority
            fetchPriority="high"
            height={100}
            width={100}
          />
        </Link>

        <div className="flex md:j-content-center w-100p j-content-end">
          {links}
        </div>

        {asoebiModal && (
          <>
            <div
              className="fixed inset-0 bg-black opacity-10 z-10"
              onClick={handleAsoebiDropdown}
            />

            <div className="l:absolute r-180 t-70 l:p-10 bg-white z-20 radius-8">
              <AsoebiLinksModal sellOnAsoebi={true} />
            </div>
          </>
        )}

        <div className="l:block flex l:flex a-items-center l:gap-30 gap-10 w-fit relative j-self-end">
          <div
            className={`l:cursor-pointer ${
              parent === 'checkout' ? 'hidden' : 'hidden l:block'
            }`}
            onClick={handleAsoebiDropdown}
          >
            <p className="flex a-items-center  weight-500">
              <PiStorefrontBold className="w-30" />
              <span>Asoebi</span>
              <SlArrowDown className="w-10 ml-5" />
            </p>
          </div>
          <div className="flex sm:gap-24 gap-20 a-items-center">
            <div>
              <>
                {showonBoardingModal && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="l:w-200 w-100  l:p-10 p-5 l:mb-10 t-50  r-20"
                    style={{
                      position: 'absolute',
                      background: 'white',
                      borderRadius: '10px',
                      zIndex: 1000,
                    }}
                  >
                    <p className="weight-400">
                      This is where you find items you added to your cart
                    </p>

                    <div onClick={() => setShowOnBoardingModal(false)}>
                      <button
                        className="bg-green text-white mt- l:mt-10 l:py-10 l:px-20 w-full py-5  radius-5 border-none hover:pointer text-13 l:text-14 font-inter 
                hover:bg-darkgreen g|transition:0.5s  text-center"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                <div
                  className="relative"
                  style={{ zIndex: showonBoardingModal ? 100 : 1 }}
                >
                  <MiniCart />
                </div>
              </>
            </div>
            <div
              className="md:flex hidden gap-12 a-items-center text-black cursor-pointer"
              onClick={handleUserProfileDropdown}
            >
              <div className="h-fit">
                {user ? (
                  <Image
                    className="w-34 h-34 border-solid border-2 border-grey-300 radius-50p"
                    src={`https://api.dicebear.com/7.x/thumbs/png?seed=${user?.firstName}`}
                    alt="user"
                  />
                ) : (
                  <AiOutlineUser className="w-24 h-24" />
                )}
              </div>
              <SlArrowDown className="w-12 h-12" />
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
  );
};
export default BaseNavBar;
