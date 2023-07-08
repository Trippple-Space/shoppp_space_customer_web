import BoxRadio from '@/modules/lib/components/box-radio/BoxRadio'
import React, { FC } from 'react'
import { IVendorSignUpStep } from './VendorSignUp'
import BoxSelect from '@/modules/lib/components/box-select/BoxSelect'
import Image from '@/modules/lib/components/___image/Image'
import Icon from '@/modules/lib/components/icon/Icon'
import Input from '@/modules/lib/components/input/Input'


const VendorSignUpStep3: FC<IVendorSignUpStep> = ({ setCurrentStep }) => {
    return (
        <div>
            <div className='mt-33'>
                <h3 className='text-24 weight-500 text-black' >You are almost done.</h3>
                <p className='text-16 mt-13'>Give us some information about your store. This is what your customers will see.</p>
            </div>

            <div className='mt-33 space-between gap-23'>
                <Input
                    name='storeName'
                    label='Store Name'
                    className='w-full'
                    placeholder='What do we call your store?'
                />
                <Input
                    type='textarea'
                    name='storeDescription'
                    label='Store Description'
                    placeholder="What are some interesting details about your store?"
                    className='w-full mt-40'
                    after={
                        <span className='text-12 mt-10'>Maximum number of 20 words allowed. Please remove excess word</span>
                    }
                />
            </div>

            <div className='flex space-between mt-40 '>
                <div className="flex">
                    <button onClick={() => setCurrentStep(2)} className='flex gap-5 items-center bg-transparent text-dimgrey py-15 w-117 border-none 
                                 text-13 l:text-16 w-fit hover:pointer hover:text-green'>
                        <Icon name='caret-left' className='w-fit' />
                        <span className='w-fit h-fit'>Back</span>
                    </button>
                </div>
                <div className='flex'>
                    <button onClick={() => setCurrentStep(4)} className='bg-green text-white py-15 l:py-15 w-117 radius-5 border 
                                 hover:pointer text-13 l:text-16
                                hover:bg-darkgreen g|transition:0.5s disabled:bg-grey'>
                        Next step
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VendorSignUpStep3