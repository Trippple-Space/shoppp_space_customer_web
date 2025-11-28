import { useEffect, useState } from 'react';
import StepOne from './AuthStepOne';
import StepTwoExisting from './AuthStepTwoExisting';
import StepTwoNew from './AuthStepTwoNew';
import Image from '../image/Image';
import StepThreeAuth from './AuthStepThree';
import StepSuccess from './AuthSuccess';
import { useCartStore } from '../../utility/store/cart.store';
import { useLoginView } from '../../utility/hooks/use-login';

export default function AuthModals() {
  const [step, setStep] = useState(1);
  const [hasAccount, setHasAccount] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [method, setMethod] = useState<'password' | 'otp'>('password');
  const [isLoading, setIsLoading] = useState(false);

  const { isLoginModal } = useCartStore();
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
          className="w-fit h-100p radius-5 l:radius-8"
          src={'asoebi-graphics.svg'}
          alt="asoebi-graphics"
          type="image"
          priority
          fetchPriority="high"
        />
      </div>

      <div
        className={`px-16 sm:px-35 flex flex-col a-items-center j-content-center h-fit`}
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
            onContinue={() => {
              setStep(2);
            }}
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
            onSelectOtp={() => {
              setMethod('otp');
              setStep(3);
            }}
          />
        )}

        {step === 2 && hasAccount === false && <StepTwoNew email={email} />}

        {step === 3 && (
          <StepThreeAuth
            key="login-step"
            method={method}
            email={email}
            onBack={() => setStep(2)}
            onSubmit={async () => {
              setIsLoading(true);
              await loginFormHandler.submitForm();
            }}
            isLoading={isLoading}
            value={password}
            setValue={setPassword}
          />
        )}

        {step === 4 && <StepSuccess />}
      </div>
    </>
  );
}
