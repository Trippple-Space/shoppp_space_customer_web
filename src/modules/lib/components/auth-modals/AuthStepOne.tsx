import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import Image from '../image/Image';
import { useGoogleOauth } from '../../utility/hooks/use-google-oauth';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { CiMail } from 'react-icons/ci';
import Link from 'next/link';
import { paths } from '../../utility/paths';

type StepOneProps = {
  email: string;
  setEmail: (value: string) => void;
  onContinue: () => void;
  isLoading?: boolean;
};

export default function StepOne({ email, setEmail, onContinue, isLoading }: StepOneProps) {
  const [error, setError] = useState('');
  const { googleOauthInitializer } = useGoogleOauth();

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleContinue = () => {
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    onContinue();
  };

  return (
    <div className="flex flex-col gap-[16px] sm:gap-[26px] font-normal">
      <div>
        <h2 className="text-[30px] sm:text-[36px] font-semibold text-black mb-[10px]">
          NICE CHOICE{' '}
          <Image
            className="w-[50px] sm:w-[64px] h-[60px] sm:h-[74px] -mb-[10px]"
            src={'thumbs-up.svg'}
            alt="thumbs-up"
            type="icon"
          />
        </h2>
        <p className="text-[18px] sm:text-[24px] font-normal text-black mb-[10px]">
          JUST A SEC — Let’s get you in
        </p>
      </div>

      <div className="w-full relative" onClick={googleOauthInitializer}>
        <div className="flex p-[14px] pr-[40px] w-full items-center justify-center gap-[5px] rounded-[14px] border border-[#ddd] cursor-pointer hover:bg-[#F5F5F5] transition-all duration-200">
          <FcGoogle className="w-[24px] h-[24px]" />
          <span className="font-normal text-[14px]">Continue with Google</span>
          <HiOutlineArrowNarrowRight className="w-[24px] h-[24px] text-[#374957] absolute right-[26px] top-[16px]" />
        </div>
      </div>

      <div className="flex items-center w-full my-[10px]">
        <div className="grow w-full h-[1px] bg-[#ddd]" />
        <span
          className="px-[4px] text-[14px] font-normal text-black w-fit"
          style={{ textWrap: 'nowrap' }}
        >
          Or login with email
        </span>
        <div className="grow w-full h-[1px] bg-[#ddd]" />
      </div>

      <div className="w-full">
        <div className="border border-[#ccc] rounded-[14px] pl-[14px] overflow-hidden flex items-center w-full">
          <CiMail className="w-[24px] h-[24px] text-[#B3B3B3]" />
          <input
            className="py-[14px] border-none outline-none grow w-full px-[14px]"
            placeholder="Enter your email here"
            value={email}
            type="email"
            name="email"
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
          />
        </div>

        {error && <p className="text-[#DE3838] text-[12px] mt-[6px]">{error}</p>}
      </div>

      <button
        onClick={handleContinue}
        disabled={isLoading}
        className="bg-brand text-white p-[12px] lg:py-[15px] rounded-[14px] w-full border text-[14px] mt-[10px] hover:cursor-pointer font-inter hover:bg-brand-hover transition-all duration-500 disabled:bg-[#676767] disabled:cursor-not-allowed font-normal flex items-center justify-center gap-[5px]"
      >
        Continue with Email
        <HiOutlineArrowNarrowRight className="w-[24px] h-[24px] text-[#374957]" />
      </button>

      <p className="text-[14px] text-black text-center">
        By continuing, you agree to our{' '}
        <Link
          href={paths.legal_document}
          className="text-[#0EA17F] font-semibold"
          target="_blank"
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href={paths.legal_document}
          className="text-[#0EA17F] font-semibold"
          target="_blank"
        >
          Privacy Policy.
        </Link>
      </p>

      <p className="text-[14px] text-black text-center">
        Don’t have an account?{' '}
        <Link
          href={paths.signup}
          className="text-[#0EA17F] font-semibold"
          target="_blank"
        >
          Sign up
        </Link>{' '}
      </p>
    </div>
  );
}
