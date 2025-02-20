"use client";

import { FcGoogle } from "react-icons/fc";
import Icon from "@/modules/lib/components/icon/Icon";
import Image from "@/modules/lib/components/image/Image";
import Input from "@/modules/lib/components/input/Input";
import InputAlert from "@/modules/lib/components/input/input-alert/InputAlert";
import { useSignUpView } from "@/modules/lib/utility/hooks/use-signup";
import { paths } from "@/modules/lib/utility/paths";
import { cx } from "@/modules/lib/utility/utility";
import Link from "next/link";
import React, { useState } from "react";
import CustomerSignUpDetails1 from "./CustomerSignUpDetails1";
import CustomerSignUpOtp2 from "./CustomerSignUpOtp2";
import CustomerSignUpPassword3 from "./CustomerSignUpPassword3";
import AuthHeader from "@/modules/lib/components/auth-header/AuthHeader";


type StepNumber = 1 | 2 | 3 ;
export interface ICustomerSignUpStep {
  setCurrentStep: (step: StepNumber) => void;
}

const customerSignUpSteps: { [x: number]: React.ComponentType<ICustomerSignUpStep> } = {
  1: CustomerSignUpDetails1,
  2: CustomerSignUpOtp2,
  3: CustomerSignUpPassword3,
};


const SignUp = () => {
  const [currentStep, setCurrentStep] = useState<StepNumber>(1)
  const CustomerSignUpStep = customerSignUpSteps[currentStep];
  return (
    <>
      
      <div className="text-right relative w-full l:w-80p hidden l:block">
        <div className="absolute r-0 mx-25 mt-53 z-1">
        <span>Do you want to sell? </span>
        <Link href={paths.vendor_signup} className="text-green-700 cursor-pointer">
          Join now
        </Link>
        </div>
      </div>
      <div className="relative mx-25 flex-col flex h-full items-center j-content-center">
        
       <div className="l:hidden w-full bg-green t-0 fixed">
          <Image
            className="w-100 h-30 my-20 m-15"
            src="new-asoebi-logo-white.svg"
            alt="logo"
            type="logo"
            />
        </div>
        
        <div className="w-full l:w-60p h-full flex flex-col j-content-center">
            <AuthHeader activeTab="signup"/>
          
        {
          CustomerSignUpStep && <CustomerSignUpStep setCurrentStep={setCurrentStep} />
        }
        
            <div className="mt-30">
              <div className="flex j-content-between a-items-center  text-grey-800">
                {/* <div className="border border-#00000014 w-50p mr-10"></div>
                  <span style={{ fontStyle: "italic" }} className="">or</span>
               <div className="border border-#00000014 w-50p ml-10"></div>
              </div>
       
              <div>
                <div className="flex bg-whitesmoke a-items-center j-content-center p-10 gap-5 mt-30 radius-5 cursor-pointer">
                  <FcGoogle className="w-24 h-24"/>
                  <span className="weight-500">Continue with Google</span>
                </div> */}
              </div>
                <p className="text-center text-14">By continuing, you agree to the Asoebi.africa <span className="color-link">Terms & Conditions</span> and <span className="color-link">
                  Privacy Policy
                  </span>
                </p>
          </div>
        </div>
          
      </div>
    </>
  );
};

export default SignUp;
