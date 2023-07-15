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

const tabs = [
    {
        icon: BsBasket3,
        text: "Products",
    },
    {
        icon: LiaCommentsDollarSolid,
        text: "Customer reviews (12,000)",
    },
];

const Storefront = () => {
    const [activeTab, setActiveTab] = useState(tabs[0].text);
    return (
        <div>
            <div className="pb-500">
                <div className="relative pb-100">
                    <div className="bg-light-yellow w-full ">
                        <StorefrontNavBar />

                        <div className="w-90p mx-auto mt-80 pb-100">
                            <div className="">
                                <h2 className="weight-500 text-60 letter-spacing-3 line-height-80 max-w-840">
                                    Discover, style, and own Aso Ebi
                                </h2>
                                <p className="text-24 weight-300 g|letter-spacing:1.2px; line-height-38 max-w-700 ">
                                    Get your occasional wear with our Aso Ebi collection wherever
                                    you are.
                                </p>
                            </div>

                            <div className="mt-55 max-w-600 ">
                                <div className="flex space-between">
                                    {[0, 0, 0, 0, 0].map(() => (
                                        <div className="bg-white w-fit round overflow-hidden border border-2 border-green p-1 ">
                                            <div
                                                className="
                                                    w-90 h-90 bg-white round 
                                                    g|background:url(https://res.cloudinary.com/codennerd/image/upload/v1680366943/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.15_PM_3_jiskuj.jpg);
                                                    bg-cover
                                                    "
                                            ></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="w-450 hidden l:block
                                    g|box-shadow:-2px|_|8px|_|50px|_|4px|_|rgba(0,0,0,0.20)|_|inset; 
                                    bg-light-grey h-591 absolute r-0 b-0 radius-t-l-40 radius-b-l-40
                                    g|background:url(https://res.cloudinary.com/codennerd/image/upload/v1680366944/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.18_PM_wbawin.jpg);
                                    bg-contain border border-5 g|border-color:rgba(217,217,217,0.70); border-r-0 
                                    "
                    ></div>
                </div>

                <div className="w-90p mx-auto">
                    <div className="flex gap-70 text-24">
                        {tabs.map((tab) => (
                            <div
                                onClick={() => setActiveTab(tab.text)}
                                className={cx(
                                    "flex weight-400 w-fit white-space-nowrap hover:text-green pointer gap-15",
                                    {
                                        "text-green": tab.text == activeTab,
                                    }
                                )}
                            >
                                <tab.icon /> <span>{tab.text}</span>
                            </div>
                        ))}
                    </div>

                </div>

                <div className="g|box-shadow:0px|_|2px|_|4px|_|0px|_|rgba(0,0,0,0.05); mt-68 mb-50">
                    <div className="w-90p mx-auto ">
                        <FabricsCategoryNav />
                    </div>                
                </div>

                <div className="w-90p mx-auto">
                    <section className="mt-55">
                        <h3 className="text-30 weight-700">New Arrival</h3>
                        <div>
                            {
                                [0, 0].map(product => (
                                    <ProductTile /> 
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

export default Storefront;
