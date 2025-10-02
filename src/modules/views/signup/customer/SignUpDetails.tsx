'use client'
import React, { FC, useEffect } from 'react'
import Input from "@/modules/lib/components/input/Input";
import InputAlert from "@/modules/lib/components/input/input-alert/InputAlert";
import { useSignUpView } from '@/modules/lib/utility/hooks/use-signup';
import { cx } from '@/modules/lib/utility/utility';
import Icon from '@/modules/lib/components/icon/Icon';
import { useRouter } from 'next/navigation';
import { paths } from '@/modules/lib/utility/paths';

const SignUpDetails: FC = () => {
  const { formikInitial } = useSignUpView();





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
      <div className="font-inter mb-30">
        <h3 className="text-center text-20 weight-500 mb-10 text-grey-900">
          Welcome to Aseoebi.Africa
        </h3>
        <p className="text-center text-14 text-grey-700">
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
            "border-red": formikInitial.touched.fullname && formikInitial.errors.fullname,
          })}
          after={
            <InputAlert 
              hasError={!!(formikInitial.touched.fullname && formikInitial.errors.fullname)} 
              errorMessage={formikInitial.errors.fullname}
            />
          }
        />

        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          className="l:mt-30 mt-18"
          placeholder="your@email.com"
          handleChange={formikInitial.handleChange}
          handleBlur={formikInitial.handleBlur}
          inputClass={cx('', {
            "border-red": formikInitial.touched.email && formikInitial.errors.email,
          })}
          
          after={
            <div
              className={cx(
                "notice text-12 h-0 @one:flex gap-5 j-content-end w-full mt-12 text-danger",
                {
                  "hidden!": !(formikInitial.touched.email && formikInitial.errors.email),
                }
              )}
            >
              <Icon name="alert-circle" className="w-14 a-self-center" />
              <span className="a-self-center">{formikInitial.errors.email}</span>
            </div>
          }
          handleKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                 formikInitial.handleSubmit();
            }
          }}
          
        />
        <button
          className="btn text-center bg-green weight-500 text-16 l:btn-lg btn-lg font-inter mt-30 text-14 cursor-pointer   hover:bg-darkgreen g|transition:0.5s disabled:bg-grey"
          onClick={() => {
            formikInitial.handleSubmit();
          }}
          disabled={formikInitial.isSubmitting}
        >
             {formikInitial.isSubmitting ? 'Sending OTP' : 'Continue'}
        </button>
      </form>
    </div>
  )
}

export default SignUpDetails;
