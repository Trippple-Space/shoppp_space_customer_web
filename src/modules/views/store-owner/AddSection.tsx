import Button from '@/modules/lib/components/button/Button'
import Input from '@/modules/lib/components/input/Input'
import React from 'react'
import Image from '@/modules/lib/components/image/Image'
import { CiCircleQuestion } from 'react-icons/ci'

const AddSection = () => {
  return (
    <>
        <div className="flex gap-5">
            <h2>Edit Section</h2>
            <div><CiCircleQuestion /></div>
        </div>
        
        <div className="mt-22 text-16 text-grey-700 w-70p">
            The most essential component in store organization is the product categorization section. 
            It is vital to accurately categorize products. Thoroughly completing all 
            the required fields and following the rules for organizing products within the store.
        </div>
        <div className="w-70p">
            <div className="mt-70">
                <div className="grid">
                    <div className="flex  space-between mb-20">
                        <div className="weight-600">Section Name <span className="text-red">*</span></div>
                        <Input
                            id='state'
                            name='state'
                            type='text'
                            placeholder='e.g  ankara'
                            className='w-50p'
                        />
                    </div>

                    <div className="flex items-center space-between">
                        <div className="">
                            <div className="weight-600">Add products to this section <span className="text-red">*</span> </div>
                            <div className="weight-400 text-grey-700 text-14 mt-4">Select product you’ll like to add to this section from the drop down</div>
                        </div>
                        
                        <Input
                            id='state'
                            name='state'
                            type='text'
                            placeholder='Select product'
                            className='l:my-40 w-50p'
                        />
                    </div>

                    <div className="flex space-between mt-20">
                        <div className="">
                            <div className="weight-600">Section product <span className="text-red">*</span></div>
                            <div className="weight-400 text-grey-700 text-14 mt-4">this are the list of products you have selected</div>
                        </div>
                        <Input
                            id='state'
                            name='state'
                            type='textarea'
                            placeholder='No products selected'
                            rows={10}
                            className='w-50p'
                        />
                    </div>
                </div>
            </div>

            <div className="text-right mt-40 mb-40 flex gap-20 j-content-end">
                <button className='bg-transparent text-grey-900 py-10 l:py-15 px-20 w-fit radius-5 border-none
                                hover:pointer text-13 l:text-14 font-inter 
                                g|transition:0.5s disabled:bg-grey'>
                    Discard
                </button>
                <Button theme='primary' children="Save Section" />
            </div>
        </div>
    </>
  )
}

export default AddSection