import Image from '@/modules/lib/components/Image/Image'
import React from 'react'

const Login = () => {
  return (
    <div className="flex h-100vh w-100p">
        <div className="w-50p m-15">
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
                  className='h-95p w-fit absolute r-0 b-0' 
                  src='carton-man.png'
                  alt='Delivery'
                />
              </div>

            </div>
        </div>
        <div className="form-side w-50p ">
            
        </div>
    </div>
  )
}

export default Login
