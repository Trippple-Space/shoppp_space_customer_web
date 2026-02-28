import { useState } from 'react';
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi';
import { LuEye, LuEyeOff } from 'react-icons/lu';

export default function StepThreeAuth({
  method,
  email,
  onBack,
  onSubmit,
  isLoading,
  value,
  setValue,
}: {
  method: 'password' | 'otp';
  email: string;
  onBack: () => void;
  onSubmit: (value: string) => Promise<void>;
  isLoading: boolean;
  value: string;
  setValue: (v: string) => void;
}) {
  const [viewPassword, setViewPassword] = useState(false);

  return (
    <div className="w-full flex flex-col gap-16 sm:gap-26">
      <button
        onClick={onBack}
        className="flex a-items-center gap-8 mb-7 sm:mb-10 cursor-pointer border-none outline-none bg-transparent w-fit"
      >
        <HiOutlineArrowNarrowLeft className="w-24 h-24 text-#374957" />
        <span className="text-14 text-#374957 weight-500">Back</span>
      </button>

      <div className="flex flex-col">
        <h2 className="text-22 sm:text-32 weight-600 text-black font-inter">
          {method === 'password'
            ? 'Enter your password'
            : 'Enter your one-time code'}
        </h2>
        {method === 'otp' ? (
          <p className="text-black text-16 sm:text-18 weight-400">
            Sent to <span className="weight-600">{email}</span>
          </p>
        ) : (
          <p className="text-black text-16 sm:text-18 weight-400">
            Enter your details below to login
          </p>
        )}
      </div>

      <div className="border border-#ccc radius-14 px-14 overflow-hidden flex a-items-center w-full">
        <input
          className="py-14 border-none outline-none grow w-full px-14"
          placeholder={
            method === 'password'
              ? 'Enter your password'
              : 'Enter the 6-digit code'
          }
          value={value}
          type={method === 'otp' || viewPassword ? 'text' : 'password'}
          onChange={(e) => setValue(e.target.value)}
        />

        {method === 'password' && (
          <div
            className="flex a-items-center j-content-center text-right cursor-pointer ml-14 h-30 bg-inherit w-30"
            onClick={() => setViewPassword((view) => !view)}
          >
            {!viewPassword ? (
              <LuEye className="w-20 h-20" />
            ) : (
              <LuEyeOff className="w-20 h-20" />
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => {
          onSubmit?.(value);
        }}
        disabled={!value || isLoading}
        className="bg-green text-white p-12 l:py-15 radius-14 w-full border text-14 mt-10 hover:pointer font-inter hover:bg-darkgreen g|transition:0.5s disabled:bg-grey disabled:cursor-not-allowed weight-400"
      >
        {isLoading ? 'Logging in...' : 'Log in'}
      </button>
    </div>
  );
}
