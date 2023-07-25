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

const StorefrontLayout: FC<ILayout> = ({children}) => {
    const [activeTab, setActiveTab] = useState(tabs[0].text);
    return (
        <div>
            <div className="pb-500">
                <div className="relative pb-100">
                    {children}
                </div>

                <div className="app-width">
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
                    <div className="app-width">
                        <FabricsCategoryNav />
                    </div>                
                </div>

                <div className="app-width">
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

export default StorefrontLayout;
