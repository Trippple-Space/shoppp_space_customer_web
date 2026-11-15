'use client';

import Footer from '@/modules/lib/components/footer/Footer';
import Link from 'next/link';
import useUserStore from '@/modules/lib/utility/store/user.store';
import { paths } from '@/modules/lib/utility/paths';
import Image from '@/modules/lib/components/image/Image';
import { useCartStore } from '@/modules/lib/utility/store/cart.store';

const EmptyCheckout = () => {
  const { user } = useUserStore();
  const isLoginModal = useCartStore((state) => state.isLoginModal);

  return (
    <>
      <div className="w-full h-full mx-auto flex flex-col items-center justify-center p-[20px] lg:p-[70px] lg:pb-[126px]">
        <Image
          src="empty-tray.png"
          className="w-[80%] lg:100p h-[250px] my-[10px] object-fit-scale-down"
          alt="empty"
        />

        <h1 className="text-[24px] lg:text-[30px] leading-[40px] my-[15px] font-bold text-center">
          {user ? 'Your cart is empty' : 'You are not signed in'}
        </h1>

        <p className="text-[16px] lg:text-[18px] leading-[30px] text-center text-[#00000099]">
          {user
            ? 'Looks like you have not added any items yet.'
            : 'Sign in to continue your checkout and view your cart.'}
        </p>
        {!user && (
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('post-auth-redirect', paths.checkout);
              }
              isLoginModal();
            }}
            className="bg-brand rounded-[10px] text-white text-[16px] font-medium mt-[20px] py-[12px] px-[20px] border-none cursor-pointer"
          >
            Sign in / Create account
          </button>
        )}

        <Link
          href={paths.homepage}
          className="bg-brand rounded-[10px] text-white text-[16px] font-medium my-[20px] py-[12px] px-[20px]"
          style={{ textDecoration: 'none' }}
        >
          Explore products
        </Link>
      </div>

      <Footer />
    </>
  );
};

export default EmptyCheckout;
