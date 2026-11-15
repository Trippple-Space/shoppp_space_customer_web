'use client';

import Icon from '@/modules/lib/components/icon/Icon';
import Input from '@/modules/lib/components/input/Input';
import { useSignUpView } from '@/modules/lib/utility/hooks/use-signup';
import {
  cx,
  passwordValidatorRegex,
  preventCopyPaste,
} from '@/modules/lib/utility/utility';
import React, { FC, useEffect, useState } from 'react';
import PasswordStrengthMeter from '@/modules/lib/components/password-strength-meter/PasswordStrengthMeter';
import { toast } from 'sonner';

const CreatePassword: FC = () => {
  const { formikComplete } = useSignUpView();
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (password === confirmPassword) {
          e.preventDefault();
          formikComplete.handleSubmit();
        } else {
          toast.error('Password must match');
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [formikComplete]);

  return (
    <div className="w-full">
      <div className="font-inter">
        <h3 className="text-center text-[20px] font-medium mb-[10px] text-[#1F1B17]">
          Secure your account
        </h3>
        <p className="text-center text-[14px] text-[#6B6662]">
          Create a strong password for your account.
        </p>
        <form
          className="form block mt-[36px] lg:mt-[50px]"
          onSubmit={(e) => {
            e.preventDefault();
            formikComplete.handleSubmit();
          }}
        >
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="********"
            className="lg:mt-[30px] mt-[18px]"
            handleChange={(e: any) => {
              setPassword(e.target.value);
              formikComplete.handleChange(e);
            }}
            handleBlur={formikComplete.handleBlur}
            after={
              password &&
              password.length < 5 && (
                <div className="notice text-[12px] h-0 flex gap-[5px] justify-end w-full mt-[12px] text-danger">
                  <Icon name="alert-circle" className="w-[14px] self-center" />
                  <span className="self-center">
                    Minimum password length is 5 characters
                  </span>
                </div>
              )
            }
          />
          <Input
            label="Confirm Password"
            id="confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="********"
            className="lg:mt-[20px] mt-[18px]"
            handleChange={(e: any) => {
              setConfirmPassword(e.target.value);
              formikComplete.handleChange(e);
            }}
            handleBlur={formikComplete.handleBlur}
            inputClass={cx({ 'border-[#DE3838]': password !== confirmPassword })}
            after={
              password !== confirmPassword && (
                <div className="notice text-[12px] h-0 flex gap-[5px] justify-end w-full mt-[12px] text-danger">
                  <Icon name="alert-circle" className="w-[14px] self-center" />
                  <span className="self-center">Passwords do not match</span>
                </div>
              )
            }
          />
          {/* Submit button - use type="submit" for a proper form submission */}
          <button
            type="submit"
            className="btn text-center bg-brand font-medium text-[16px] lg:btn-lg btn-lg font-inter mt-[30px] text-[14px] cursor-pointer hover:bg-brand-hover transition-all duration-500"
            disabled={formikComplete.isSubmitting}
          >
            {formikComplete.isSubmitting
              ? 'Securing account'
              : 'Create Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePassword;
