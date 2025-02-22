'use client'

import { paths } from '@/modules/lib/utility/paths';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react'


interface HandleChangeEvent {
    target: {
        value: string;
    };
}

interface HandleKeyDownEvent {
    key: string;
}

const VerifyOTP = () => {
    const [otp, setOtp] = useState(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

    
    useEffect(() => {
        if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
        }
    }, []);

const onOtpSubmit = (otp: string) => {
    // Handle OTP submission logic here
    console.log("OTP submitted:", otp);
};

const handleChange = (e: HandleChangeEvent, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];

    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

  
    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === otp.length) onOtpSubmit(combinedOtp);


    if (value && index < otp.length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
};

const handleClick = (index: number) => {
    inputRefs.current[index]?.setSelectionRange(1, 1);
    if (index > 0 && !otp[index - 1]) {
      inputRefs.current[otp.indexOf("")]?.focus();
    }
};



const handleKeyDown = (index: number, e: HandleKeyDownEvent) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
 
      inputRefs.current[index - 1]?.focus();
    }
};

    
  return (
          <div className="w-full">
            <div className="font-inter">
              <h3 className="text-center text-20  weight-500 mb-10 text-grey-900">
                Email Verification
              </h3>
              <p className="text-center text-14  text-grey-700">
               Enter the 6 digit code you receive in your email.
              </p>
              <div className='flex j-content-between gap-10 mt-30'>
       {otp.map((value, index) => {
        return (
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
        );
      })}
              </div>
              <div className={`radius-5 cursor-pointer text-16 weight-500 p-15 text-center ${otp.join('').length < 6 ? 'bg-whitesmoke text-black' : 'bg-green text-white'} mt-30`} onClick={() =>
                  otp.join('').length === 6 && router.push(paths.create_password)}
              >
               Create Password
              </div>
  </div>
 </div>
  )
}

export default VerifyOTP