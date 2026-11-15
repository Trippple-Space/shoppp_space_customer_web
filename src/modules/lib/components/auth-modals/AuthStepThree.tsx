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
    <div className="w-full flex flex-col gap-[16px] sm:gap-[26px]">
      <button
        onClick={onBack}
        className="flex items-center gap-[8px] mb-[7px] sm:mb-[10px] cursor-pointer border-none outline-none bg-transparent w-fit"
      >
        <HiOutlineArrowNarrowLeft className="w-[24px] h-[24px] text-[#374957]" />
        <span className="text-[14px] text-[#374957] font-medium">Back</span>
      </button>

      <div className="flex flex-col">
        <h2 className="text-[22px] sm:text-[32px] font-semibold text-black font-inter mb-[10px]">
          {method === 'password'
            ? 'Enter your password'
            : 'Enter your one-time code'}
        </h2>
        {method === 'otp' ? (
          <p className="text-black text-[16px] sm:text-[18px] font-normal">
            Sent to <span className="font-semibold">{email}</span>
          </p>
        ) : (
          <p className="text-black text-[16px] sm:text-[18px] font-normal">
            Enter your details below to login
          </p>
        )}
      </div>

      <div className="border border-[#ccc] rounded-[14px] px-[14px] overflow-hidden flex items-center w-full">
        <input
          className="py-[14px] border-none outline-none grow w-full px-[14px]"
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
            className="flex items-center justify-center text-right cursor-pointer ml-[14px] h-[30px] bg-inherit w-[30px]"
            onClick={() => setViewPassword((view) => !view)}
          >
            {!viewPassword ? (
              <LuEye className="w-[20px] h-[20px]" />
            ) : (
              <LuEyeOff className="w-[20px] h-[20px]" />
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => {
          onSubmit?.(value);
        }}
        disabled={!value || isLoading}
        className="bg-brand text-white p-[12px] lg:py-[15px] rounded-[14px] w-full border text-[14px] mt-[10px] hover:cursor-pointer font-inter hover:bg-brand-hover transition-all duration-500 disabled:bg-[#676767] disabled:cursor-not-allowed font-normal"
      >
        {isLoading ? 'Logging in...' : 'Log in'}
      </button>
    </div>
  );
}
