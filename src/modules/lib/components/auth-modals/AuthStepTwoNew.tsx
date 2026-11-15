import SignUpDetails from '@/modules/views/signup/customer/SignUpDetails';
import Link from 'next/link';
import { paths } from '../../utility/paths';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { useGoogleOauth } from '../../utility/hooks/use-google-oauth';

export default function StepTwoNew({
  email,
  onOtpSent,
  onVerified,
}: {
  email?: string;
  onOtpSent?: (token: string, email: string) => void;
  onVerified?: () => void;
}) {
  const { googleOauthInitializer } = useGoogleOauth();

  return (
    <div className="w-full flex flex-col gap-[29px] py-[20px]">
      <SignUpDetails
        email={email}
        redirectOnOtpSent={false}
        redirectOnVerified={false}
        onOtpSent={(token, submittedEmail) => onOtpSent?.(token, submittedEmail)}
        onVerified={onVerified}
      />

      <div className="w-full flex flex-col gap-[10px]">
        <div className="flex items-center w-full mb-[10px] -mt-[3px]">
          <div className="grow w-full h-[1px] bg-[#ddd]" />
          <span
            className="px-[4px] text-[14px] font-normal text-black w-fit mb-[3px]"
            style={{ textWrap: 'nowrap' }}
          >
            or
          </span>
          <div className="grow w-full h-[1px] bg-[#ddd]" />
        </div>

        <div className="w-full relative" onClick={googleOauthInitializer}>
          <div className="flex p-[14px] pr-[40px] w-full items-center justify-center gap-[5px] rounded-[14px] border border-[#ddd] cursor-pointer hover:bg-[#F5F5F5] transition-all duration-200">
            <FcGoogle className="w-[24px] h-[24px]" />
            <span className="font-normal text-[14px]">Continue with Google</span>
            <HiOutlineArrowNarrowRight className="w-[24px] h-[24px] text-[#374957] absolute right-[26px] top-[16px]" />
          </div>
        </div>
      </div>

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
