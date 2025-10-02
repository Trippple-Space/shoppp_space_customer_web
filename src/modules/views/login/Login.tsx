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
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

const Login = () => {
  const { formHandler: loginFormHandler } = useLoginView()
    const router = useRouter();

   const handleResendOtp = async () => {
    try {
      const { token } = await authService.resendOtp(loginFormHandler.values.email);
      toast.success("An OTP has been sent to your email for verification");
      router.push(`${paths.verify}?token=${token}`);
    } catch (error) {
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


            <div className="font-inter mb-30"> 
        <h3 className="text-center text-20 weight-500 mb-10 text-grey-900">Welcome back!</h3>
        <p className="text-center text-14 text-grey-700">Enter your details below to login.</p>
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
                      "border-red": loginFormHandler.touched.email && loginFormHandler.errors.email,
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
          className='l:mt-30 mt-18'
          handleBlur={loginFormHandler.handleBlur}
          handleChange={loginFormHandler.handleChange}
            value={loginFormHandler.values.password}
            inputClass={cx({
              "border-red": loginFormHandler.touched.password && loginFormHandler.errors.password,
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
          

        <div className="flex flex-col l:flex-row w-full j-content-between l:a-items-center text-grey-700 l:text-14 text-12">
          <div className="pointer color-link border-b my-10 w-fit">Forgotten password?</div>
        {loginFormHandler.errors.password === "You have not completed sign up process." && (
          <p className="color-red border-b pointer text-12 w-fit" onClick={handleResendOtp}>
            Click here to finish setting up your account
          </p>
        )}
        </div>

        <button 
          className="bg-green text-white py-15 l:py-18 radius-8 w-full border 
          text-14 l:text-16 mt-20 hover:pointer font-inter
          hover:bg-darkgreen g|transition:0.5s disabled:bg-grey"
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
