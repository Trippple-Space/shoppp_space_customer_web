import Icon from '@/modules/lib/components/icon/Icon'
import Image from '@/modules/lib/components/image/Image'
import Input from '@/modules/lib/components/input/Input'
import { paths } from '@/modules/lib/utility/paths'
import Link from 'next/link'
import React from 'react'

const SignUp = () => {
  return (
    <>
      <div className="text-right w-full l:w-80p mt-53 mx-25 hidden l:block">
        <span>Do you want to sell? </span>
        <Link href={paths.vendor_signup} className='text-green pointer'>Join now</Link>
      </div>
      <div className=" mx-25 flex-col flex h-full items-center j-content-center">
        <div className='l:hidden w-full'>
          <Image
            className='w-79 h-21 mt-20 mb-50 a-self-left'
            src='asoebi-logo-colored.png'
            alt='logo'
            type='logo'
          />
        </div>


        <div className="signup w-full l:w-80p mx-auto mb-50 h-100p l:h-fit flex flex-col">
          <div className='w-full'>
            <div className="font-inter">
              <h3 className="text-center text-30 l:text-38 weight-500 mb-10 text-dimgrey ">Create your account</h3>
              <p className="text-center text-16 l:text-20 text-light-grey">Please enter your details.</p>
            </div>

            <form className="form block w-100p mt-36 l:mt-50 ">

              <Input
                label='Name'
                id='fullname'
                name='fullname'
                placeholder='Enter your full name'
              />

              <Input
                label='Email'
                id='email'
                name='email'
                type='email'
                className='mt-30'
                placeholder='Enter your email'
              />

              <Input
                label='Password'
                id='password'
                name='password'
                type='password'
                placeholder='********'
                className='mt-30'
                after={
                  <div className="notice text-14 flex gap-10 mt-9 text-danger">
                    <Icon name='alert-circle' className='w-18 a-self-center' />
                    <span className='a-self-center'>Invalid email or password</span>
                  </div>
                }
              />

              <div className="flex space-between w-full mt-18 text-grey text-14 l:text-16">
                <label className='pointer content-center flex'>
                  <input type="checkbox" name="" className='accent-#0B9378 w-14 l:w-20 h-14 l:h-20 mr-5 l:mr-10 ' id="" />
                  <span>I agree to all Terms, Privacy policy and Fees</span>
                </label>
              </div>

              <button disabled className="bg-green text-white py-15 l:py-18 radius-10 w-full border 
                                text-18 l:text-20 mt-40 hover:pointer
                                hover:bg-darkgreen g|transition:0.5s disabled:bg-grey
                              "
              >
                Sign In
              </button>

              <div className="text-18 text-light-grey mt-30 mx-auto w-fit">
                <span>Already have an account? </span>
                <Link href={paths.login} className='text-green'>Sign In</Link>
              </div>

            </form>
          </div>

        </div>
      </div>
    </>
  )
}

export default SignUp
