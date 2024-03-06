"use client";

import BaseNavBar from "@/modules/lib/components/nav-bar/BaseNavBar";
import StorefrontNavBar from "@/modules/lib/components/nav-bar/StorefrontNavBar";
import { BsBasket3 } from "react-icons/bs";
import { LiaCommentsDollarSolid } from "react-icons/lia";
import React, { useState } from "react";
import cx from "classnames";
import FabricsCategoryNav from "@/modules/lib/components/nav-bar/category-nav/FabricsCategoryNav";
import ProductTile from "@/modules/lib/components/product-tile/ProductTile";
import Footer from "@/modules/lib/components/footer/Footer";
import HomepageNavBar from "@/modules/lib/components/nav-bar/HomepageNavBar";
import { TbShoppingBag } from "react-icons/tb"
import { usePathname } from "next/navigation";
import Image from "@/modules/lib/components/image/Image";
import Icon from "@/modules/lib/components/icon/Icon";
import ReviewTile from "@/modules/lib/components/customer-review/CustomerReview";
import Hero from "./wizard/Hero";

const products = [
    {
        images: [
            'https://res.cloudinary.com/codennerd/image/upload/v1689377577/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.25_AM_mghle5.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377577/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.25_AM_1_kxeykx.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377581/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.38_AM_2_y2rd0d.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377581/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.38_AM_1_samhx5.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377581/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.25_AM_1_kxeykx.jpg',
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
            <Hero />
            <div className="app-width">
                <section className="mt-40 w-100p l:mt-90">
                    <div className="flex space-between items-center">
                        <h3 className="text-18 l:text-24 weight-600 text-grey-900 ">TOP SELLING ANKARA</h3>
                        <div className="text-14 l:text-16 weight-500 underline text-grey-900 pointer">View All</div>
                    </div>
                    <div className="grid grid-2-cols-1fr l:grid-5-cols-1fr gap-10 l:gap-30 w-full">
                        {
                            [...products, ...products, ...products, ...products].map(product => (
                                <ProductTile product={product} />
                            ))
                        }
                    </div>
                </section>

                <section className="mt-70 w-100p l:mt-70">
                    <div className="flex space-between items-center">
                        <h3 className="text-16 l:text-24 weight-600 text-grey-900 w-220 l:w-100p g|overflow:hidden g|white-space:nowrap g|text-overflow:ellipsis">SHOP OUR FEATURED ASOEBI WEARS</h3>
                        <div className="text-14 l:text-16 weight-500 underline text-grey-900 pointer whitespace-nowrap">View All</div>
                    </div>
                    <div className="grid grid-2-cols-1fr l:grid-4-cols-1fr gap-10 l:gap-30 w-full">
                        {
                            [...products, ...products, ...products, ...products, ...products, ...products, ...products, ...products].map(product => (
                                <ProductTile product={product} />
                            ))
                        }
                    </div>
                </section>

                <section className="mt-70 w-100p l:mt-70">
                    <div className="flex space-between">
                        <h3 className="text-18 l:text-24 weight-600 text-grey-900">FROM THE CUSTOMER'S PERSPECTIVE</h3>
                    </div>
                    <div className="flex l:w-100p space-between gap-10 l:gap-20 w-full review-tiles">
                        {
                            [...products, ...products, ...products, ...products, ...products].map(product => (
                                <ReviewTile product={product} />
                            ))
                        }
                    </div>
                </section>

            </div>
            <div className="bg-yellow py-40 l:py-60 w-100p mt-50 mb-50">
                <p className="w-100p flex j-content-center text-24 text-center l:text-26 weight-600 text-grey-900">Join Our Asoebi Marketplace and Amplify Your Sales</p>
                <div className="w-100p flex j-content-center pt-30"> <button className='border-none bg-black text-white text-14 py-12 px-20 radius-5 weight-400'>Join Now</button></div>
            </div>
            <Footer />

        </>

    );
};

export default Landingpage;
