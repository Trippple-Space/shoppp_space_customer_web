"use client";

import React, { useEffect } from "react";
import ProductTile from "@/modules/lib/components/product-tile/ProductTile";
import { useTopSalesView } from "@/modules/lib/utility/hooks/views/use-top-sales-view";


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
                <div className="grid l:grid-5-cols-1fr grid-2-cols-1fr gap-10 gap-30 w-full">
                    {
                        products.map(product => (
                            <ProductTile product={product} />
                        ))
                    }
                </div>
            </section>
        </>

    );
};

export default AsoebiWears;
