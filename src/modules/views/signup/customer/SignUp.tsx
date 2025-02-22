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
import SignUpDetails from "./SignUpDetails";
import VerifyOTP from "./VerifyOTP";
import CreatePassword from "./CreatePassword";
import AuthHeader from "@/modules/lib/components/auth-header/AuthHeader";
import { usePathname, useRouter } from "next/navigation";


type StepNumber = 1 | 2 | 3 ;
export interface ICustomerSignUpStep {
  setCurrentStep: (step: StepNumber) => void;
}



const SignUp = () => {
  return (
    <>
  
    </>
  );
};

export default SignUp;
