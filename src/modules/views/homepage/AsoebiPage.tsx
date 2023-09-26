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
import Filters from "./FiltersComponent";
import { TbShoppingBag } from "react-icons/tb"
import CarttemModal from "./CartModal";

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
    {
        images: [
            'https://res.cloudinary.com/codennerd/image/upload/v1689377577/WhatsApp_Image_2023-07-15_at_12.23.25_AM_1_kxeykx.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377577/WhatsApp_Image_2023-07-15_at_12.23.25_AM_mghle5.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377581/WhatsApp_Image_2023-07-15_at_12.23.38_AM_2_y2rd0d.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377581/WhatsApp_Image_2023-07-15_at_12.23.38_AM_1_samhx5.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377577/WhatsApp_Image_2023-07-15_at_12.23.25_AM_mghle5.jpg',
        ]
    },
]


const AsoebiHomepage = () => {
    return (
        <>
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

        </>

    );
};

export default AsoebiHomepage;
