"use client"

import AuthHeader from '@/modules/lib/components/auth-header/AuthHeader'
import Icon from '@/modules/lib/components/icon/Icon'
import Image from '@/modules/lib/components/image/Image'
import Input from '@/modules/lib/components/input/Input'
import InputAlert from '@/modules/lib/components/input/input-alert/InputAlert'
import { useLoginView } from '@/modules/lib/utility/hooks/use-login'
import { paths } from '@/modules/lib/utility/paths'
import { authService } from '@/modules/lib/utility/services/auth.service'
import { cx } from '@/modules/lib/utility/utility'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

const Login = () => {
  const { formHandler: loginFormHandler } = useLoginView()
    const router = useRouter();

   const handleResendOtp = async () => {
     const token = await authService.resendOtp(loginFormHandler.values.email)
    if (token) {
      router.push(`${paths.verify}?token=${token}`);
    } else {
      toast.error("Failed to resend OTP");
     }

   };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        loginFormHandler.handleSubmit();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [loginFormHandler]);
  
  return (
    <>
      <div className='w-full'>


            <div className="font-inter mb-[30px]"> 
        <h3 className="text-center text-[20px] font-medium mb-[10px] text-[#1F1B17]">Welcome back!</h3>
        <p className="text-center text-[14px] text-[#6B6662]">Enter your details below to login.</p>
      </div>

      <form onSubmit={loginFormHandler.handleSubmit} className="">
        <Input
          label='Email'
          id='email'
          name='email'
          type='email'
          placeholder='Enter your email'
          handleBlur={loginFormHandler.handleBlur}
          handleChange={loginFormHandler.handleChange}
            value={loginFormHandler.values.email}
          
              inputClass={cx({
                      "border-[#DE3838]": loginFormHandler.touched.email && loginFormHandler.errors.email,
                    })}
                    after={
                      <InputAlert 
                        hasError={!!(loginFormHandler.touched.email && loginFormHandler.errors.email)} 
                        errorMessage={loginFormHandler.errors.email}
                      />
                    }
          
            // Ensure value is passed
        />
        <Input
          label='Password'
          id='password'
          name='password'
          type='password'
          placeholder='********'
          className='lg:mt-[30px] mt-[18px]'
          handleBlur={loginFormHandler.handleBlur}
          handleChange={loginFormHandler.handleChange}
            value={loginFormHandler.values.password}
            inputClass={cx({
              "border-[#DE3838]": loginFormHandler.touched.password && loginFormHandler.errors.password,
            })}
            after={
              <InputAlert 
                hasError={!!(loginFormHandler.touched.password && loginFormHandler.errors.password)} 
                errorMessage={loginFormHandler.errors.password}
              />
            }
                  handleKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') {
                           loginFormHandler.handleSubmit();
                      }
                    }}
          />
          

          <div className="flex flex-col lg:flex-row w-full justify-between lg:items-center text-[#6B6662] lg:text-[14px] text-[12px]">
            <Link href={paths.forgotPassword}>
            
          <div className="cursor-pointer color-link border-b my-[10px] w-fit">Forgotten password?</div>
          </Link>
        {loginFormHandler.errors.password === "You have not completed sign up process." && (
          <p className="text-[#DE3838] border-b cursor-pointer text-[12px] w-fit" onClick={handleResendOtp}>
            Click here to finish setting up your account
          </p>
        )}
        </div>

        <button 
          className="bg-brand text-white py-[15px] lg:py-[18px] rounded-[8px] w-full border 
          text-[14px] lg:text-[16px] mt-[20px] hover:cursor-pointer font-inter
          hover:bg-brand-hover transition-all duration-500 disabled:bg-[#676767]"
          type="submit"
            disabled={loginFormHandler.isSubmitting}
      
        >
          {loginFormHandler.isSubmitting ? 'Signing in' : 'Sign In'}
        </button>
      </form>
</div>

    </>
  )
}

export default Login
