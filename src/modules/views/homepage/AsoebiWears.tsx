"use client";

import React, { useEffect } from "react";
import ProductTile from "@/modules/lib/components/product-tile/ProductTile";
import { useTopSalesView } from "@/modules/lib/utility/hooks/views/use-top-sales-view";
import ImageAlt from "@/modules/lib/components/image-alt/ImageAlt";


const AsoebiWears = ({selectedCategory}: any) => {
    const { products, handleCategoryChange } = useTopSalesView();
    
    useEffect(() => {
        handleCategoryChange(selectedCategory);
    }, [selectedCategory, products])
    return (
        <>
            <section className="l:mt-20 mt-40 w-100p l:mt-50 mb-2000">
                <div className="flex space-between text-20 weight-300 uppercase">
                    <h3 className="text-14 l:text-20 weight-500 uppercase">Top selling fabrics</h3>
                    <p className="text-14 l:text-16 sentence-case">View All</p>
                </div>
                <div className="grid l:grid-5-cols-1fr grid-2-cols-1fr gap-10 gap-30 w-full relative">
                    {
                        products.length ?
                        products.map(product => (
                            <ProductTile product={product} />
                        ))
                        : (
                            <div className="absolute l-50p mt-60 t-50p g|transform:translate(-50%) bg-white">
                                <img className="l:w-800 l:h-500 w-313 h-200" src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Ftest.study91.co.in%2FScripts%2Fassets%2Fimages%2Fprasad_img%2Fno-product-found.png&f=1&nofb=1&ipt=0c7432910defcbc64af0f5d1c191eb3f1ff0fb98dcb660c70bab9efc47fc5562&ipo=images" />
                            </div>
                        )
                    }
                </div>
            </section>
        </>

    );
};

export default AsoebiWears;
