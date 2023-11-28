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
import MiniCart from "../../lib/components/minicart/MiniCart";
import AsoebiHomepage from "./AsoebiPage";
import { usePathname } from "next/navigation";
import AsoebiWears from "./AsoebiWears";
import NoResultMessage from "@/modules/lib/components/error-messages/no-result-found";

const Homepage = () => {
    const pathname = usePathname()
    const isRoute = pathname.includes('homepage')



    return (
        <>
            <div className="">
                <HomepageNavBar />
                <Filters />
                <div className="app-width">
                    {/* <NoResultMessage /> */}

                    {isRoute ? (
                        <AsoebiHomepage />
                    ) : (
                        <AsoebiWears />
                    )}


                </div>
                <Footer />
            </div>
        </>

    );
};

export default Homepage;
