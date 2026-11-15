import { useEffect, useState } from 'react';
import StepOne from './AuthStepOne';
import StepTwoExisting from './AuthStepTwoExisting';
import StepTwoNew from './AuthStepTwoNew';
import Image from '../image/Image';
import StepThreeAuth from './AuthStepThree';
import StepSuccess from './AuthSuccess';
import { useCartStore } from '../../utility/store/cart.store';
import { useLoginView } from '../../utility/hooks/use-login';
import { useVerifyEmail } from '../../utility/hooks/use-verify-email';
import { useRequestOtp } from '../../utility/hooks/use-request-otp';
import { useVerifyOtpLogin } from '../../utility/hooks/use-verify-otp-login';
import useUserStore from '../../utility/store/user.store';
import { authService } from '../../utility/services/auth.service';
import { syncGuestStateAfterAuth } from '../../utility/guest-session';

export default function AuthModals() {
  const [step, setStep] = useState(1);
  const [hasAccount, setHasAccount] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [method, setMethod] = useState<'password' | 'otp'>('password');
  const [otpPurpose, setOtpPurpose] = useState<'login' | 'signup'>('login');
  const [signupOtpToken, setSignupOtpToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { verify, loading: verifyingEmail } = useVerifyEmail();
  const { requestOtp, loading, otpToken } = useRequestOtp();
  const { verifyOtp, loading: verifyingOtp } = useVerifyOtpLogin(() =>
    setStep(4)
  );
  const { authenticateUser } = useUserStore();
  const { isLoginModal, fetchCart } = useCartStore();
  const { formHandler: loginFormHandler } = useLoginView(isLoginModal, {
    shouldRedirect: false,
    onSuccess: () => setStep(4),
  });

  useEffect(() => {
    loginFormHandler.setValues({
      email,
      password,
    });
  }, [email, password]);

  return (
    <>
      <div className="md:block hidden">
        <Image
          className="w-fit h-full rounded-[5px] lg:rounded-[8px]"
          src={'shoppp-graphics.svg'}
          alt="Shoppp Space graphics"
          type="image"
          priority
          fetchPriority="high"
        />
      </div>

      <div
        className={`px-[16px] sm:px-[35px] flex flex-col items-center justify-center h-fit`}
        style={{
          flex: 1,
          overflowY: 'scroll',
          overflow: 'auto',
          margin: 'auto 0',
        }}
      >
        {step === 1 && (
          <StepOne
            setEmail={setEmail}
            email={email}
            onContinue={async () => {
              const res = await verify(email);
              if (res.exists && res.hasUserAccount) {
                setHasAccount(true);
              } else if (res.exists && !res.hasUserAccount) {
                setHasAccount(false);
              } else {
                setHasAccount(false);
              }

              setStep(2);
            }}
            isLoading={verifyingEmail}
          />
        )}

        {step === 2 && hasAccount === true && (
          <StepTwoExisting
            email={email}
            onChangeEmail={() => setStep(1)}
            onSelectPassword={() => {
              setMethod('password');
              setStep(3);
            }}
            onSelectOtp={async () => {
              setMethod('otp');
              await requestOtp(email);
              setStep(3);
            }}
          />
        )}

        {step === 2 && hasAccount === false && (
          <StepTwoNew
            email={email}
            onOtpSent={(token) => {
              setOtpPurpose('signup');
              setMethod('otp');
              setSignupOtpToken(token);
              setPassword('');
              setStep(3);
            }}
            onVerified={() => {
              setStep(4);
            }}
          />
        )}

        {step === 3 && (
          <StepThreeAuth
            key="login-step"
            method={method}
            email={email}
            onBack={() => setStep(2)}
            onSubmit={async () => {
              setIsLoading(true);

              if (method === 'password') {
                await loginFormHandler.submitForm();
              }

              if (method === 'otp') {
                if (otpPurpose === 'signup' && signupOtpToken) {
                  const response = await authService.verifyOtp({
                    token: signupOtpToken,
                    otp: password,
                  });

                  if (response?.user) {
                    authenticateUser(response.user);
                    await syncGuestStateAfterAuth(response.user.id);
                    fetchCart();
                    setStep(4);
                  }
                } else if (otpToken) {
                  await verifyOtp(password, otpToken);
                }
              }

              setIsLoading(false)
            }}
            isLoading={isLoading || verifyingOtp || loading}
            value={password}
            setValue={setPassword}
          />
        )}

        {step === 4 && <StepSuccess />}
      </div>
    </>
  );
}
