"use client"
import Image from '@/modules/lib/components/image/Image'
import StorefrontNavBar from '@/modules/lib/components/nav-bar/StorefrontNavBar'
import React, { useState } from 'react'
import { GrStar } from 'react-icons/gr'
import { FaPlus } from "react-icons/fa6";
import { FaBasketShopping } from "react-icons/fa6";
import { BiSolidCategory } from "react-icons/bi";
import { BsBasket3, BsSearch } from "react-icons/bs";
import { RiMenuAddLine } from "react-icons/ri";
import { CiCircleQuestion } from "react-icons/ci";
import Input from '@/modules/lib/components/input/Input';
import Button from '@/modules/lib/components/button/Button';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import OrderCard from '@/modules/lib/components/order-card/OrderCard';
import AddProduct from './AddProduct';
import AddCategory from './AddCategory'
import AddSection from './AddSection'
import Modal from '@/modules/lib/components/modal/modal'
import { IoMdClose } from 'react-icons/io'
import classNames from 'classnames'
import { FaRegCheckCircle } from 'react-icons/fa'
import Products from './Products'
import AddProductModal from './AddProductModal'
import Footer from '@/modules/lib/components/footer/Footer'

const UpdateStore = () => {
    const [action, setAction] = useState('add-products');
    const [taglineModal, setTagLineModal] = useState(false)
    const [margettingMessageModal, setMargettingMessageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(false);

    const products = [
        'https://res.cloudinary.com/codennerd/image/upload/v1689377577/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.25_AM_mghle5.jpg',
        'https://res.cloudinary.com/codennerd/image/upload/v1689377577/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.25_AM_1_kxeykx.jpg',
        'https://res.cloudinary.com/codennerd/image/upload/v1689377581/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.38_AM_2_y2rd0d.jpg',
        'https://res.cloudinary.com/codennerd/image/upload/v1689377581/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.38_AM_1_samhx5.jpg',
        'https://res.cloudinary.com/codennerd/image/upload/v1689377577/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.25_AM_mghle5.jpg',
    ]

    const selected = (option: any) => {
        switch (option) {
        case 'products':
            return (<Products />)

        case 'add-products':
            return (<AddProduct />)

        case 'add-category':
            return (<AddCategory />)

        case 'add-section':
            return (<AddSection />)
        }
    }
  return (
    <>
        <div className="bg-light-yellow w-full ">
            <StorefrontNavBar />
            <div className="bg-red text-center text-white flex items-center gap-10 space-between weight-400 text-14 py-10 px-20">
               <div></div>
                <div className="flex items-center gap-10">
                    <div className=""><AiOutlineExclamationCircle /></div>
                    <div className="">Please complete the store setup to ensure your customers have an exceptional experience.</div>
                </div>
                <div className="bg-grey-400 weight-500 radius-4 w-fit text-right text-white px-10 py-5 text-10 items-end pointer">Dismiss</div>
            </div>

            <div className="app-width mt-80 pb-100">
                <div className="">
                    <h2 className="weight-500 text-48 letter-spacing-3 line-height-70 max-w-840 text-grey-700">
                        Please add a tag line or your store slogan. 
                        <button onClick={() => setTagLineModal(prev => !prev)} className='bg-red text-white py-10 l:py-8 px-10 w-fit radius-5 border-none
                                           hover:pointer text-13 l:text-14 font-inter 
                                           hover:bg-darkred g|transition:0.5s disabled:bg-grey ml-80'>
                            Edit tagline
                        </button>
                    </h2>
                    <p className="text-18 weight-300 g|letter-spacing:1.2px; line-height-38 max-w-700 mt-30">
                        Please provide a concise marketing message that effectively promotes your business. 
                        <button onClick={() => setMargettingMessageModal(prev => !prev)} className='text-right bg-red text-white py-10 l:py-8 px-10 w-fit radius-5 border-none
                                           hover:pointer text-13 l:text-14 font-inter 
                                           hover:bg-darkred g|transition:0.5s disabled:bg-grey ml-100'>
                            Edit marketing message
                        </button>
                    </p>
                </div>

                <div className="mt-55 max-w-600 flex items-center gap-27">

                    <div className="flex space-between relative">
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
                                <div className='absolute bg-red py-7 b-0 r-0 z-index-2 radius-50p w-30 h-30 text-white pointer' onClick={() => setSelectedImage(true)}><FaPlus /></div>
                            </div>
                        ))}

                        {
                            selectedImage &&
                            <AddProductModal 
                                className="t-120"
                                products={products}
                                setSelectedImage={setSelectedImage}
                            />
                        }
                    </div>

                    <div className="text-14  line-height-30 text-grey-900 weight-400">
                        Showcase your five best finished products by adding captivating images and linking 
                        them to the corresponding product listings. This will ensure your products
                        are prominently displayed in the 
                        <span className='text-green-500 pointer'> Explore </span> 
                        section, gaining visibility among potential customers.
                    </div>
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

        <main className="mb-100">
            <header className="flex items-center gap-74 text-18 text-grey-900 weight-500 mt-80 pb-38 border-b border-grey-300 px-350">
                <div className={`flex items-center gap-10 pointer ${action == 'products' && 'text-green'}`} onClick={() => setAction('products') }>
                    <div><FaBasketShopping /></div>
                    <div>Products</div>
                </div>

                <div className={`flex items-center gap-10 pointer ${action == 'add-products' && 'text-green'}`} onClick={() => setAction('add-products') }>
                    <div><BsBasket3 /></div>
                    <div>Add new product</div>
                </div>

                <div className={`flex items-center gap-10 pointer ${action == 'add-category' && 'text-green'}`} onClick={() => setAction('add-category') }>
                    <div><BiSolidCategory /></div>
                    <div>Add new category</div>
                </div>

                <div className={`flex items-center gap-10 pointer ${action == 'add-section' && 'text-green'}`} onClick={() => setAction('add-section') }>
                    <div><RiMenuAddLine /></div>
                    <div>Add new section</div>
                </div>
            </header>

            <div className="app-width mt-48">
                <div className="">
                    {selected(action)}
                </div>
            </div>

            <Modal isOpen={taglineModal} onClose={() => setTagLineModal(false)} extraClass={{ overflow: 'hidden', width: "1000px" }}>
                <div className="">
                    <header className='flex space-between border-b border-1 border-grey-300 items-center px-35'>
                        <div className='text-16 weight-500 text-green-500 border-b border-3 border-green-500 w-fit p-15'>Edit tagline</div>
                        <div className='pointer' onClick={() => setTagLineModal(prev => !prev)}><IoMdClose /></div>
                    </header>

                    <main className="p-35">
                        <div className="flex items-center gap-10 bg-light-yellow p-20 radius-8">
                            <div className="text-24"><AiOutlineExclamationCircle /></div>
                            <div className="text-grey-800">
                                Add your tagline or store slogan to make a memorable first impression! A catchy and 
                                distinctive tagline helps communicate your brand identity, captivates customers' attention, and sets you apart from the competition.
                            </div>
                        </div>
                        <Input
                            id='state'
                            name='state'
                            type='textarea'
                            placeholder='Please add a tag line or your store slogan.'
                            rows={5}
                            after="Maximum of 8 words allowed."
                            className='w-100p mt-30 text-12'
                        />

                        <div className="text-right mt-40 flex gap-20 j-content-end">
                            <button className='bg-transparent text-grey-900 py-10 l:py-15 px-10 w-fit radius-5 border-none
                                            hover:pointer text-13 l:text-14 font-inter 
                                            g|transition:0.5s disabled:bg-grey'>
                                Discard
                            </button>
                            <Button theme='primary' children="Save" />
                        </div>
                    </main>
                </div>
            </Modal>

            <Modal isOpen={margettingMessageModal} onClose={() => setMargettingMessageModal(false)} extraClass={{ overflow: 'hidden', width: "1000px" }}>
                <div className="">
                    <header className='flex space-between border-b border-1 border-grey-300 items-center px-35'>
                        <div className='text-16 weight-500 text-green-500 border-b border-3 border-green-500 w-fit p-15'>Edit marketing message</div>
                        <div className='pointer' onClick={() => setMargettingMessageModal(prev => !prev)}><IoMdClose /></div>
                    </header>

                    <main className="p-35">
                        <div className="flex items-center gap-10 bg-light-yellow p-20 radius-8">
                            <div className="text-24"><AiOutlineExclamationCircle /></div>
                            <div className="text-grey-800">
                                Craft and add your unique marketing message to create an impactful first impression! A well-crafted marketing message 
                                effectively conveys your brand identity, captures customers' attention, and differentiates you from competitors. 
                            </div>
                        </div>
                        <Input
                            id='state'
                            name='state'
                            type='textarea'
                            placeholder='Please provide a concise marketing message that effectively promotes your business.'
                            rows={5}
                            after="Maximum of 8 words allowed."
                            className='w-100p mt-30 text-12'
                        />

                        <div className="text-right mt-40 flex gap-20 j-content-end">
                            <button className='bg-transparent text-grey-900 py-10 l:py-15 px-10 w-fit radius-5 border-none
                                            hover:pointer text-13 l:text-14 font-inter 
                                            g|transition:0.5s disabled:bg-grey'>
                                Discard
                            </button>
                            <Button theme='primary' children="Save" />
                        </div>
                    </main>
                </div>
            </Modal>

            <></>
            
        </main>

        <Footer />
    </>
  )
}

export default UpdateStore