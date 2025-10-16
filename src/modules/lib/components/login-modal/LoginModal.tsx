'use client'

import React from 'react'
import './LoginModal.module.scss'
import { useCartStore } from '../../utility/store/cart.store'
import { IoMdCloseCircle } from 'react-icons/io'
import Input from '../input/Input'
import { motion, AnimatePresence } from 'framer-motion'
import { useLoginView } from '../../utility/hooks/use-login'
import Link from 'next/link'
import { paths } from '../../utility/paths'
import { FcGoogle } from 'react-icons/fc'
import { useGoogleOauth } from '../../utility/hooks/use-google-oauth'

const LoginModal = () => {
  const { showLoginModal, isLoginModal } = useCartStore()
    const { googleOauthInitializer } = useGoogleOauth()
  const { formHandler: loginFormHandler } = useLoginView(isLoginModal)


  return (
    <>
      <AnimatePresence>
        {showLoginModal ? (
          <div className='radius-8 w-100p'>
            <div className='bg-black z-6 l-0 t-0 h-full w-100p fixed opacity-40 z-20 overflow-auto' style={{height: '100dvh'}}></div>
            <div className='fixed z-20 w-full overflow-auto h-full t-0 b-0'>
              <div className='my-auto flex flex-col j-content-center a-items-center h-full' style={{minHeight: 449}}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.3 }}
                  className='bg-white radius-8 l:w-400 sm:w-80p w-90p mx-auto'
                  style={{maxWidth: "400px"}}
                >
                  <header className='flex space-between items-center p-16'>
                    <div className='weight-500 text-16 whitespace-nowrap text-green-700'>
                      Log in
                    </div>
                    {/* <div className='weight-500 text-14 whitespace-nowrap'>Log in</div> */}
                    <IoMdCloseCircle
                      className='w-fit text-grey-400 pointer w-20 h-20'
                      onClick={isLoginModal}
                    />
                  </header>
                  <div className='border-t border-2 border-grey-200'></div>
                  <form onSubmit={loginFormHandler.handleSubmit}>
                    <main className='p-16'>
                      <Input
                        type='email'
                        id='email'
                        name='email'
                        placeholder='Email'
                        inputClass='h-26 text-14'
                        handleBlur={loginFormHandler.handleBlur}
                        handleChange={loginFormHandler.handleChange}
                      />

                      <Input
                        id='password'
                        name='password'
                        type='password'
                        placeholder='Password'
                        inputClass='h-26 text-14'
                        className='mt-16'
                        handleBlur={loginFormHandler.handleBlur}
                        handleChange={loginFormHandler.handleChange}
                      />
                    </main>
                  
                    <div className='px-16 mb-20'>
                      <button
                        className='bg-green text-white py-12 l:py-16 radius-8 w-full border text-16 mt-10 hover:pointer font-inter
                                      hover:bg-darkgreen g|transition:0.5s disabled:bg-grey weight-600
                                  '
                      >
                        Sign In
                      </button>

                          <div className="mb-20 mt-10" onClick={googleOauthInitializer}>
                                      <div className="flex py-10.15 l:py-11 bg-whitesmoke a-items-center j-content-center p-5 gap-5 radius-5 cursor-pointer">
                                        <FcGoogle className="w-24 h-24" />
                                        <span className="weight-500 text-14">Continue with Google</span>
                                      </div>
                                    </div>
                    </div>



                  

                    <div className='text-center text-14 mb-16 text-green-500 pointer w-fit mx-auto'>
                      Forgot Your Password?
                    </div>

                  </form>

                  <div className='border-t border-2 border-grey-200'></div>
                  <div className='weight-500 text-14 whitespace-nowrap p-16 text-center'>
                    Already have an account?{' '}
                    <Link
                      href={paths.signup}
                      className='text-green-700'
                      onClick={isLoginModal}
                      target='_blank'
                    >
                      {' '}
                      Sign Up
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
      </AnimatePresence>
    </>
  )
}

export default LoginModal
