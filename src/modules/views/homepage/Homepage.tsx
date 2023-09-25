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
import AsoebiHomepage from "./AsoebiPage";
import { usePathname } from "next/navigation";
import AsoebiWears from "./AsoebiWears";
import NoResultMessage from "@/modules/lib/components/error-messages/no-result-found";

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


const Homepage = () => {
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
            <div className="">
                <HomepageNavBar />
                <Filters />
                <div className="app-width">
                    <NoResultMessage />

                    {isRoute ? (
                        <AsoebiHomepage />
                    ) : (
                        <AsoebiWears />
                    )}
                    

                    <div className="w-100p fixed b-70 r-10">
                        <CarttemModal modalOpen={open} handleCloseModal={handleCloseModal} data='data' />
                        <div onClick={handleOpenModal} className="mx-auto pointer flex w-140 h-50  bg-green p-4 text-white radius-10">
                            <div className="w-40p radius-10 radius-t-r-0 radius-b-r-0 flex items-center j-content-center bg-darkgreen text-white">
                                <TbShoppingBag className="w-25 h-25" />
                            </div>
                            <div className="w-60p text-18 flex text-center items-center j-content-center">
                                0 items
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />        

            </div>
        </>

    );
};

export default Homepage;
