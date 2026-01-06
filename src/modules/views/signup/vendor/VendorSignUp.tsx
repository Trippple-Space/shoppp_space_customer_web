'use client';
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

type StepNumber = 1 | 2 | 3 | 4;
export interface IVendorSignUpStep {
  setCurrentStep: (step: StepNumber) => void;
}

const vendorSignUpSteps: {
  [x: number]: React.ComponentType<IVendorSignUpStep>;
} = {
  1: VendorSignUpStep1,
  2: VendorSignUpStep2,
  3: VendorSignUpStep3,
  4: VendorSignUpStep4,
};

const percentageProgress: (currentStep: StepNumber) => number = (
  currentStep
) => {
  const progressMap: Record<StepNumber, number> = {
    1: 30,
    2: 50,
    3: 70,
    4: 100,
  };

  return progressMap[currentStep] || 0;
};

const VendorSignUp = () => {
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);

  const VendorSignUpStep = vendorSignUpSteps[currentStep];

  return (
    <>
      <div className="mb-43">
        <Image
          className="w-100 h-27 mb-16 a-self-left"
          src="Main logo green.svg"
          alt="logo"
          type="logo"
          height={100}
          width={100}
        />
        <ProgressBar percentage={percentageProgress(currentStep)} />
      </div>
      {VendorSignUpStep && <VendorSignUpStep setCurrentStep={setCurrentStep} />}
    </>
  );
};

export default VendorSignUp;
