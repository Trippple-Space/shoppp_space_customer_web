import Image from '@/modules/lib/components/image/Image';
import { paths } from '@/modules/lib/utility/paths';
import Link from 'next/link';
import React from 'react';

const PageNotFound = () => {
  return (
    <div className="w-full min-h-screen mx-auto flex flex-col items-center justify-center gap-[12px] p-[20px] lg:p-[70px]">
      <Image
        src="404.png"
        className="w-[80%] max-w-[400px] lg:w-1/2 h-auto my-[10px] object-fit-scale-down"
        alt="Page not found"
      />

      <div className="flex flex-col items-center gap-[8px] max-w-[400px] text-center">
        <p className="text-[14px] font-semibold leading-[20px] text-[#00000066] uppercase">
          404
        </p>

        <h1
          className="text-[24px] lg:text-[30px] leading-[40px] font-bold text-center"
          style={{ textWrap: 'balance' }}
        >
          Oops, nothing to see here
        </h1>

        <p
          className="text-[14px] lg:text-[16px] font-normal leading-[22px] text-[#00000073] px-[12px]"
          style={{ textWrap: 'balance' }}
        >
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved. Head back home and start again.
        </p>

        <Link
          href={paths.homepage}
          className="bg-brand rounded-[10px] text-white text-[16px] font-medium mt-[8px] py-[12px] px-[24px] cursor-pointer"
          style={{ textDecoration: 'none' }}
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
