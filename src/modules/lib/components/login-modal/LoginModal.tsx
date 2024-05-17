"use client"

import React from 'react'
import './LoginModal.module.scss'
import { useCartStore } from '../../utility/store/cart.store';

const LoginModal = () => {
  const { showLoginModal, isLoginModal } = useCartStore();
  console.log(showLoginModal)
  return (
    <>
        {
            showLoginModal ? 
            <div className='radius-8'>
                <div className='bg-black absolute z-6 l-0 t-0 h-100vh w-100p fixed opacity-40'></div>
                <div className='absolute text-50 l:t-50p t-50p g|transform:translate(-50%) bg-white z-7 fixed' onClick={isLoginModal}>LoginModal</div> 
            </div>
            : ''
        }
    </>
  )
}

export default LoginModal 