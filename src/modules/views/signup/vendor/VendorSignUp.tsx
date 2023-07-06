"use client"
import BoxRadio from '@/modules/lib/components/box-radio/BoxRadio';
import Image from '@/modules/lib/components/image/Image';
import ProgressBar from '@/modules/lib/components/progress-bar/ProgressBar';
import React, { ReactNode, useState } from 'react';
import VendorSignUpStep1 from './VendorSignUpStep1';
import VendorSignUpStep2 from './VendorSignUpStep2';
import VendorSignUpStep3 from './VendorSignUpStep3';

export interface IVendorSignUpStep {
  setCurrentStep: (step: number) => void;
}

const vendorSignUpSteps: { [x: number]: React.ComponentType<IVendorSignUpStep> } = {
  1: VendorSignUpStep1,
  2: VendorSignUpStep2,
  3: VendorSignUpStep3,
};

const VendorSignUp = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const VendorSignUpStep = vendorSignUpSteps[currentStep];

  return (
    <div className='flex content-center h-full'>
      <div className='a-self-center w-80p mx-auto'>
        <div className="mb-43">
          <Image
            className='w-100 h-27 mb-16 a-self-left'
            src='asoebi-logo-colored.png'
            alt='logo'
            type='logo'
          />
          <ProgressBar percentage={30} />
        </div>

        {VendorSignUpStep && <VendorSignUpStep setCurrentStep={setCurrentStep} />}

      </div>
    </div>
  );
};

export default VendorSignUp;
