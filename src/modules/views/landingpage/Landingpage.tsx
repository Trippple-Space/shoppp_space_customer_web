"use client";

import BaseNavBar from "@/modules/lib/components/nav-bar/BaseNavBar";
import StorefrontNavBar from "@/modules/lib/components/nav-bar/StorefrontNavBar";
import { BsBasket3 } from "react-icons/bs";
import { LiaCommentsDollarSolid } from "react-icons/lia";
import React, { useState } from "react";
import cx from "classnames";
import FabricsCategoryNav from "@/modules/lib/components/category-nav/FabricsCategoryNav";
import ProductTile from "@/modules/lib/components/product-tile/ProductTile";
import Footer from "@/modules/lib/components/footer/Footer";
import HomepageNavBar from "@/modules/lib/components/nav-bar/HomepageNavBar";
import { TbShoppingBag } from "react-icons/tb"
import { usePathname } from "next/navigation";
import Image from "@/modules/lib/components/image/Image";
import Icon from "@/modules/lib/components/icon/Icon";
import ReviewTile from "@/modules/lib/components/customer-review/CustomerReview";

const products = [
    {
        images: [
            'https://res.cloudinary.com/codennerd/image/upload/v1689377577/WhatsApp_Image_2023-07-15_at_12.23.25_AM_mghle5.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377577/WhatsApp_Image_2023-07-15_at_12.23.25_AM_1_kxeykx.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377581/WhatsApp_Image_2023-07-15_at_12.23.38_AM_2_y2rd0d.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377581/WhatsApp_Image_2023-07-15_at_12.23.38_AM_1_samhx5.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377577/WhatsApp_Image_2023-07-15_at_12.23.25_AM_mghle5.jpg',
        ]
    },
]


const Landingpage = () => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname()
    const isRoute = pathname.includes('homepage')
    

    const handleOpenModal = () => {
        setOpen(!open);
      };
      const handleCloseModal = () => {
        setOpen(false);
      };
    return (
        <>
           <HomepageNavBar />
            <div className="bg-offwhitegrey">
                <div className="app-width px-10 pb-30 l:pb-0 l:px-40 flex space-between">
                    <div className="w-100p l:w-50p pt-40 l:pt-80 l:ml-50">
                        <div className="text-black text-38 l:text-64 weight-800 w-100p l:w-75p letter-spacing-6">
                            <div className="bg-white px-20 tilt">
                                <p className="notilt">ELEVATE</p>
                            </div>
                            <div className="px-20 py-7">
                                YOUR
                            </div>
                            <div className="bg-yellow px-20 tilt">
                                <p className="notilt">WARDROBE</p>
                            </div>
                        </div>

                        <div className="text-16 l:text-24 weight-500 text-black py-20">
                            <p>Discover Nigerian Fashion Heritage at Its Finest, Curated by Talented Sellers!</p>
                        </div>
                        <div className="flex gap-30 pt-20">
                            <div><Icon name='Ellipse' className='w-80 h-40 l:w-100 l:h-75' /></div>
                            <div><button className='border-none bg-black text-white text-18 l:text-24 py-10 px-20 radius-5 weight-500'>Get Started</button></div>
                        </div>
                    </div>
                    <div className="relative b-0 hidden l:flex a-items-end">
                        <Image
                        className='w-fit b-0 h-85p'
                        src='landingpage.png'
                        alt='Delivery'
                        />
                    </div>
                </div>
            </div>
            <div className="app-width">
                <section className="mt-20 w-100p l:mt-50">
                    <div className="flex space-between">
                    <h3 className="text-22 l:text-30 weight-700">Top selling ankara</h3>
                    <p className="text-18 l:text-20 weight-600 underline text-black">View All</p>
                    </div>
                    <div className="grid grid-4-cols-1fr gap-10 l:gap-30 w-full">
                        {
                            [...products, ...products, ...products, ...products].map(product => (
                                <ProductTile product={product} /> 
                            ))
                        }
                    </div>
                </section>

                <section className="mt-20 w-100p l:mt-50">
                    <div className="flex space-between">
                    <h3 className="text-22 l:text-30 weight-700">SHOP OUR FEATURED ASOEBI WEARS</h3>
                    <p className="text-18 l:text-20 weight-600 underline text-black">View All</p>
                    </div>
                    <div className="grid grid-4-cols-1fr gap-10 l:gap-30 w-full">
                        {
                            [...products, ...products, ...products, ...products].map(product => (
                                <ProductTile product={product} /> 
                            ))
                        }
                    </div>
                </section>

                <section className="mt-20 w-100p l:mt-50">
                  <div className="flex space-between">
                    <h3 className="text-22 l:text-30 weight-700">SHOP OUR FEATURED ASOEBI WEARS</h3>
                    </div>
                    <div className="grid grid-2-cols-1fr l:grid-4-cols-1fr gap-10 l:gap-30 w-full">
                        {
                            [...products, ...products, ...products, ...products].map(product => (
                                <ReviewTile product={product} /> 
                            ))
                        }
                    </div>
                </section>

            </div>
            <div className="bg-yellow py-40 l:py-60 w-100p mt-50 mb-50">
                <p className="w-100p flex j-content-center text-24 text-center l:text-36 weight-600 text-black">Join Our Asoebi Marketplace and Amplify Your Sales</p>
               <div className="w-100p flex j-content-center pt-30"> <button className='border-none bg-black text-white text-16 py-12 px-20 radius-5 weight-400'>Join Now</button></div>
            </div>
            <Footer />        

        </>

    );
};

export default Landingpage;
