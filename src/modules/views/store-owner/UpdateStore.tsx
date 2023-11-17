import Image from '@/modules/lib/components/image/Image'
import StorefrontNavBar from '@/modules/lib/components/nav-bar/StorefrontNavBar'
import React from 'react'
import { GrStar } from 'react-icons/gr'
import { FaPlus } from "react-icons/fa6";
import { FaBasketShopping } from "react-icons/fa6";
import { BiSolidCategory } from "react-icons/bi";
import { BsBasket3 } from "react-icons/bs";
import { RiMenuAddLine } from "react-icons/ri";
import { CiCircleQuestion } from "react-icons/ci";
import Input from '@/modules/lib/components/input/Input';
import Button from '@/modules/lib/components/button/Button';

const UpdateStore = () => {
  return (
    <>
        <div className="bg-light-yellow w-full ">
            <StorefrontNavBar />
            <div className="bg-red text-center text-white flex items-center gap-10 space-between weight-400 text-14 py-10 px-20">
               <div></div>
                <div className="flex items-center gap-10">
                    <div className=""><GrStar className='' /></div>
                    <div className="">Please complete the store setup to ensure your customers have an exceptional experience.</div>
                </div>
                <div className="bg-grey-400 weight-500 radius-4 w-fit text-right text-white px-10 py-5 text-10 items-end pointer">Dismiss</div>
            </div>

            <div className="app-width mt-80 pb-100">
                <div className="">
                    <h2 className="weight-500 text-48 letter-spacing-3 line-height-70 max-w-840 text-grey-700">
                        Please add a tag line or your store slogan. 
                        <button className='bg-red text-white py-10 l:py-8 px-10 w-fit radius-5 border-none
                                           hover:pointer text-13 l:text-14 font-inter 
                                           hover:bg-darkred g|transition:0.5s disabled:bg-grey ml-80'>
                            Edit tagline
                        </button>
                    </h2>
                    <p className="text-18 weight-300 g|letter-spacing:1.2px; line-height-38 max-w-700 mt-30">
                        Please provide a concise marketing message that effectively promotes your business. 
                        <button className='text-right bg-red text-white py-10 l:py-8 px-10 w-fit radius-5 border-none
                                           hover:pointer text-13 l:text-14 font-inter 
                                           hover:bg-darkred g|transition:0.5s disabled:bg-grey ml-100'>
                            Edit marketing message
                        </button>
                    </p>
                </div>

                <div className="mt-55 max-w-600 flex items-center gap-27">
                    <div className="flex space-between">
                        {[0].map(() => (
                            <div className="bg-white w-fit round  border border-2 border-green p-1 relative">
                                {/* <div
                                    className="
                                        w-90 h-90 bg-white round 
                                        g|background:url(https://res.cloudinary.com/codennerd/image/upload/v1689377463/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.05_AM_hnms5f.jpg);
                                        bg-cover
                                        "
                                ></div> */}
                                <Image
                                    className='w-40 h-60 l:w-90 l:h-90 p-20'
                                    src='upload.svg'
                                    alt='product'
                                    type='icon'
                                />
                                <div className='absolute bg-red py-7 b-0 r-0 z-index-2 radius-50p w-30 h-30 text-white'><FaPlus /></div>
                            </div>
                        ))}
                    </div>
                    <div className="text-14  line-height-30 text-grey-900 weight-400">Showcase your five best finished products by adding captivating images and linking them to the corresponding product listings. This will ensure your products are prominently displayed in the <span className='text-green-500 pointer'>Explore</span> section, gaining visibility among potential customers.</div>
                </div>
            </div>
        </div>

        {/* g|background:url(https://res.cloudinary.com/codennerd/image/upload/v1680366944/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.18_PM_wbawin.jpg); */}

        <div
            className="w-450 hidden l:block
                        g|box-shadow:-2px|_|8px|_|50px|_|4px|_|rgba(0,0,0,0.20)|_|inset; 
                        bg-white h-591 absolute r-0 t-200 radius-t-l-40 radius-b-l-40
                        bg-contain border border-5 g|border-color:rgba(217,217,217,0.70); border-r-0 text-center
                        "
        >
            <div className="take-to-center">
            <Image
                className='w-101 h-101 l:w-101 l:h-101 p-20'
                src='upload.svg'
                alt='product'
                type='icon'
            />
            <div className="weight-500 text-grey-800 text-16">
                <div className="">Drop your image here or</div>
                <div className="text-green-500 underline mt-5 text-14 pointer">Click to browse</div>
            </div>
            </div>
        </div>

        <main className="">
            <header className="flex items-center gap-74 text-18 text-grey-900 weight-500 mt-80 pb-38 border-b border-grey-300 px-350">
                <div className="flex items-center gap-10 pointer">
                    <div><FaBasketShopping /></div>
                    <div>Products</div>
                </div>

                <div className="flex items-center gap-10 pointer">
                    <div><BsBasket3 /></div>
                    <div>Add new product</div>
                </div>

                <div className="flex items-center gap-10 pointer">
                    <div><BiSolidCategory /></div>
                    <div>Add new category</div>
                </div>

                <div className="flex items-center gap-10 pointer">
                    <div><RiMenuAddLine /></div>
                    <div>Add new section</div>
                </div>
            </header>

            <div className="app-width mt-48">
                <div className="flex gap-5">
                    <h2>Edit Product</h2>
                    <div><CiCircleQuestion /></div>
                </div>
                <div className="mt-22 text-16 text-grey-700 w-70p">
                    The most important feature in store editing section is the product adding part.
                    when adding product here, do not ignore to fill all the required fields completely 
                    and follow the products adding rules.
                </div>

                <div className="grid g|grid-template-columns:40%|_|60% gap-102">
                    <div className="">
                        <Input
                            label={<>Product Name <span className="text-red">*</span></>}
                            id='phoneNUmber'
                            name='text'
                            type='text'
                            placeholder='Enter product name'
                            className='l:my-40'
                            after="Maximum of 5 characters"
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
                        <div className="grid g|grid-template-columns:auto|_|auto|_|auto mt-20">
                            <div className="text-center w-fit border-dashed border-1 border-grey-500 radius-8 w-250 relative">
                                <div className="take-to-center">
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

                            <div className="text-center w-fit border-dashed border-1 border-grey-500 radius-8 w-250 relative">
                                <div className="take-to-center">
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

                        <div className="text-grey-700 mt-40 text-16">
                            You need to add at least four images. Pay attention to the quality of the pictures you add, 
                            comply with the background color standards. pictures must be in certain dimensions.
                        </div>

                        <div className="grid gap-30">
                            <div className="flex items-center space-between">
                                <div className="">
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
                            <div className="flex items-center space-between">
                                <div className="">
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

                        <div className="text-right mt-40 mb-40 flex gap-20 j-content-end">
                            {/* <Button theme='neutral' children="Discard" /> */}
                            <button className='bg-transparent text-grey-900 py-10 l:py-15 px-20 w-fit radius-5 border-none
                                               hover:pointer text-13 l:text-14 font-inter 
                                               g|transition:0.5s disabled:bg-grey'>
                                Discard
                            </button>
                            <Button theme='primary' children="Save Product" />
                        </div>
                    </div>
                </div>
            </div>

            
        </main>
    </>
  )
}

export default UpdateStore