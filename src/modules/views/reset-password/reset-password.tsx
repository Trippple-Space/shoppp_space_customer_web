'use client';

import Icon from '@/modules/lib/components/icon/Icon';
import Input from '@/modules/lib/components/input/Input';
import PasswordStrengthMeter from '@/modules/lib/components/password-strength-meter/PasswordStrengthMeter';
import { useResetPassword } from '@/modules/lib/utility/hooks/use-reset-password';
import { cx } from '@/modules/lib/utility/utility';
import React, { FC, useEffect, useState } from 'react';
import { toast } from 'sonner';

const ResetPassword: FC = () => {
  const { formHandler } = useResetPassword();
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const source = params.get('source');
    const prefill = params.get('prefill');

    if (source === 'post-signup' && prefill) {
      formHandler.setFieldValue('password', prefill);
      setPassword(prefill);
    }
  }, [formHandler]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (password === confirmPassword) {
          formHandler.handleSubmit();
        } else {
          toast.error('Passwords must match');
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [password, confirmPassword, formHandler]);

  return (
    <div className="w-full">
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
            if (password === confirmPassword) {
              formHandler.handleSubmit();
            } else {
              toast.error('Passwords must match');
            }
          }}
        >
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="********"
            className="l:mt-30 mt-18"
            value={formHandler.values.password}
            handleChange={(e: any) => {
              setPassword(e.target.value);
              formHandler.handleChange(e);
            }}
            handleBlur={formHandler.handleBlur}
            after={
              password && password.length < 5 && (
                <div className="notice text-12 h-0 @one:flex gap-5 j-content-end w-full mt-12 text-danger">
                  <Icon name="alert-circle" className="w-14 a-self-center" />
                  <span className="a-self-center">Minimum password length is 5 characters</span>
                </div>
              )
            }
          />
          {/* <div className="mt-10">
                {password.length > 0 && (
                  <PasswordStrengthMeter password={password} />
                )}
              </div> */}
          <Input
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="********"
            className="l:mt-20 mt-18"
            value={formHandler.values.confirmPassword}
            handleChange={(e: any) => {
              setConfirmPassword(e.target.value);
              formHandler.handleChange(e);
            }}
            handleBlur={formHandler.handleBlur}
            inputClass={cx({
              'border-red':
                password && confirmPassword && password !== confirmPassword,
            })}
            after={
              password &&
              confirmPassword &&
              password !== confirmPassword && (
                <div className="notice text-12 h-0 @one:flex gap-5 j-content-end w-full mt-12 text-danger">
                  <Icon name="alert-circle" className="w-14 a-self-center" />
                  <span className="a-self-center">Passwords do not match</span>
                </div>
              )
            }
          />

          <button
            type="submit"
            className="btn text-center bg-green weight-500 text-16 l:btn-lg btn-lg font-inter mt-30 text-14 cursor-pointer hover:bg-darkgreen g|transition:0.5s"
            disabled={formHandler.isSubmitting}
          >
            {formHandler.isSubmitting
              ? 'Securing account...'
              : 'Create Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
