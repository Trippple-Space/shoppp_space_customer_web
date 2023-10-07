"use client"
import BoxRadio from '@/modules/lib/components/box-radio/BoxRadio';
import Image from '@/modules/lib/components/image/Image';
import ProgressBar from '@/modules/lib/components/progress-bar/ProgressBar';
import React, { ReactNode, useState } from 'react';
import VendorSignUpStep1 from './VendorSignUpStep1';
import VendorSignUpStep2 from './VendorSignUpStep2';
import VendorSignUpStep3 from './VendorSignUpStep3';
import VendorSignUpStep4 from './VendorSignUpStep4';
import Link from 'next/link';
import { paths } from '@/modules/lib/utility/paths';

export interface IVendorSignUpStep {
  setCurrentStep: (step: number) => void;
}

const vendorSignUpSteps: { [x: number]: React.ComponentType<IVendorSignUpStep> } = {
  1: VendorSignUpStep1,
  2: VendorSignUpStep2,
  3: VendorSignUpStep3,
  4: VendorSignUpStep4,
};

const VendorSignUp = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const VendorSignUpStep = vendorSignUpSteps[currentStep];

  const vendorSignUpPercProgress: any = (currentStep: number) => {
    switch (currentStep) {
      case 1: return 30
      case 2: return 50
      case 3: return 70
      case 4: return 100
    }
  }

  return (
    <div className='h-full'>
      <div className="text-right w-full l:w-80p mt-53 mx-25 hidden l:block">
        <span>Not a vendor? </span>
        <Link href={paths.signup} className='text-primary-700 pointer'>Sign up here instead</Link>
      </div>
      <div className='flex content-center h-full'>
        <div className='a-self-center w-80p mx-auto'>
          <div className="mb-43">
            <Image
              className='w-100 h-27 mb-16 a-self-left'
              src='asoebi-logo-colored.png'
              alt='logo'
              type='logo'
            />
            <ProgressBar percentage={vendorSignUpPercProgress(currentStep)} />
          </div>
          {VendorSignUpStep && <VendorSignUpStep setCurrentStep={setCurrentStep} />}
        </div>
      </div>
    </div>

  );
};

export default VendorSignUp;
