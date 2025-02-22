'use client'

import { useSignUpView } from '@/modules/lib/utility/hooks/use-signup';
import { paths } from '@/modules/lib/utility/paths';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface HandleChangeEvent {
  target: {
    value: string;
  };
}

interface HandleKeyDownEvent {
  key: string;
}

const VerifyOTP = () => {

  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);


  const { formikOtp } = useSignUpView();


  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);


  const handleChange = (e: HandleChangeEvent, index: number) => {
    const value = e.target.value;

    if (isNaN(Number(value))) return;

    const newOtp = [...otpDigits];

    newOtp[index] = value.substring(value.length - 1);
    setOtpDigits(newOtp);

  
    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === otpDigits.length) {

      formikOtp.setFieldValue("otp", combinedOtp);

      formikOtp.handleSubmit();
    }

    // Move focus to the next input, if available.
    if (value && index < otpDigits.length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleClick = (index: number) => {
    inputRefs.current[index]?.setSelectionRange(1, 1);
    if (index > 0 && !otpDigits[index - 1]) {
      inputRefs.current[otpDigits.indexOf("")]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: HandleKeyDownEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="w-full">
      <div className="font-inter">
        <h3 className="text-center text-20 weight-500 mb-10 text-grey-900">
          Email Verification
        </h3>
        <p className="text-center text-14 text-grey-700">
          Enter the 6 digit code you received in your email.
        </p>
        <div className="flex j-content-between gap-10 mt-30">
          {otpDigits.map((value, index) => (
            <input
              key={index}
              type="text"
              ref={(input) => {
                inputRefs.current[index] = input;
              }}
              value={value}
              onChange={(e) => handleChange(e, index)}
              onClick={() => handleClick(index)}
              onKeyDown={(e) => handleKeyDown(index, e as HandleKeyDownEvent)}
              className="outline-none border-1 w-40 h-40 l:w-50 l:h-50 radius-6 text-center text-24 mt-10"
              style={{ borderColor: "#6A6A6A4D" }}
            />
          ))}
        </div>
        <div
          className={`radius-5 cursor-pointer text-16 weight-500 p-15 text-center mt-30 ${otpDigits.join('').length < 6 ? 'bg-whitesmoke text-black' : 'bg-green text-white'}`}
          onClick={() => {
            const combinedOtp = otpDigits.join('');
            if (combinedOtp.length === 6) {
              formikOtp.setFieldValue("otp", combinedOtp);
              formikOtp.handleSubmit();
            }
          }}
        >
          Create Password
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
