import FabricsCategoryNav from '@/modules/lib/components/nav-bar/category-nav/FabricsCategoryNav'
import ProductTile from '@/modules/lib/components/product-tile/ProductTile'
import React, { useState } from 'react'
import AddProductModal from './AddProductModal';
import { MdKeyboardArrowUp, MdOutlineKeyboardArrowDown } from 'react-icons/md';
import Footer from '@/modules/lib/components/footer/Footer';
import UpdateProductTile from '@/modules/lib/components/update-product-tile/UpdateProductTile';

const Products = () => {
    // const [activeTab, setActiveTab] = useState(tabs[0]);
    const [selectedImage, setSelectedImage] = useState(false);
    const [toggleSectionProducts, setToggleSectionProducts] = useState(true)

    const productsForModal = [
        'https://res.cloudinary.com/codennerd/image/upload/v1689377577/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.25_AM_mghle5.jpg',
        'https://res.cloudinary.com/codennerd/image/upload/v1689377577/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.25_AM_1_kxeykx.jpg',
        'https://res.cloudinary.com/codennerd/image/upload/v1689377581/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.38_AM_2_y2rd0d.jpg',
        'https://res.cloudinary.com/codennerd/image/upload/v1689377581/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.38_AM_1_samhx5.jpg',
        'https://res.cloudinary.com/codennerd/image/upload/v1689377577/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.25_AM_mghle5.jpg',
    ]

    const products = [
        {
            images: [
                'https://res.cloudinary.com/codennerd/image/upload/v1689377577/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.25_AM_mghle5.jpg',
                'https://res.cloudinary.com/codennerd/image/upload/v1689377577/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.25_AM_1_kxeykx.jpg',
                'https://res.cloudinary.com/codennerd/image/upload/v1689377581/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.38_AM_2_y2rd0d.jpg',
                'https://res.cloudinary.com/codennerd/image/upload/v1689377581/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.38_AM_1_samhx5.jpg',
                'https://res.cloudinary.com/codennerd/image/upload/v1689377577/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.25_AM_mghle5.jpg',
            ]
        },
        {
            images: [
                'https://res.cloudinary.com/codennerd/image/upload/v1689377463/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.07_AM_2_tdqxwf.jpg',
                'https://res.cloudinary.com/codennerd/image/upload/v1689377462/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.04_AM_2_pbukkn.jpg',
                'https://res.cloudinary.com/codennerd/image/upload/v1689377463/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.05_AM_hnms5f.jpg'
            ]
        },
        {
            images: [
                'https://res.cloudinary.com/codennerd/image/upload/v1689377465/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.10_AM_1_lagmdm.jpg',
                'https://res.cloudinary.com/codennerd/image/upload/v1689377465/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.10_AM_ogr4wj.jpg',
                'https://res.cloudinary.com/codennerd/image/upload/v1689377465/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.09_AM_ynbrho.jpg',
                'https://res.cloudinary.com/codennerd/image/upload/v1689377465/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.09_AM_1_cyknhk.jpg',
            ]
        },
        {
            images: [
                'https://res.cloudinary.com/codennerd/image/upload/v1689377466/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.11_AM_1_ke6sjp.jpg',
                'https://res.cloudinary.com/codennerd/image/upload/v1689377466/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.11_AM_ayzcab.jpg',
                'https://res.cloudinary.com/codennerd/image/upload/v1689377462/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.02_AM_wuuypa.jpg',
                'https://res.cloudinary.com/codennerd/image/upload/v1689377462/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.01_AM_guag4i.jpg'
            ]
        },

    ]
    return (
        <>
            <div className=" border-whitesmoke l:mt-68 l:mb-50">
                <div className="">
                    <FabricsCategoryNav />
                </div>
            </div>

            <div className="">
                {/* <div>
                {activeTab.component}
            </div> */}
                <section className="l:mt-55  border-b border-grey-300 pb-40">
                    <div className='l:flex space-between items-center'>
                        <div className="text-20 weight-700 uppercase flex gap-20 items-center pointer" onClick={() => setToggleSectionProducts((prev: any) => !prev)}>
                            <div className="" >New Arrival (24)</div>
                            <div className="text-grey-900 text-30 mt-4">
                                {
                                    toggleSectionProducts ?
                                        <MdOutlineKeyboardArrowDown />
                                        : <MdKeyboardArrowUp />
                                }
                            </div>
                        </div>
                        <div className="relative z-index-2 z-2">
                            <div className="weight-500 text-14 text-red pointer underline" onClick={() => setSelectedImage(true)}>Add  a product to this section</div>
                            {
                                selectedImage &&
                                <AddProductModal
                                    className="t-20"
                                    products={productsForModal}
                                    setSelectedImage={setSelectedImage}
                                />
                            }
                        </div>
                    </div>
                    {
                        toggleSectionProducts &&
                        <div className="l:grid l:grid-4-cols-1fr l:gap-30 w-full">
                            {
                                [...products, ...products].map(product => (
                                    <UpdateProductTile product={product} />
                                ))
                            }
                        </div>
                    }
                </section>

                <section className="mt-40">
                    <div className='l:flex space-between items-center'>
                        <div className="text-20 weight-700 uppercase flex gap-20 items-center pointer">
                            <div className="">New Arrival (24)</div>
                            <div className="text-grey-900 text-30 mt-4">
                                {
                                    !toggleSectionProducts ?
                                        <MdOutlineKeyboardArrowDown />
                                        : <MdKeyboardArrowUp />
                                }
                            </div>
                        </div>
                        <div className="relative">
                            <div className="weight-500 text-14 text-red pointer underline" onClick={() => setSelectedImage(false)}>Add  a product to this section</div>
                            {
                                selectedImage && ''
                                // <AddProductModal 
                                //     className="t-20"
                                //     products={productsForModal}
                                //     setSelectedImage={setSelectedImage}
                                // />
                            }
                        </div>
                    </div>
                    <div className="l:grid l:grid-4-cols-1fr l:gap-30 w-full">
                        {
                            [...products, ...products, ...products, ...products].map(product => (
                                <UpdateProductTile product={product} />
                            ))
                        }
                    </div>
                </section>
            </div>
        </>
    )
}

export default Products