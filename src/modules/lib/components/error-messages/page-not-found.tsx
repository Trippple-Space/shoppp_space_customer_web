import Image from '@/modules/lib/components/image/Image';
import { paths } from '@/modules/lib/utility/paths';
import Link from 'next/link';
import React from 'react';

const PageNotFound = () => {
  return (
    <div className="w-100p min-h-100vh mx-auto flex flex-col a-items-center j-content-center gap-12 p-20 l:p-70">
      <Image
        src="404.png"
        className="w-80p max-w-400 l:w-50p h-auto my-10 object-fit-scale-down"
        alt="Page not found"
      />

      <div className="flex flex-col a-items-center gap-8 max-w-400 text-center">
        <p className="text-14 weight-600 line-height-20 color-#00000066 uppercase">
          404
        </p>

        <h1
          className="text-24 l:text-30 line-height-40 weight-700 text-center"
          style={{ textWrap: 'balance' }}
        >
          Oops, nothing to see here
        </h1>

        <p
          className="text-14 l:text-16 weight-400 line-height-22 color-#00000073 px-12"
          style={{ textWrap: 'balance' }}
        >
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved. Head back home and start again.
        </p>

        <Link
          href={paths.homepage}
          className="bg-green radius-10 text-white text-16 weight-500 mt-8 py-12 px-24 pointer"
          style={{ textDecoration: 'none' }}
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
