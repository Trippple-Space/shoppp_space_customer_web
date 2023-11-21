"use client";

import BaseNavBar from "@/modules/lib/components/nav-bar/BaseNavBar";
import StorefrontNavBar from "@/modules/lib/components/nav-bar/StorefrontNavBar";
import { BsBasket3 } from "react-icons/bs";
import { LiaCommentsDollarSolid } from "react-icons/lia";
import React, { FC, useState } from "react";
import cx from "classnames";
import FabricsCategoryNav from "@/modules/lib/components/category-nav/FabricsCategoryNav";
import ProductTile from "@/modules/lib/components/product-tile/ProductTile";
import Footer from "@/modules/lib/components/footer/Footer";
import { ILayout } from "@/app/layout";
import StorefrontReviews from "./StorefrontReviews";

const tabs = [
    {
        icon: BsBasket3,
        text: "Products",
        component: <></>
    },
    {
        icon: LiaCommentsDollarSolid,
        text: "Customer reviews (12,000)",
        component: <StorefrontReviews />
    },
];

const products = [
    {
        media: [
            'https://res.cloudinary.com/codennerd/image/upload/v1689377577/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.25_AM_mghle5.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377577/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.25_AM_1_kxeykx.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377581/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.38_AM_2_y2rd0d.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377581/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.38_AM_1_samhx5.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377577/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.25_AM_mghle5.jpg',
        ]
    }, 
    {
        media: [
            'https://res.cloudinary.com/codennerd/image/upload/v1689377463/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.07_AM_2_tdqxwf.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377462/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.04_AM_2_pbukkn.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377463/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.05_AM_hnms5f.jpg'
        ]
    },
    {
        media: [
            'https://res.cloudinary.com/codennerd/image/upload/v1689377465/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.10_AM_1_lagmdm.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377465/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.10_AM_ogr4wj.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377465/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.09_AM_ynbrho.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377465/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.09_AM_1_cyknhk.jpg',
        ]
    }, 
    {
        media: [
            'https://res.cloudinary.com/codennerd/image/upload/v1689377466/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.11_AM_1_ke6sjp.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377466/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.11_AM_ayzcab.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377462/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.02_AM_wuuypa.jpg',
            'https://res.cloudinary.com/codennerd/image/upload/v1689377462/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.01_AM_guag4i.jpg'
        ]
    },

]

const StorefrontLayout: FC<ILayout> = ({children}) => {
    const [activeTab, setActiveTab] = useState(tabs[0]);
    return (
        <div>
            <div className="pb-100">
                <div className="relative pb-100">
                    {children}
                </div>

                <div className="app-width">
                    <div className="flex gap-70 text-20">
                        {tabs.map((tab) => (
                            <div
                                onClick={() => setActiveTab(tab)}
                                className={cx(
                                    "flex weight-400 w-fit white-space-nowrap hover:text-green pointer gap-15",
                                    {
                                        "text-green": tab.text == activeTab.text,
                                    }
                                )}
                            >
                                <tab.icon /> <span>{tab.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-b border-t border-whitesmoke pt-20 mt-68 mb-50">
                    <div className="app-width">
                        <FabricsCategoryNav />
                    </div>                
                </div>

                <div className="app-width">
                    <div>
                        {activeTab.component}
                    </div>
                    <section className="mt-55">
                        <h3 className="text-20 weight-300 uppercase">New Arrivals</h3>
                        <div className="grid grid-5-cols-1fr gap-30 w-full">
                            {
                                [...products, ...products, ...products, ...products].map(product => (
                                    <ProductTile product={product} /> 
                                ))
                            }
                        </div>
                    </section>
                </div>
            </div>   
            <Footer />         
        </div>

    );
};

export default StorefrontLayout;
