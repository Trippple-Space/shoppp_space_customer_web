'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '../../utility/store/cart.store';
import { IoShieldCheckmarkSharp } from 'react-icons/io5';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { paths } from '../../utility/paths';

export default function StepSuccess() {
  const isLoginModal = useCartStore((s) => s.isLoginModal);
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const getPostAuthRedirect = () =>
    typeof window !== 'undefined'
      ? sessionStorage.getItem('post-auth-redirect')
      : null;
  const clearPostAuthRedirect = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('post-auth-redirect');
    }
  };
  const closeAndRedirect = () => {
    const redirectPath = getPostAuthRedirect();
    clearPostAuthRedirect();
    isLoginModal();
    if (redirectPath) {
      router.push(redirectPath);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 4;
      });
    }, 50);
    
    const timeout = setTimeout(() => {
      closeAndRedirect();
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-[22px] sm:gap-[33px]">
      <div className="flex flex-col gap-[11px] items-center">
        <div className="bg-[#E7F8F6] w-[134px] sm:w-[154px] h-[134px] sm:h-[154px] rounded-[100ppx] flex flex-col items-center justify-center ">
          <IoShieldCheckmarkSharp className="w-[66px] sm:w-[77px] h-[66px] sm:h-[77px] text-[#0EA17F]" />
        </div>

        <div className="flex flex-col gap-[23px] items-center w-full max-w-[540px] mx-auto">
          <h2 className="text-[32px] sm:text-[38px] text-black font-semibold">You’re signed in!</h2>

          <p className="text-[17px] sm:text-[23px] text-black font-normal text-center">
            Welcome back! We’re redirecting you to your shopping experience.
          </p>

          <div className="w-full max-w-[419px] mx-auto h-[14px] rounded-[18px] bg-[#D9D9D9] overflow-hidden">
            <div
              className="h-full bg-[#0EA17F] rounded-[18px] transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[500px] mx-auto flex flex-col items-center gap-[40px]">
        <button
          onClick={closeAndRedirect}
          className="bg-brand text-white p-[12px] lg:py-[15px] rounded-[14px] w-full border text-[14px] mt-[10px] hover:cursor-pointer font-inter hover:bg-brand-hover transition-all duration-500 disabled:bg-[#676767] font-normal flex items-center justify-center gap-[5px]"
        >
          Continue shopping
          <HiOutlineArrowNarrowRight className="w-[24px] h-[24px] text-[#374957]" />
        </button>

        <p className="text-[14px] text-black font-normal">
          If you’re not redirected automatically{' '}
          <span
            className="text-[#0EA17F] cursor-pointer font-semibold hover:underline"
            onClick={closeAndRedirect}
          >
            Click Here.
          </span>
        </p>
      </div>
    </div>
  );
}
