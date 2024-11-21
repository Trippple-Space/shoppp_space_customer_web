import Button from '@/modules/lib/components/button/Button'
import Input from '@/modules/lib/components/input/Input'
import React from 'react'
import Image from '@/modules/lib/components/image/Image'
import { CiCircleQuestion } from 'react-icons/ci'

const AddCategory = () => {
  return (

    <>
        <div className="flex gap-5">
            <h2>Edit Category</h2>
            <div><CiCircleQuestion /></div>
        </div>
        
        <div className="mt-22 text-14 l:text-16 text-grey-700 l:w-70p">
            The most vital aspect in store editing is the category addition part. 
            Make sure to add categories correctly by filling out all the required 
            fields completely and following the rules for adding categories.
        </div>
        <div className="w-100p l:w-70p">
            <div className="mt-50 l:mt-70">
                <div className="grid">
                    <div className="grid gap-10 l:flex l:items-center l:space-between">
                        <div className="weight-600">Category Name <span className="text-red">*</span></div>
                        <Input
                            id='state'
                            name='state'
                            type='text'
                            placeholder='e.g  ankara'
                            className='l:w-50p'
                        />
                    </div>

                    <div className="grid gap-10 l:flex l:items-center l:space-between mt-20">
                        <div className="weight-600">Parent Category</div>
                        <Input
                            id='state'
                            name='state'
                            type='text'
                            placeholder='/asoebi'
                            className='l:my-40 l:w-50p'
                        />
                    </div>

                    <div className="grid gap-10 l:flex l:items-center l:space-between mt-20">
                        <div className="">
                            <div className="weight-600">Description <span className="text-red">*</span></div>
                            <div className="weight-400 text-grey-700 text-14 mt-4">add popular event where this product is featured in.</div>
                        </div>
                        <Input
                            id='state'
                            name='state'
                            type='textarea'
                            placeholder='Describe this product...'
                            rows={10}
                            className='l:w-50p'
                        />
                    </div>

                    <div className="grid l:flex gap-20 l:gap-90 mt-40">
                        <div className="">
                            <div className="weight-600">Upload category image <span className="text-red">*</span></div>
                            <div className="weight-400 text-grey-700 text-14 mt-4">do not exceed 50 character when entering the category image.</div>
                        </div>
                        <div className="text-center border-dashed border-1 border-grey-500 radius-8 l:w-250 h-200 relative">
                            <div className="take-to-center">
                                <Image
                                    className='w-full l:w-100 h-100 l:w-100 l:h-100 p-20'
                                    src='upload.svg'
                                    alt='product'
                                    type='icon'
                                />
                                <div className="weight-500 text-grey-800 text-14">
                                    <div className="">Drop your image here or</div>
                                    <div className="text-green-500 underline mt-5 text-14 pointer">Click to browse</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-right mt-40 mb-40 flex gap-20 l:j-content-end">
                <button className='bg-transparent text-grey-900 py-10 l:py-15 px-20 w-fit radius-5 border-none
                                hover:pointer text-13 l:text-14 font-inter 
                                g|transition:0.5s disabled:bg-grey'>
                    Discard
                </button>
                <Button theme='primary' children="Save Category" />
            </div>
        </div>
    </>
  )
}

export default AddCategory