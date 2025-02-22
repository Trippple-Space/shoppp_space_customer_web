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
    <>
      <div className="font-inter mb-30"> 
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
    </>
  )
}

export default Login
