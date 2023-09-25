"use client";

import StorefrontNavBar from "@/modules/lib/components/nav-bar/StorefrontNavBar";
import React, { useState } from "react";
import cx from "classnames";
import Image from "@/modules/lib/components/image/Image";

const tabs = [
    'Awaiting Orders from Store', 'Orders in Transit', 'Out for delivery', 'Delivered'
   ];

const OrderStatus = () => {
    const [activeTab, setActiveTab] = useState(tabs[0]);
    return (
        <div className="border border-1 border-lighter-grey radius-20 py-20">
            <div className="text-20 text-dimgrey px-20 border-b border-1 border-lighter-grey weight-400 opacity-70 flex space-between">
    
                {tabs.map((tab) => (
                    <div
                        onClick={() => setActiveTab(tab)}
                        className={cx(
                          "py-8 px-25 pointer",
                            {
                                "text-black opacity-100 border-b border-3 border-black": tab == activeTab,
                            }
                        )}
                    >
                        {tab}
                    </div>
                ))}
            </div>
            <div className="w-100p px-30 py-10">
            <table className="w-100p" style={{borderCollapse: 'collapse'}}>
                <tr className="w-100p h-60 text-left py-5 border-b border-1 border-lighter-grey">
                    <th className="w-27p border-b border-1 border-lighter-grey pl-20 ">Item</th>
                    <th className="w-27p border-b border-1 border-lighter-grey">Unit/Qty</th>
                    <th className="w-27p border-b border-1 border-lighter-grey">Promotion</th>
                    <th className="w-19p border-b border-1 border-lighter-grey">Date</th>
                </tr>
                {[0,0,,0].map((data: any) => (
                     <tr className="h-90">
                     <td className="border-b border-2 border-lighter-grey">
                         <div className='flex gap-10 items-center'>
                             <div className='w-50 h-50'>
                             <Image
                                 className='w-fit h-100p radius-5'
                                 src='order-product.png'
                                 alt='product'
                                 type='image'
                             />
                             </div>
                             <div className='line-height-25'>
                                 <p className='text-10 weight-500 text-black'>24 Karat Gold Plated...</p>
                                 <h1 className='text-18 text-black weight-500'>NGN 26,000</h1>
                             </div>
                         </div>
                     </td>
                     <td className="text-16 text-dimgrey weight-500 opacity-70 border-b border-2 border-lighter-grey ">1/Bundle</td>
                     <td className="text-16 text-dimgrey weight-500 opacity-70 border-b border-2 border-lighter-grey">none</td>
                     <td className="text-16 text-dimgrey weight-500 opacity-70 border-b border-2 border-lighter-grey">21, May 2023</td>
                 </tr>
                ))}
               
                </table>
            </div>
        </div>

    );
};

export default OrderStatus;
