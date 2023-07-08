import Icon from '@/modules/lib/components/icon/Icon'
import Image from '@/modules/lib/components/___image/Image'
import Input from '@/modules/lib/components/input/Input'
import { paths } from '@/modules/lib/utility/paths'
import Link from 'next/link'
import React from 'react'

const Login = () => {
  return (
    <div className="flex h-100vh w-100p">
      <div className="l:w-50p hidden l:block m-15">
        <div className="bg-green flex flex-col h-100p radius-15 overflow-hidden">
          <div>
            <Image
              className='w-115 h-31 ml-40 mt-30'
              src='asoebi-logo-white.png'
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
      <div className="form-side w-100p l:w-50p h-full overflow-hidden">
        <div className="my-20 mx-25 flex-col l:flex-row flex h-full items-center">
          <div className='l:hidden w-full'>
            <Image
              className='w-79 h-21 mb-50 a-self-left'
              src='asoebi-logo-colored.png'
              alt='logo'
              type='logo'
            />
          </div>

          <div className="login w-full l:w-80p mx-auto mb-50 h-full l:h-fit">
            <div className="font-inter">
              <h3 className="text-center text-30 l:text-38 weight-500 mb-10 text-dimgrey ">Welcome back</h3>
              <p className="text-center text-16 l:text-20 text-light-grey  ">Please enter your details.</p>
            </div>

            <form className="form block w-100p mt-36 l:mt-50 ">
              <Input
                label='Email'
                id='email'
                name='email'
                type='email'
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
                    {/* <Icon name='alert-circle' className='w-18 a-self-center' />
                            <span className='a-self-center'>Invalid email or password</span> */}
                  </div>
                }
              />

              <div className="flex space-between w-full mt-18 text-grey text-14 l:text-16">
                <label className='pointer content-center flex'>
                  <input type="checkbox" name="" className='accent-#0B9378 w-14 l:w-20 h-14 l:h-20 mr-5 l:mr-10 ' id="" />
                  <span>Remember me for 20 days</span>
                </label>
                <div>Forgotten password</div>
              </div>

              <button disabled className="bg-green text-white py-15 l:py-18 radius-10 w-full border 
                                          text-18 l:text-20 mt-40 hover:pointer
                                          hover:bg-darkgreen g|transition:0.5s disabled:bg-grey
                                        "
              >
                Sign In
              </button>

              <div className="text-18 text-light-grey mt-30 mx-auto w-fit">
                <span>Don’t have an account?</span>
                <Link href={paths.signup} className='text-green'> Sign Up</Link>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
