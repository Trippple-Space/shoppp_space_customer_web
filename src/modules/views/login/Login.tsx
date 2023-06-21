import Image from '@/modules/lib/components/Image/Image'
import React from 'react'

const Login = () => {
  return (
    <div className="flex h-100vh w-100p">
        <div className="lg:w-50p hidden lg:block m-15">
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
        <div className="form-side w-100p lg:w-50p">
            <div className="my-20 mx-25">
                <div>
                  <Image 
                    className='w-79 h-21'
                    src='asoebi-logo-colored.png' 
                    alt='logo'
                    type='logo'
                  />                
                </div>              
                
                <div className="login mt-70">
                  <div className="font-inter">
                    <h3 className="text-center text-28 weight-500 mb-10 text-dimgrey ">Welcome back</h3>
                    <p className="text-center weight-300 text-18 lg:text-20 text-light-grey  ">Please enter your details.</p>
                  </div>

                  <form className="form block w-100p mt-36 nth-child(5):mt-10 ">
                      <div className="input-group">
                        <label htmlFor="name" className='block w-fit mb-14 weight-500 text-14 text-grey'>Name</label>
                        <input 
                          type="text" 
                          className='block font-roboto w-100p bg-white border-1 
                                      border-lighter-grey py-17 px-24 
                                      radius-8 box-shadow text-16 weight-400 
                                      hover:focus:placeholder:text-danger font-20
                                      lg:g|border:1px_solid_#000
                                      g|border-radius:100px!;background:pink!
                                      h-20 
                                    '
                          placeholder='Enter your fullname'
                          id='name' name='name' 
                        />
                        <div className="boo"></div>
                      </div>
                  </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login
