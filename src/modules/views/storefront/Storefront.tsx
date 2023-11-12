"use client";
import StorefrontNavBar from "@/modules/lib/components/nav-bar/StorefrontNavBar";
import React from "react";


const Storefront = () => {
    return (
        <>
            <div className="bg-light-yellow w-full ">
                <StorefrontNavBar />

                <div className="app-width mt-80 pb-100">
                    <div className="">
                        <h2 className="weight-500 text-58 letter-spacing-3 line-height-80 max-w-840">
                            Discover, style, and own Aso Ebi
                        </h2>
                        <p className="text-22 weight-300 g|letter-spacing:1.2px; line-height-38 max-w-700 ">
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
                                            g|background:url(https://res.cloudinary.com/codennerd/image/upload/v1689377463/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.05_AM_hnms5f.jpg);
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
        </>

    );
};

export default Storefront;
