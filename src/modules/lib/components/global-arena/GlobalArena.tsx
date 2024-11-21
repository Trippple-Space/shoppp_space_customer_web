import React from 'react'
import { Toaster } from 'sonner'
import AddressModal from '../address-modal/AddressModal'
import LoginModal from '../login-modal/LoginModal'

const GlobalArena = () => {
  return (
    <>
      <Toaster position='top-center' />
      <AddressModal />
      <LoginModal />
    </>
  )
}

export default GlobalArena