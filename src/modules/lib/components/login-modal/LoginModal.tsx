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

const LoginModal = () => {
  const { showLoginModal, isLoginModal } = useCartStore()
  const { formHandler: loginFormHandler } = useLoginView(isLoginModal)


  return (
    <>
      <AnimatePresence>
        {showLoginModal ? (
          <div className='radius-8 w-100p'>
            <div className='bg-black absolute z-6 l-0 t-0 h-100vh w-100p fixed opacity-40 z-20'></div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.3 }}
              className='absolute l:l-40p l:t-35p mt-150 l:mt-0 mx-45 l:mx-0 l:ml-0 g|transform:translate(-50%) bg-white z-20 fixed radius-8 l:w-400 w-80p'
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
                    inputClass='h-20 text-12'
                    handleBlur={loginFormHandler.handleBlur}
                    handleChange={loginFormHandler.handleChange}
                  />

                  <Input
                    id='password'
                    name='password'
                    type='password'
                    placeholder='Password'
                    inputClass='h-20 text-12'
                    className='mt-16'
                    handleBlur={loginFormHandler.handleBlur}
                    handleChange={loginFormHandler.handleChange}
                  />
                </main>
                <div className='text-center text-10 text-green-500 pointer'>
                  Forget Your Password?
                </div>

                <div className='px-16 mb-20'>
                  <button
                    className='bg-green text-white py-8 l:py-10 radius-8 w-full border 
                                    text-10 l:text-12 mt-20 hover:pointer font-inter
                                    hover:bg-darkgreen g|transition:0.5s disabled:bg-grey weight-600
                                '
                  >
                    Sign In
                  </button>
                </div>
              </form>

              <div className='border-t border-2 border-grey-200'></div>
              <div className='weight-500 text-10 whitespace-nowrap p-16 text-center'>
                Alredy have an account?{' '}
                <Link
                  href={paths.signup}
                  className='text-green-700'
                  onClick={isLoginModal}
                >
                  {' '}
                  Sign Up
                </Link>
              </div>
            </motion.div>
          </div>
        ) : (
          ''
        )}
      </AnimatePresence>
    </>
  )
}

export default LoginModal
