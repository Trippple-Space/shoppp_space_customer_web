import BoxRadio from '@/modules/lib/components/box-radio/BoxRadio'
import React, { FC } from 'react'
import { IVendorSignUpStep } from './VendorSignUp'



const VendorSignUpStep1: FC<IVendorSignUpStep> = ({ setCurrentStep }) => {
    return (
        <div>
            <div className='mt-33'>
                <h3 className='text-24 weight-500 text-black' >Let’s get started. Which of these best describe you?</h3>
                <p className='text-16 mt-13'>We'll assist you in setting up your store tailored to its unique needs.</p>
            </div>

            <div className='mt-33 flex space-between gap-23 flex-col m:flex-row'>
                <BoxRadio id="experience" name="experience" label="I’m just starting" />
                <BoxRadio id="experience" name="experience" label="I’m already selling in person" />
            </div>

            <div>
                <div className='j-content-end flex mt-110 '>
                    <button className='bg-transparent text-dimgrey py-15 w-117 border-none 
                                 text-13 l:text-16 mt-40 hover:pointer hover:text-green'>
                        Skip All
                    </button>
                    <button className='bg-transparent text-dimgrey py-15 w-117 border-none 
                                text-13 l:text-16 mt-40 hover:pointer hover:text-green'>
                        Skip
                    </button>
                    <button onClick={() => setCurrentStep(2)} className='bg-green text-white py-15 l:py-15 w-117 radius-5 border 
                                 mt-40 hover:pointer text-13 l:text-16
                                hover:bg-darkgreen g|transition:0.5s disabled:bg-grey'>
                        Next step
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VendorSignUpStep1