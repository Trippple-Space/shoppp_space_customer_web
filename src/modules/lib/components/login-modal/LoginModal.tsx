"use client"

import React from 'react'
import './LoginModal.module.scss'
import { useCartStore } from '../../utility/store/cart.store';

const LoginModal = () => {
  const { showLoginModal, isLoginModal } = useCartStore();
  console.log(showLoginModal)
  return (
    <>
        {showLoginModal ? <div className='text-50 mt-100' onClick={isLoginModal}>LoginModal</div> : ''}
    </>
  )
}

export default LoginModal 