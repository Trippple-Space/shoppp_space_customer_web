'use client';
import React, { FC, useEffect } from 'react';
import Input from '@/modules/lib/components/input/Input';
import InputAlert from '@/modules/lib/components/input/input-alert/InputAlert';
import { useSignUpView } from '@/modules/lib/utility/hooks/use-signup';
import { cx } from '@/modules/lib/utility/utility';
import Icon from '@/modules/lib/components/icon/Icon';

const SignUpDetails = ({
  email,
  redirectOnOtpSent = true,
  redirectOnVerified = true,
  onOtpSent,
  onVerified,
}: {
  email?: string;
  redirectOnOtpSent?: boolean;
  redirectOnVerified?: boolean;
  onOtpSent?: (token: string, email: string) => void;
  onVerified?: () => void;
}) => {
  const { formikInitial } = useSignUpView({
    redirectOnOtpSent,
    redirectOnVerified,
    onOtpSent,
    onVerified,
  });

  useEffect(() => {
    if (email && !formikInitial.values.email) {
      formikInitial.setFieldValue('email', email);
    }
  }, [email, formikInitial.values.email]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        formikInitial.handleSubmit();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [formikInitial]);
  return (
    <div className="w-full">
      <div className="font-inter mb-[30px]">
        <h3 className="text-center text-[20px] font-medium mb-[10px] text-[#1F1B17]">
          Welcome to Shoppp Space
        </h3>
        <p className="text-center text-[14px] text-[#6B6662]">
          Enter your details to start a stress-free shopping.
        </p>
      </div>

      <form onSubmit={formikInitial.handleSubmit}>
        <Input
          label="Full name"
          id="fullname"
          name="fullname"
          placeholder="Enter your full name"
          handleChange={formikInitial.handleChange}
          handleBlur={formikInitial.handleBlur}
          inputClass={cx({
            'border-[#DE3838]':
              formikInitial.touched.fullname && formikInitial.errors.fullname,
          })}
          after={
            <InputAlert
              hasError={
                !!(
                  formikInitial.touched.fullname &&
                  formikInitial.errors.fullname
                )
              }
              errorMessage={formikInitial.errors.fullname}
            />
          }
        />

        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          className="lg:mt-[30px] mt-[18px]"
          placeholder="your@email.com"
          handleChange={formikInitial.handleChange}
          handleBlur={formikInitial.handleBlur}
          inputClass={cx('', {
            'border-[#DE3838]':
              formikInitial.touched.email && formikInitial.errors.email,
          })}
          value={formikInitial.values.email}
          after={
            <div
              className={cx(
                'notice text-[12px] h-0 flex gap-[5px] justify-end w-full mt-[12px] text-danger',
                {
                  '!hidden': !(
                    formikInitial.touched.email && formikInitial.errors.email
                  ),
                }
              )}
            >
              <Icon name="alert-circle" className="w-[14px] self-center" />
              <span className="self-center">
                {formikInitial.errors.email}
              </span>
            </div>
          }
          handleKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              formikInitial.handleSubmit();
            }
          }}
        />
        <button
          className="btn text-center bg-brand font-medium text-[16px] lg:btn-lg btn-lg font-inter mt-[30px] text-[14px] cursor-pointer   hover:bg-brand-hover transition-all duration-500 disabled:bg-[#676767]"
          onClick={() => {
            formikInitial.handleSubmit();
          }}
          disabled={formikInitial.isSubmitting}
        >
          {formikInitial.isSubmitting ? 'Sending OTP' : 'Continue'}
        </button>
      </form>
    </div>
  );
};

export default SignUpDetails;
