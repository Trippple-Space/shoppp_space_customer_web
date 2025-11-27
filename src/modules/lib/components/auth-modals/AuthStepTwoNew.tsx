import SignUpDetails from '@/modules/views/signup/customer/SignUpDetails';
import Link from 'next/link';
import { paths } from '../../utility/paths';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { useGoogleOauth } from '../../utility/hooks/use-google-oauth';

export default function StepTwoNew({ email }: { email?: string }) {
  const { googleOauthInitializer } = useGoogleOauth();

  return (
    <div className="w-full flex flex-col gap-29 py-20">
      <SignUpDetails email={email} />

      <div className="w-full flex flex-col gap-10">
        <div className="flex a-items-center w-full mb-10 mt--3">
          <div className="grow w-full h-1 bg-#ddd" />
          <span
            className="px-4 text-14 weight-400 text-black w-fit mb-3"
            style={{ textWrap: 'nowrap' }}
          >
            or
          </span>
          <div className="grow w-full h-1 bg-#ddd" />
        </div>

        <div className="w-full relative" onClick={googleOauthInitializer}>
          <div className="flex p-14 pr-40 w-full a-items-center j-content-center gap-5 radius-14 border border-#ddd cursor-pointer hover:bg-whitesmoke g|transition-property:all g|transition-duration:0.2s">
            <FcGoogle className="w-24 h-24" />
            <span className="weight-400 text-14">Continue with Google</span>
            <HiOutlineArrowNarrowRight className="w-24 h-24 text-#374957 absolute r-26 t-16" />
          </div>
        </div>
      </div>

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
