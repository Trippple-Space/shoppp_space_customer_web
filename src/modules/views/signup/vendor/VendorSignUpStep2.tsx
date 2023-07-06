import BoxRadio from '@/modules/lib/components/box-radio/BoxRadio'
import React, { FC } from 'react'
import { IVendorSignUpStep } from './VendorSignUp'
import BoxSelect from '@/modules/lib/components/box-select/BoxSelect'
import Image from '@/modules/lib/components/image/Image'
import Icon from '@/modules/lib/components/icon/Icon'


const VendorSignUpStep2: FC<IVendorSignUpStep> = ({ setCurrentStep }) => {
    return (
        <div>
            <div className='mt-33'>
                <h3 className='text-24 weight-500 text-black' >What would you like to sell?</h3>
                <p className='text-16 mt-13'>You can select multiple choice. We’ll make sure you are set up to sell this products</p>
            </div>

            <div className='mt-33 flex space-between gap-23 flex-col m:flex-row'>
                <BoxSelect id="experience" name="experience" label={
                    <div className='flex py-5 gap-5'>
                       <div className='py-16'>
                            <div className="text-13 weight-400 mb-3">Fabrics</div>
                            <div className="text-10">I want to sell unsewn fabrics / clothe materials traditionally known as Asoebi</div>
                       </div>
                       <div className='w-100p max-w-60'>
                            <Icon name='fabric-on-vendor-type-icon' className='w-100p h-100p' />
                       </div>
                    </div>
                } />
                <BoxSelect id="experience" name="experience" label={
                    <div className='flex py-5 gap-5'>
                        <div className='py-16'>
                            <div className="text-13 weight-400 mb-3">Wears</div>
                            <div className="text-10">I want to sell stylish clothing products that go beyond traditional Asoebi.</div>
                        </div>
                        <div className='w-100p max-w-60'>
                            <Icon name='wears-on-vendor-type-icon' className='w-100p h-100p' />
                        </div>
                    </div>
                } />
            </div>

            <div className='flex space-between mt-150 text-13 l:text-16'>
                <div className="flex">
                    <button onClick={() => setCurrentStep(1)} className='flex gap-5 items-center bg-transparent text-dimgrey py-15 w-117 border-none 
                                  w-fit hover:pointer hover:text-green'>
                        <Icon name='caret-left' className='w-fit' />
                        <span className='w-fit h-fit'>Back</span> 
                    </button>
                </div>
                <div className='flex'>
                    <button className='bg-transparent text-dimgrey py-15 w-117 border-none 
                                  hover:pointer hover:text-green'>
                        Skip All
                    </button>
                    <button className='bg-transparent text-dimgrey py-15 w-117 border-none 
                                 hover:pointer hover:text-green'>
                        Skip
                    </button>
                    <button onClick={() => setCurrentStep(3)} className='bg-green text-white py-15 l:py-15 w-117 radius-5 border 
                                 hover:pointer 
                                hover:bg-darkgreen g|transition:0.5s disabled:bg-grey'>
                        Next step
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VendorSignUpStep2