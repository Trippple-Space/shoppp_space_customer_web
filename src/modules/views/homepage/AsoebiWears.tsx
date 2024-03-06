"use client";

import React from "react";
import ProductTile from "@/modules/lib/components/product-tile/ProductTile";
import { useTopSalesView } from "@/modules/lib/utility/hooks/views/use-top-sales-view";


const AsoebiWears = () => {
    const { products } = useTopSalesView()

    return (
        <>
            <section className="mt-20 w-100p l:mt-50 mb-2000">
                <div className="flex space-between text-20 weight-300 uppercase">
                    <h3 className="text-14 l:text-20 weight-300 uppercase">Top selling fabrics</h3>
                    <p className="text-14 l:text-16 sentence-case">View All</p>
                </div>
                <div className="l:grid grid-5-cols-1fr gap-10 l:gap-30 w-full">
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
