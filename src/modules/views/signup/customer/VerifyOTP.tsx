'use client'

import Input from '@/modules/lib/components/input/Input';
import { useSignUpView } from '@/modules/lib/utility/hooks/use-signup';
import { useEffect, useRef, useState } from 'react';


// Removed HandleChangeEvent interface as it is not needed

interface HandleKeyDownEvent {
  key: string;
}


const VerifyOTP = () => {
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { formikOtp } = useSignUpView();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
  const value = e.target.value.replace(/[^A-Za-z0-9]/g, '');
  if (!value) return;

  const newOtp = [...otpDigits];
  newOtp[index] = value.slice(-1);
  setOtpDigits(newOtp);

  if (newOtp.join("").length === 6) {
    formikOtp.setFieldValue("otp", newOtp.join(""));
  }

  if (value && index < otpDigits.length - 1) {
    inputRefs.current[index + 1]?.focus();
  }
};


const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  e.preventDefault();
  const pasteData = e.clipboardData.getData("text").replace(/[^A-Za-z0-9]/g, ""); 
  if (!pasteData) return;

  const newOtp = [...otpDigits];
  
 
  for (let i = 0; i < pasteData.length && i < otpDigits.length; i++) {
    newOtp[i] = pasteData[i];
  }

  setOtpDigits(newOtp);

 
  const nextEmptyIndex = newOtp.findIndex((char) => char === "");
  inputRefs.current[nextEmptyIndex !== -1 ? nextEmptyIndex : otpDigits.length - 1]?.focus();
};



  const handleKeyDown = (e: HandleKeyDownEvent, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otpDigits];
      if (!otpDigits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      newOtp[index] = '';
      setOtpDigits(newOtp);
    }
  };


  function handleOtpSubmit() {
      const combinedOtp = otpDigits.join('');
      formikOtp.setFieldValue("otp", combinedOtp);
      if (combinedOtp.length === 6) {
        formikOtp.handleSubmit();
      
    }
  }



      useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {


          if (e.key === 'Enter') {
            if (otpDigits.every((item) => item != '')) {        
              e.preventDefault();
              formikOtp.handleSubmit();
            }
          }
        };

    
          window.addEventListener('keydown', handleGlobalKeyDown);
          return () => window.removeEventListener('keydown', handleGlobalKeyDown);
         
      }, [formikOtp]);


  return (
    <div className="w-full overflow-auto">
      <div className="font-inter">
        <h3 className="text-center text-20 weight-500 mb-10 text-grey-900">Email Verification</h3>
        <p className="text-center text-14 text-grey-700">
        Enter the 6-character alphanumeric code you received in your email.
        </p>
        <div className="flex j-content-between  mt-30 w-full">
            {otpDigits.map((value: string, index: number) => (
            <Input
                type="input"
                key={index}
                ref={(input: HTMLInputElement) => {
                  inputRefs.current[index] = input;
                }}
              value={value}
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, index)}
              onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => handlePaste(e)}
                handleKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e as HandleKeyDownEvent, index)}
                className='w-fit p-0'
                inputClass={'h-45 w-45'}
                style={{
                  paddingRight: 0,
                  paddingTop: 0,
                  paddingLeft: 15,
                  paddingBottom: 0,
                }}
            />
            ))}
        </div>
        <button
          className={`btn text-center bg-green weight-500 text-16 l:btn-lg btn-lg font-inter mt-30 text-14 cursor-pointer g|transition:0.5s disabled:bg-grey ${
            otpDigits.join('').length < 6 ? 'bg-whitesmoke text-black' : 'bg-green text-white  hover:bg-darkgreen'
          }`}
          onClick={handleOtpSubmit}
          disabled = {formikOtp.isSubmitting}
        >
          {formikOtp.isSubmitting ? "Verifying": "Verify"}
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;
