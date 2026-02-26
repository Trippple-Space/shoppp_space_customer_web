'use client';

import Footer from '@/modules/lib/components/footer/Footer';
import Link from 'next/link';
import useUserStore from '@/modules/lib/utility/store/user.store';
import { paths } from '@/modules/lib/utility/paths';
import Image from '@/modules/lib/components/image/Image';

const EmptyCheckout = () => {
  const { user } = useUserStore();

  return (
    <>
      <div className="w-100p h-100p mx-auto flex flex-col items-center j-content-center p-20 l:p-70">
        <Image
          src="empty-tray.png"
          className="w-80p l:100p h-250 my-10 object-fit-scale-down"
          alt="empty"
        />

        <h1 className="text-24 l:text-30 line-height-40 my-15 weight-700 text-center">
          {user ? 'Your cart is empty' : 'You are not signed in'}
        </h1>

        <p className="text-16 l:text-18 line-height-30 text-center color-#00000099">
          {user
            ? 'Looks like you have not added any items yet.'
            : 'Sign in to continue your checkout and view your cart.'}
        </p>

        <Link
          href={paths.homepage}
          className="bg-green radius-10 text-white text-16 weight-500 my-20 py-12 px-20"
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
