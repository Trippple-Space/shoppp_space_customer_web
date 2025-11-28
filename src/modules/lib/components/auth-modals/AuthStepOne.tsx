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
};

export default function StepOne({ email, setEmail, onContinue }: StepOneProps) {
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
    <div className="flex flex-col gap-16 sm:gap-26 weight-400">
      <div>
        <h2 className="text-30 sm:text-36 weight-600 text-black mb-10">
          NICE CHOICE{' '}
          <Image
            className="w-50 sm:w-64 h-60 sm:h-74 mb--10"
            src={'thumbs-up.svg'}
            alt="thumbs-up"
            type="icon"
          />
        </h2>
        <p className="text-18 sm:text-24 weight-400 text-black mb-10">
          JUST A SEC — Let’s get you in
        </p>
      </div>

      <div className="w-full relative" onClick={googleOauthInitializer}>
        <div className="flex p-14 pr-40 w-full a-items-center j-content-center gap-5 radius-14 border border-#ddd cursor-pointer hover:bg-whitesmoke g|transition-property:all g|transition-duration:0.2s">
          <FcGoogle className="w-24 h-24" />
          <span className="weight-400 text-14">Continue with Google</span>
          <HiOutlineArrowNarrowRight className="w-24 h-24 text-#374957 absolute r-26 t-16" />
        </div>
      </div>

      <div className="flex a-items-center w-full my-10">
        <div className="grow w-full h-1 bg-#ddd" />
        <span
          className="px-4 text-14 weight-400 text-black w-fit"
          style={{ textWrap: 'nowrap' }}
        >
          Or login with email
        </span>
        <div className="grow w-full h-1 bg-#ddd" />
      </div>

      <div className="w-full">
        <div className="border border-#ccc radius-14 pl-14 overflow-hidden flex a-items-center w-full">
          <CiMail className="w-24 h-24 color-#B3B3B3" />
          <input
            className="py-14 border-none outline-none grow w-full px-14"
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

        {error && <p className="text-red text-12 mt-6">{error}</p>}
      </div>

      <button
        onClick={handleContinue}
        className="bg-green text-white p-12 l:py-15 radius-14 w-full border text-14 mt-10 hover:pointer font-inter hover:bg-darkgreen g|transition:0.5s disabled:bg-grey weight-400 flex a-items-center j-content-center gap-5"
      >
        Continue with Email
        <HiOutlineArrowNarrowRight className="w-24 h-24 text-#374957" />
      </button>

      <p className="text-14 text-black text-center">
        By continuing, you agree to our{' '}
        <Link
          href={paths.legal_document}
          className="color-#0EA17F weight-600"
          target="_blank"
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href={paths.legal_document}
          className="color-#0EA17F weight-600"
          target="_blank"
        >
          Privacy Policy.
        </Link>
      </p>

      <p className="text-14 text-black text-center">
        Don’t have an account?{' '}
        <Link
          href={paths.signup}
          className="color-#0EA17F weight-600"
          target="_blank"
        >
          Sign up
        </Link>{' '}
      </p>
    </div>
  );
}
