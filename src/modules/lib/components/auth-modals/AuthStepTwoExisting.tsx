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
    <div className="w-full flex flex-col gap-19 sm:gap-29">
      <div className="flex flex-col">
        <h2 className="text-32 sm:text-38 weight-600 text-black font-inter">
          Choose your sign in method
        </h2>
        <p className="text-black text-17 sm:text-23 weight-400">
          For your security, please choose how to sign in.
        </p>
      </div>

      <div className="flex a-items-center j-content-between border border-#D1D5DC radius-14 p-16 bg-#F3F4F6">
        <div className="flex a-items-center gap-15">
          <Image
            className="w-29 h-29"
            src={'material-symbols-light_person-outline-rounded.svg'}
            alt="key icon"
            type="icon"
          />
          <span className="text-#434446 text-12 weight-400">{email}</span>
        </div>

        <button
          onClick={onChangeEmail}
          className="color-#0EA17F weight-400 text-12 outline-none border-none cursor-pointer hover:underline"
        >
          Change
        </button>
      </div>

      <button
        onClick={onSelectPassword}
        className="w-full flex a-items-center j-content-between border border-#D1D5DC radius-14 px-16 py-21 sm:py-31 bg-white cursor-pointer outline-none hover:bg-#F3F4F6 g|transition-property:all"
      >
        <Image
          className="w-29 h-29"
          src={'arcticons_otp-authenticator.svg'}
          alt="key icon"
          type="icon"
        />
        <span className="text-#434446 text-12 weight-400 grow w-full">
          Enter Password
        </span>
        <HiChevronRight size={15} className="text-#1D1B20 w-15 h-15" />
      </button>

      <button
        onClick={onSelectOtp}
        className="w-full flex a-items-center j-content-between border border-#D1D5DC radius-14 px-16 py-21 sm:py-31 bg-white cursor-pointer outline-none hover:bg-#F3F4F6 g|transition-property:all"
      >
        <Image
          className="w-29 h-29"
          src={'arcticons_andotp.svg'}
          alt="key icon"
          type="icon"
        />
        <span className="text-#434446 text-12 weight-400 grow w-full">
          Get a one-time code
        </span>
        <HiChevronRight size={15} className="text-#1D1B20 w-15 h-15" />
      </button>

      <p className="text-14 text-black weight-400">
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
    </div>
  );
}
