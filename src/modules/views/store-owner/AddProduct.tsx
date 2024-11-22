import Button from '@/modules/lib/components/button/Button'
import Input from '@/modules/lib/components/input/Input'
import React from 'react'
import Image from '@/modules/lib/components/image/Image'
import { CiCircleQuestion } from 'react-icons/ci'

const AddProduct = () => {
  return (
    <>
        <div className="flex gap-5">
            <h2>Edit Product</h2>
            <div><CiCircleQuestion /></div>
        </div>
        
        <div className="mt-22 text-14 l:text-16 text-grey-700 l:w-70p">
            The most important feature in store editing section is the product adding part.
            when adding product here, do not ignore to fill all the required fields completely 
            and follow the products adding rules.
        </div>
        <div className="grid l:g|grid-template-columns:auto|_|55% gap-20 l:gap-102 mt-30 l:mt-0!">
            <div className="grid l:block gap-20">
                <Input
                    label={<>Product Name <span className="text-red">*</span></>}
                    id='phoneNUmber'
                    name='text'
                    type='text'
                    placeholder='Enter product name'
                    className='l:my-40'
                    after={<div className="text-12">Maximum of 5 characters</div>}
                />

                <Input
                    label={<>Product category <span className="text-red">*</span></>}
                    id='address'
                    name='address'
                    type='text'
                    placeholder='Enter your house address'
                    className='l:my-40'
                />

                <Input
                    label={<>Product Description <span className="text-red">*</span></>}
                    id='state'
                    name='state'
                    type='textarea'
                    placeholder='Select from dropdowns'
                    className='l:my-40'
                />
            </div>

            <div className="mt-42">
                <div className="text-16 text-grey-700">Product images <span className="text-red">*</span></div>
                <div className="grid l:g|grid-template-columns:auto|_|auto|_|auto gap-20 l:gap-0 mt-20">
                    <div className="text-center l:w-fit border-dashed border-1 border-grey-500 radius-8 w-100p l:w-250 relative pb-20 l:pb-0!">
                        <div className="l:take-to-center">
                            <Image
                                className='w-100 h-100 l:w-100 l:h-100 p-20'
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

                    <div className="text-center l:w-fit border-dashed border-1 border-grey-500 radius-8 w-100p l:w-250 relative pb-20 l:pb-0!">
                        <div className="l:take-to-center">
                            <Image
                                className='w-100 h-100 l:w-100 l:h-100 p-20'
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

                    <div className="grid gap-10">
                        <div className="text-center border-dashed border-1 border-grey-500 p-20 radius-8">
                            <Image
                                className='w-58 h-58 l:w-58 l:h-58 p-20'
                                src='upload.svg'
                                alt='product'
                                type='icon'
                            />
                            <div className="weight-500 text-grey-800 text-16">
                                <div className="">
                                    Drop your image here or
                                    <span className="text-green-500 underline mt-5 text-14 pointer"> Click to browse</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center border-dashed border-1 border-grey-500 p-20 radius-8">
                            <Image
                                className='w-58 h-58 l:w-58 l:h-58 p-20'
                                src='upload.svg'
                                alt='product'
                                type='icon'
                            />
                            <div className="weight-500 text-grey-800 text-16">
                                <div className="">
                                    Drop your image here or
                                    <span className="text-green-500 underline mt-5 text-14 pointer"> Click to browse</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-grey-700 mt-40 text-14 l:text-16">
                    You need to add at least four images. Pay attention to the quality of the pictures you add, 
                    comply with the background color standards. pictures must be in certain dimensions.
                </div>

                <div className="l:grid">
                    <div className="l:flex mt-40 l:mt-0 items-center space-between">
                        <div className="mb-10 l:mb-0">
                            <div className="weight-600">Featured In</div>
                            <div className="weight-400 text-grey-700 text-14">add popular event where this product is featured in.</div>
                        </div>
                        <Input
                            id='state'
                            name='state'
                            type='text'
                            placeholder='e.g 2017 popular event'
                            className='l:my-40'
                        />
                    </div>
                    <div className="l:flex mt-40 l:mt-0 items-center space-between">
                        <div className="mb-10 l:mb-0">
                            <div className="weight-600">Made In</div>
                            <div className="weight-400 text-grey-700 text-14">add where this product is made from</div>
                        </div>
                        <Input
                            id='state'
                            name='state'
                            type='text'
                            placeholder='e.g china'
                            className='l:my-40'
                        />
                    </div>
                </div>

                <div className="l:text-right mt-40 mb-40 flex gap-20 l:j-content-end">
                    <button className='bg-transparent text-grey-900 py-10 l:py-15 px-20 w-fit radius-5 border-none
                                    hover:pointer text-13 l:text-14 font-inter 
                                    g|transition:0.5s disabled:bg-grey'>
                        Discard
                    </button>
                    <Button theme='primary' children="Save Product" />
                </div>
            </div>
        </div>
    </>
  )
}

export default AddProduct