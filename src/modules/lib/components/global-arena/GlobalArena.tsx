import React from 'react'
import { Toaster } from 'sonner'
import AddressModal from '../address-modal/AddressModal'

const GlobalArena = () => {
  return (
    <>
      <Toaster position='top-center' />
      <AddressModal />
    </>
  )
}

export default GlobalArena