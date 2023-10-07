import BoxRadio from '@/modules/lib/components/box-radio/BoxRadio'
import React, { FC } from 'react'
import { IVendorSignUpStep } from './VendorSignUp'
import BoxSelect from '@/modules/lib/components/box-select/BoxSelect'
import Image from '@/modules/lib/components/image/Image'
import Icon from '@/modules/lib/components/icon/Icon'
import Input from '@/modules/lib/components/input/Input'


const VendorSignUpStep3: FC<IVendorSignUpStep> = ({ setCurrentStep }) => {
    return (
        <div>
            <div className='mt-33'>
                <h3 className='text-20 weight-500 text-natural-900' >You are almost done.</h3>
                <p className='text-14 mt-10 text-natural-700'>Give us some information about your store. This is what your customers will see.</p>
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
                    rows={10}
                    after={''
                        // <span className='text-12 mt-10'>Maximum number of 20 words allowed. Please remove excess word</span>
                    }
                />
            </div>

            <div className='flex space-between mt-40 '>
                <div className="flex">
                    <button onClick={() => setCurrentStep(2)} className='flex gap-8 items-center bg-transparent pointer text-dimgrey py-15 w-117 border-none 
                                 text-13 l:text-14 w-fit'>
                        <Icon name='caret-left' className='w-fit' />
                        <span className='w-fit h-fit'>Back</span>
                    </button>
                </div>
                <div className='flex'>
                    <button onClick={() => setCurrentStep(4)} className='bg-green text-white py-10 px-20 l:py-10 w-fit radius-5 border 
                        hover:pointer text-13 l:text-14
                        hover:bg-darkgreen g|transition:0.5s disabled:bg-grey'>
                        Next step
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VendorSignUpStep3