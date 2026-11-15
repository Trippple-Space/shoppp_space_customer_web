import { HiChevronRight } from 'react-icons/hi';
import Link from 'next/link';
import { paths } from '../../utility/paths';
import Image from '../image/Image';

export default function StepTwoExisting({
  email,
  onSelectPassword,
  onSelectOtp,
  onChangeEmail,
}: {
  email: string;
  onSelectPassword: () => void;
  onSelectOtp: () => void;
  onChangeEmail: () => void;
}) {
  return (
    <div className="w-full flex flex-col gap-[19px] sm:gap-[29px]">
      <div className="flex flex-col">
        <h2 className="text-[32px] sm:text-[38px] font-semibold text-black font-inter">
          Choose your sign in method
        </h2>
        <p className="text-black text-[17px] sm:text-[23px] font-normal">
          For your security, please choose how to sign in.
        </p>
      </div>

      <div className="flex items-center justify-between border border-[#D1D5DC] rounded-[14px] p-[16px] bg-[#F3F4F6]">
        <div className="flex items-center gap-[15px]">
          <Image
            className="w-[29px] h-[29px]"
            src={'material-symbols-light_person-outline-rounded.svg'}
            alt="key icon"
            type="icon"
          />
          <span className="text-[#434446] text-[12px] font-normal">{email}</span>
        </div>

        <button
          onClick={onChangeEmail}
          className="text-[#0EA17F] font-normal text-[12px] outline-none border-none cursor-pointer hover:underline"
        >
          Change
        </button>
      </div>

      <button
        onClick={onSelectPassword}
        className="w-full flex items-center justify-between border border-[#D1D5DC] rounded-[14px] px-[16px] py-[21px] sm:py-[31px] bg-white cursor-pointer outline-none hover:bg-[#F3F4F6] transition-all"
      >
        <Image
          className="w-[29px] h-[29px]"
          src={'arcticons_otp-authenticator.svg'}
          alt="key icon"
          type="icon"
        />
        <span className="text-[#434446] text-[12px] font-normal grow w-full">
          Enter Password
        </span>
        <HiChevronRight size={15} className="text-[#1D1B20] w-[15px] h-[15px]" />
      </button>

      <button
        onClick={onSelectOtp}
        className="w-full flex items-center justify-between border border-[#D1D5DC] rounded-[14px] px-[16px] py-[21px] sm:py-[31px] bg-white cursor-pointer outline-none hover:bg-[#F3F4F6] transition-all"
      >
        <Image
          className="w-[29px] h-[29px]"
          src={'arcticons_andotp.svg'}
          alt="key icon"
          type="icon"
        />
        <span className="text-[#434446] text-[12px] font-normal grow w-full">
          Get a one-time code
        </span>
        <HiChevronRight size={15} className="text-[#1D1B20] w-[15px] h-[15px]" />
      </button>

      <p className="text-[14px] text-black font-normal">
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
    </div>
  );
}
