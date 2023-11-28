import React from 'react'
import Image from '@/modules/lib/components/image/Image'
import Button from '@/modules/lib/components/button/Button'
import { BsSearch } from 'react-icons/bs'
import { FaRegCheckCircle } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'

const AddProductModal = ({ products, setSelectedImage, className }: any) => {
  return (
    <div className="z-index-2 z-2">
        <div className={`bg-white absolute ${className} l-10 w-450 radius-8 g|box-shadow:0px|_|2px|_|10px|_|0px|_|#00000014; overflow-hidden h-600  overflow-auto`}>
            <header className='flex space-between border-b border-1 border-grey-300 items-center p-14'>
                <div className='text-12'>Add explore image (0/5)</div>
                <div className='pointer' onClick={() => setSelectedImage((prev: any) => !prev)}><IoMdClose /></div>
            </header>

            <main className="relative">
                <div className="flex items-center j-content-center mt-22 border-dashed border-1 border-grey-700 mx-50 px-14">
                    <Image
                        className='w-40 h-60 l:w-90 l:h-90 p-20'
                        src='upload.svg'
                        alt='product'
                        type='icon'
                    />
                    <div className="text-14">Drop your images here or <br /> <span className="text-green-500">click to browse</span></div>
                </div>

                <div className="text-14 weight-500 mt-30 px-14">Link a product <span className="text-red">*</span></div>
                <div className='w-100p h-70 hidden l:flex mt-15 px-14'>
                    <div className=" w-100p pl-15 pr-7  flex overflow-hidden space-between items-center h-fit py-4 border border-grey-300 radius-45 g|box-shadow:0px|_|2px|_|10px|_|0px|_|#00000014; ">
                        <input type="text" placeholder='Search Product' className='border-none w-90p text-12 text-light-grey outline-none'/>
                        <div className='w-25 flex items-center bg-green round h-25 text-white'>
                            <BsSearch className='text-12' />
                        </div>
                    </div>
                </div>

                <div className="text-12 text-grey-700 px-14">Recently added products</div>

                {
                    <div className={`grid grid-${products?.length}-cols-1fr gap-10 overflow-auto scroll-x no-scrollbar px-14`}>
                        {
                            products.map((product: any) => (
                                <div className="border-solid border-1 border-yellow w-200 radius-8 flex space-between p-8 mt-15 mb-25">
                                    <div className="flex items-center gap-10">
                                        <div className='w-50 h-50'>
                                            <Image
                                                className='w-fit h-100p radius-5 l:radius-10'
                                                src={product}
                                                alt='product'
                                                type='image'
                                            />
                                        </div>
                                        <div className="text-14 weight-500">
                                            <div className="">Ankara g....</div>
                                            <div className="mt-4">NGN 28,000</div>
                                        </div>
                                    </div>
                                    <div ><FaRegCheckCircle className="text-yellow border-solid border-1 border-grey-300 radius-50p w-20 h-20 text-20" /></div>
                                </div>
                            ))
                        }
                    </div>
                }

                <div className="border-b border-grey-300 flex gap-20 j-content-center px-14">
                    <div className="py-8 px-4">Ankara</div>
                    <div className="py-8 px-4">Aso oke</div>
                    <div className="py-8 px-4">Linen</div>
                    <div className="py-8 px-4">Senator</div>
                    <div className="py-8 px-4">Lace</div>
                    <div className="py-8 px-4">Guinea</div>
                </div>

                <div className="mb-40">
                    {
                        <div className={`grid grid-3-cols-1fr gap-10 overflow-auto scroll-x no-scrollbar px-14 j-content-center mt-30`}>
                            {
                                products.map((product: any) => (
                                    <div className="border-solid border-1 border-yellow w-130 radius-8 p-8">
                                        <div className="relative">
                                            <div className="absolute r-5 t-5 ">
                                                <FaRegCheckCircle className="text-yellow border-solid border-1 border-grey-300 radius-50p w-20 h-20 text-20 bg-white radius-50p w-fit" />
                                            </div>
                                            <div className='w-full h-100'>
                                                <Image
                                                    className='w-full h-100p radius-5 l:radius-10'
                                                    src={product}
                                                    alt='product'
                                                    type='image'
                                                />
                                            </div>
                                            <div className="text-14 weight-500">
                                                <div className="text-14 mt-10 weight-500">Ankara grade II</div>
                                                <div className="mt-4 text-14 weight-500">NGN 28,000</div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    }
                </div>

                <div className="flex p-20 items-center j-content-center g|box-shadow:0px|_|2px|_|10px|_|0px|_|#00000014; ">
                    <div className="border-r border-grey-300 pr-40 mr-40">
                        <div className="">Image name: <span className="text-grey-600"> Ankara53.png</span></div>
                        <div className="mt-4">Image size: <span className="text-grey-600"> 2MB</span></div>
                        <div className="mt-4">Linked product:<span className="text-grey-600"> Ankara Grade II</span></div>
                    </div>
                    <div className="text-center">
                        <Button children="Save" />
                    </div>
                </div>
            </main>
        </div>
    </div>
  )
}

export default AddProductModal