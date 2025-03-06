'use client'

import Icon from '@/modules/lib/components/icon/Icon';
import Input from '@/modules/lib/components/input/Input'
import { useSignUpView } from '@/modules/lib/utility/hooks/use-signup';
import { cx, passwordValidatorRegex, preventCopyPaste } from '@/modules/lib/utility/utility';
import React, { FC, useState } from 'react'
import PasswordStrengthMeter from '@/modules/lib/components/password-strength-meter/PasswordStrengthMeter';

const CreatePassword: FC = () => {
  const { formikComplete } = useSignUpView();
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  return (
    <div className='w-full'>
      <div className="font-inter">
        <h3 className="text-center text-20 weight-500 mb-10 text-grey-900">
          Secure your account
        </h3>
        <p className="text-center text-14 text-grey-700">
          Create a strong password for your account.
        </p>
        <form
          className="form block mt-36 l:mt-50"
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
            onCopy={(e: any) => preventCopyPaste(e)}
            onPaste={(e: any) => preventCopyPaste(e)}
            className="l:mt-30 mt-18"
            handleChange={(e: any) => {
              setPassword(e.target.value);
              formikComplete.handleChange(e);
            }}
            handleBlur={formikComplete.handleBlur}
            after={
              <div className='mt-10'>
                {password.length > 0 && <PasswordStrengthMeter password={password} />}
              </div>
            }
          />
          <Input
            label="Confirm Password"
            id="confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="********"
            onCopy={(e: any) => preventCopyPaste(e)}
            onPaste={(e: any) => preventCopyPaste(e)}
            className="l:mt-20 mt-18"
            handleChange={(e: any) => {
              setConfirmPassword(e.target.value);
              formikComplete.handleChange(e);
            }}
            handleBlur={formikComplete.handleBlur}
            inputClass={cx({ "border-red": password !== confirmPassword })}
            after={
              password !== confirmPassword && (
                <div className='notice text-12 h-0 @one:flex gap-5 j-content-end w-full mt-12 text-danger'>
                  <Icon name='alert-circle' className='w-14 a-self-center' />
                  <span className='a-self-center'>Passwords do not match</span>
                </div>
              )
            }
          />
          {/* Submit button - use type="submit" for a proper form submission */}
          <button
            type="submit"
            className="btn text-center bg-green weight-500 text-16 l:btn-lg btn-lg font-inter mt-30 text-14"
    
          >
            Create password
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePassword;
