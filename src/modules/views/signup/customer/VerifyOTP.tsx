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
    <div className="w-full">
      <div className="font-inter">
        <h3 className="text-center text-[20px] font-medium mb-[10px] text-[#1F1B17]">Email Verification</h3>
        <p className="text-center text-[14px] text-[#6B6662]">
        Enter the 6-character alphanumeric code you received in your email.
        </p>
        <div className="flex justify-between  mt-[30px] w-full">
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
                inputClass={'h-[45px] w-[45px]'}
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
          className={`btn text-center bg-brand font-medium text-[16px] lg:btn-lg btn-lg font-inter mt-[30px] text-[14px] cursor-pointer transition-all duration-500 disabled:bg-[#676767] ${
            otpDigits.join('').length < 6 ? 'bg-[#F5F5F5] text-black' : 'bg-brand text-white  hover:bg-brand-hover'
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
