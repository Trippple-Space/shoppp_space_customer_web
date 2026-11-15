'use client';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import Image from '../image/Image';
import OrdersModal from './profile-modal/OrdersModal';
import MiniCart from '../minicart/MiniCart';
import { cx, onGoingOrderStatusQuery } from '../../utility/utility';
import { usePathname } from 'next/navigation';
import { useNavbarView } from '../../utility/hooks/views/use-navbar-view';
import { useAuthGuard } from '../../utility/hooks/use-auth-guard';

import MobileNav from './mobile-nav/MobileNav';
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

  const pathname = usePathname();
  const { user } = useNavbarView();
  const { orders } = useOrders({
    filters: { status: { In: `${onGoingOrderStatusQuery},DELIVERED` } },
  });
  const { cart } = useCart();

  const handleUserProfileDropdown = () => {
    setUserProfileDropdown((prev) => !prev);
  };

  const handleCloseDropdown = () => {
    setUserProfileDropdown(false);
  };

  useEffect(() => {
    if (profileModal || userProfileDropdown) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [profileModal, userProfileDropdown]);

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
      data-shoppp-main-nav="true"
      className={`fixed w-full top-0 left-0 bg-white z-[5px] ${
        (parent === 'checkout' || parent === 'orders') &&
        'border-b border-b-[#00000014] md:py-[3px] py-[5.8625px]'
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
          'flex items-center relative app-width justify-between py-[12px]',
          {
            '!max-w-[1400px]': pathname.startsWith('/products/'),
          }
        )}
      >
        <Link href={'/'} className="w-fit">
          <Image
            className="!w-[100px] lg:!w-[110px] !h-[27px]"
            src="Main logo green.svg"
            alt="logo"
            type="logo"
            priority
            fetchPriority="high"
            height={100}
            width={100}
          />
        </Link>

        <div className="flex md:justify-center w-full justify-end">
          {links}
        </div>

        <div className="lg:block flex lg:flex items-center lg:gap-[30px] gap-[10px] w-fit relative j-self-end">
          <div className="flex sm:gap-[24px] gap-[20px] items-center">
            <div>
              <>
                {showonBoardingModal && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="lg:w-[200px] w-[100px]  lg:p-[10px] p-[5px] lg:mb-[10px] top-[50px]  right-[20px]"
                    style={{
                      position: 'absolute',
                      background: 'white',
                      borderRadius: '10px',
                      zIndex: 1000,
                    }}
                  >
                    <p className="font-normal">
                      This is where you find items you added to your cart
                    </p>

                    <div onClick={() => setShowOnBoardingModal(false)}>
                      <button
                        className="bg-brand text-white mt- lg:mt-[10px] lg:py-[10px] lg:px-[20px] w-full py-[5px]  rounded-[5px] border-none hover:cursor-pointer text-[13px] lg:text-[14px] font-inter 
                hover:bg-brand-hover transition-all duration-500  text-center"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                <div
                  className="relative"
                  style={{ zIndex: showonBoardingModal ? 100 : 0 }}
                >
                  <MiniCart />
                </div>
              </>
            </div>
            <div
              className="md:flex hidden gap-[12px] items-center text-black cursor-pointer"
              onClick={handleUserProfileDropdown}
            >
              <div className="h-fit">
                {user ? (
                  <Image
                    className="w-[34px] h-[34px] border-solid border-[2px] border-[#E4E1DF] rounded-full"
                    src={`https://api.dicebear.com/7.x/thumbs/png?seed=${user?.firstName}`}
                    alt="user"
                  />
                ) : (
                  <AiOutlineUser className="w-[24px] h-[24px]" />
                )}
              </div>
              <SlArrowDown className="w-[12px] h-[12px]" />
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
            {profileModal === 'orders' && (
              <OrdersModal
                modalOpen={profileModal === 'orders'}
                handleCloseModal={() => setProfileModal('')}
                data={undefined}
              />
            )}
            {profileModal === 'recently searched' && (
              <RecentlySearchItems
                modalOpen={profileModal === 'recently searched'}
                handleCloseModal={() => setProfileModal('')}
                data={undefined}
              />
            )}
            {profileModal === 'recently viewed' && (
              <RecentlyViewedItems
                modalOpen={profileModal === 'recently viewed'}
                handleCloseModal={() => setProfileModal('')}
                data={undefined}
              />
            )}
            {profileModal === 'saved items' && (
              <SavedItemsModal
                modalOpen={profileModal === 'saved items'}
                handleCloseModal={() => setProfileModal('')}
                data={undefined}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default BaseNavBar;
