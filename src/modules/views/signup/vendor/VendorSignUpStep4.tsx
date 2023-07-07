import BoxRadio from '@/modules/lib/components/box-radio/BoxRadio'
import React, { FC } from 'react'
import { IVendorSignUpStep } from './VendorSignUp'
import BoxSelect from '@/modules/lib/components/box-select/BoxSelect'
import Image from '@/modules/lib/components/image/Image'
import Icon from '@/modules/lib/components/icon/Icon'
import Input from '@/modules/lib/components/input/Input'


const VendorSignUpStep4: FC<IVendorSignUpStep> = ({ setCurrentStep }) => {
    return (
        <div>
            <div className='mt-33'>
                <h3 className='text-24 weight-500 text-black' >Finally!</h3>
                <p className='text-16 mt-13'>Let's have something to identify you with</p>
            </div>

            <div className='mt-33 space-between gap-23'>
               
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
            </div>

            <div className='flex space-between mt-40 '>
                <div className="flex">
                    <button onClick={() => setCurrentStep(3)} className='flex gap-5 items-center bg-transparent text-dimgrey py-15 w-117 border-none 
                                 text-13 l:text-16 w-fit hover:pointer hover:text-green'>
                        <Icon name='caret-left' className='w-fit' />
                        <span className='w-fit h-fit'>Back</span> 
                    </button>
                </div>
                <div className='flex'>
                    <button className='bg-green text-white py-15 l:py-15 w-117 radius-5 border 
                                 hover:pointer text-13 l:text-16
                                hover:bg-darkgreen g|transition:0.5s disabled:bg-grey'>
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VendorSignUpStep4