'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '../../utility/store/cart.store';
import { IoShieldCheckmarkSharp } from 'react-icons/io5';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';

export default function StepSuccess() {
  const isLoginModal = useCartStore((s) => s.isLoginModal);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 4;
      });
    }, 50);
    
    const timeout = setTimeout(() => {
      isLoginModal();
    }, 2500); 

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-22 sm:gap-33">
      <div className="flex flex-col gap-11 a-items-center">
        <div className="bg-#E7F8F6 w-134 sm:w-154 h-134 sm:h-154 radius-100p flex flex-col a-items-center j-content-center ">
          <IoShieldCheckmarkSharp className="w-66 sm:w-77 h-66 sm:h-77 color-#0EA17F" />
        </div>

        <div className="flex flex-col gap-23 a-items-center w-full max-w-540 mx-auto">
          <h2 className="text-32 sm:text-38 text-black weight-600">You’re signed in!</h2>

          <p className="text-17 sm:text-23 text-black weight-400 text-center">
            Welcome back! We’re redirecting you to your shopping experience.
          </p>

          <div className="w-full max-w-419 mx-auto h-14 radius-18 bg-#D9D9D9 overflow-hidden">
            <div
              className="h-full bg-#0EA17F radius-18 g|transition-property:all g|transition-duration:0.2s"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-500 mx-auto flex flex-col a-items-center gap-40">
        <button
          onClick={isLoginModal}
          className="bg-green text-white p-12 l:py-15 radius-14 w-full border text-14 mt-10 hover:pointer font-inter hover:bg-darkgreen g|transition:0.5s disabled:bg-grey weight-400 flex a-items-center j-content-center gap-5"
        >
          Continue shopping
          <HiOutlineArrowNarrowRight className="w-24 h-24 text-#374957" />
        </button>

        <p className="text-14 text-black weight-400">
          If you’re not redirected automatically{' '}
          <span
            className="color-#0EA17F cursor-pointer weight-600 hover:underline"
            onClick={isLoginModal}
          >
            Click Here.
          </span>
        </p>
      </div>
    </div>
  );
}
