"use client"

import AuthHeader from '@/modules/lib/components/auth-header/AuthHeader'
import Icon from '@/modules/lib/components/icon/Icon'
import Image from '@/modules/lib/components/image/Image'
import Input from '@/modules/lib/components/input/Input'
import InputAlert from '@/modules/lib/components/input/input-alert/InputAlert'
import { useForgotPassword } from '@/modules/lib/utility/hooks/use-forgot-password'
import { useLoginView } from '@/modules/lib/utility/hooks/use-login'
import { paths } from '@/modules/lib/utility/paths'
import { authService } from '@/modules/lib/utility/services/auth.service'
import { cx } from '@/modules/lib/utility/utility'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

const ForgotPassword = () => {
  const { formHandler:forgotPasswordHandler } = useForgotPassword()
    const router = useRouter();



  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        forgotPasswordHandler.handleSubmit();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [forgotPasswordHandler]);
  
  return (
    <>
      <div className='w-full'>

            <div className="font-inter mb-[30px]"> 
        <h3 className="text-center text-[20px] font-medium mb-[10px] text-[#1F1B17]">Forgot password</h3>
        <p className="text-center text-[14px] text-[#6B6662]">Enter your email to reset password</p>
      </div>

      <form onSubmit={forgotPasswordHandler.handleSubmit} className="">
        <Input
          label='Email'
          id='email'
          name='email'
          type='email'
          placeholder='Enter your email'
          handleBlur={forgotPasswordHandler.handleBlur}
          handleChange={forgotPasswordHandler.handleChange}
            value={forgotPasswordHandler.values.email}
          
              inputClass={cx({
                      "border-[#DE3838]": forgotPasswordHandler.touched.email && forgotPasswordHandler.errors.email,
                    })}
                    after={
                      <InputAlert 
                        hasError={!!(forgotPasswordHandler.touched.email && forgotPasswordHandler.errors.email)} 
                        errorMessage={forgotPasswordHandler.errors.email}
                      />
                    }
          
        />
  

        <button 
          className="bg-brand text-white py-[15px] lg:py-[18px] rounded-[8px] w-full border 
          text-[14px] lg:text-[16px] mt-[20px] hover:cursor-pointer font-inter
          hover:bg-brand-hover transition-all duration-500 disabled:bg-[#676767]"
          type="submit"
            disabled={forgotPasswordHandler.isSubmitting}
      
        >
          {'Send reset link'}
          </button>

      </form>
</div>

    </>
  )
}

export default ForgotPassword
