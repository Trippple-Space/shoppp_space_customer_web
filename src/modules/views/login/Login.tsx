"use client"

import AuthHeader from '@/modules/lib/components/auth-header/AuthHeader'
import Icon from '@/modules/lib/components/icon/Icon'
import Image from '@/modules/lib/components/image/Image'
import Input from '@/modules/lib/components/input/Input'
import { useLoginView } from '@/modules/lib/utility/hooks/use-login'
import React from 'react'

const Login = () => {
  const {formHandler: loginFormHandler} = useLoginView()
  return (
 
    <div className="flex h-100vh w-100p">
      <div className="l:w-50p hidden l:block m-15">
        <div className="bg-green flex flex-col h-100p radius-15 overflow-hidden">
          <div className=''>
            <Image
              className='w-115 h-31 ml-40 mt-20'
              src='new-asoebi-logo-white.svg'
              alt='logo'
              type='logo'
            />
          </div>
          <div className='relative w-100p h-100p'>
            <Image
              className='absolute h-95p w-fit r-0 b-0'
              src='carton-man-0.png'
              alt='Delivery'
            />
          </div>
        </div>
      </div>
      <div className="w-100p l:w-50p h-full overflow-hidden">
        <div className="flex flex-col h-full items-center j-content-center mx-25">

         <div className="l:hidden w-full bg-green t-0 fixed">
          <Image
            className="w-100 h-30 my-20 m-15"
            src="new-asoebi-logo-white.svg"
            alt="logo"
            type="logo"
          />
        </div>
          <div className="w-full l:w-60p h-full flex flex-col j-content-center">
            <div className="font-inter mb-30">
              <AuthHeader activeTab="login" />
              
              <h3 className="text-center text-20  weight-500 mb-10 text-grey-900">Welcome back!</h3>
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
              />

              <div className="flex w-full j-content-end text-grey-700 l:text-14 text-12 l:text-14">
                <div className="pointer color-link border-b my-10">Forgotten password?</div>
              </div>

              <button className="bg-green text-white py-15 l:py-18 radius-8 w-full border 
                text-14 l:text-16 mt-20 hover:pointer font-inter
                hover:bg-darkgreen g|transition:0.5s disabled:bg-grey"
              >
                Sign In
              </button>
            </form>
         <p className="text-center text-14 mt-30">By continuing, you agree to the Asoebi.africa <span className="color-link">Terms & Conditions</span> and <span className="color-link">
                  Privacy Policy
                  </span>
                </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
