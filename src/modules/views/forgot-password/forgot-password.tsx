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

            <div className="font-inter mb-30"> 
        <h3 className="text-center text-20 weight-500 mb-10 text-grey-900">Forgot password</h3>
        <p className="text-center text-14 text-grey-700">Enter your email to reset password</p>
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
                      "border-red": forgotPasswordHandler.touched.email && forgotPasswordHandler.errors.email,
                    })}
                    after={
                      <InputAlert 
                        hasError={!!(forgotPasswordHandler.touched.email && forgotPasswordHandler.errors.email)} 
                        errorMessage={forgotPasswordHandler.errors.email}
                      />
                    }
          
        />
  

        <button 
          className="bg-green text-white py-15 l:py-18 radius-8 w-full border 
          text-14 l:text-16 mt-20 hover:pointer font-inter
          hover:bg-darkgreen g|transition:0.5s disabled:bg-grey"
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
