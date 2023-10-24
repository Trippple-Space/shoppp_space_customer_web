"use client";

import StorefrontNavBar from "@/modules/lib/components/nav-bar/StorefrontNavBar";
import React, { useState } from "react";
import cx from "classnames";
import Footer from "@/modules/lib/components/footer/Footer";
import { usePathname } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlinePlus } from 'react-icons/ai';
import Input from "@/modules/lib/components/input/Input";
import Image from "@/modules/lib/components/image/Image";
import PromoProductModal from "./promoModal";
import OrderStatus from "./orderStatus";
import Charts from "./storeCharts";



const StoreAnalytics = () => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname()
    const isRoute = pathname.includes('homepage')
    const [createPromo, setCretaePromo] = useState(false)
    const [dropDown, setDropDown] =  useState(false)
    

    const handleOpenModal = () => {
        setOpen(!open);
      };
      const handleCloseModal = () => {
        setOpen(false);
      };

      const handleCreatePromo = () => {
        setCretaePromo(!createPromo);
      }

      const handleDropDown = () => {
        setDropDown(!dropDown)
      }
    return (
        <>
           <StorefrontNavBar />
            <div className="app-width">
                <div className="text-36 weight-700 text-black">Store Overview</div>

                <div className="flex w-100p gap-20 py-20">
                    <div className="w-70p scroll-y pr-20 h-100vh">
                        <div>
                            <Charts />
                        </div>
                        <div className="py-40">
                            <OrderStatus />
                        </div>
                    </div>
                    <div className="w-30p border border-1 border-lighter-grey radius-20 py-20 px-10">
                        <div className="scroll-y h-100vh px-10">
                        <div className="text-30 weight-700 text-black">Promotions</div>
                        

                        {!createPromo ? (
                            <div className="py-10">
                            <button onClick={handleCreatePromo} className='border-none w-100p bg-green flex space-between text-white text-18 l:text-18 py-15 px-20 radius-5 weight-500'>Create New Promotion 
                        <div className="border border-white py-2 px-3 flex a-items-center radius-5" onClick={handleOpenModal}>
                            <AiOutlinePlus className="w-20" />
                        </div>
                        </button></div>
                        ) : (
                            <div className="py-20">
                            <Input
                                label='Promotion Name'
                                id='promotionName'
                                name='promotionName'
                                type='text'
                                placeholder='Enter Promotion Name'
                                className='l:my-10'
                            />

                            <div className="py-20">
                                <p className="text-14">Valid till</p>
                                <div className="flex space-between a-items-center gap-20">
                                    <Input
                                        id='promotionDate'
                                        name='promotionDate'
                                        type='date'
                                        placeholder='Enter Promotion Date'
                                        className='w-60p l:my-10'
                                    />
                                    <div className="notification-btn flex a-items-center gap-10 text-14">
                                        <label className="switch">
                                            <input className="input" type="checkbox" name="" value="" checked={true} />
                                            <span className="slider round"></span>
                                        </label>
                                        <p className="text-black weight-400 text-14">No end</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-24 weight-700 text-dimgrey">Promotion details:</p>
                               <div className="flex space-between py-20">
                                    <div className="w-60p ">
                                        <label htmlFor="">Type</label>
                                        <div className='flex space-between my-5 py-15 px-20 text-15 m:text-20 radius-5  border border-deep-grey'>
                                            <select name="" id="" className='w-100p border-none text-15 m:text-20 text-grey opacity-100 weight-400'>
                                            <option value="">New year sale</option>
                                            <option value="">Black Monday</option>

                                            </select>
                                        </div>
                                    </div>

                                    <div className="w-25p">
                                        <label htmlFor="" className="">Of</label>
                                        <div className="flex a-items-center">
                                            <Input
                                                id='promotionDate'
                                                name='promotionDate'
                                                type='text'
                                                placeholder='10'
                                                className='w-60p my-5'
                                                inputClass='radius-t-r-0 radius-b-r-0'
                                            />
                                            <div className="bg-whitesmoke border border-1 border-deep-grey py-17 px-5 radius-t-r-5 radius-b-r-5">
                                                %
                                            </div>
                                        </div>
                                    </div>
                               </div>
                            </div>

                            <div>
                                <p className="text-18 weight-700 text-grey">Products</p>
                                <div className='flex space-between my-7 py-15 px-20 text-15 m:text-16 radius-5  border border-deep-grey'>
                                    <div className='text-black text-16 weight-400'>Add products</div>
                                    <div className="border border-deep-grey py-2 flex a-items-center radius-5" onClick={handleOpenModal}>
                                        <AiOutlinePlus className="w-20" />
                                    </div>
                            
                                </div>
                                <PromoProductModal modalOpen={open} handleCloseModal={handleCloseModal} data='data' />

                            </div>
                            <div className="gap-20 py-20 flex j-content-end">
                                <button onClick={handleCreatePromo} className='border border-grey bg-white text-dimgrey text-16 py-10 px-20 radius-8 weight-400'>Discard</button>
                                <button className='border-none bg-green text-white text-16 py-10 px-20 radius-5 weight-400'>Save Promotion</button>
                            </div>
                        </div>


                        )}

                        <div className="pt-20 text-24 weight-700 text-dimgrey">Available promotions </div>
                        {[0,0,,0].map((data: any) => (
                             <div className="radius-5 my-20 border border-deep-grey">
                             <div className='flex space-between py-15 px-20 text-15 m:text-16'>
                                 <div className='text-black'>Special Sales <span className="bg-red text-12 ml-15 p-5 radius-50p text-white">15</span></div>
                                 <IoIosArrowDown onClick={handleDropDown} className="w-20 pointer" />
                             </div>
                             {dropDown ? (
                                <div className="px-20">
                                {[0,0,0,0].map((data: any) => (
                                    <div className='l:flex space-between items-center py-10 border-t border-lighter-grey'>
                                        <div className='flex gap-15 items-center'>
                                            <div className='w-80 h-80'>
                                            <Image
                                                className='w-fit h-100p radius-5 l:radius-15'
                                                src='order-product.png'
                                                alt='product'
                                                type='image'
                                            />
                                            </div>
                                            <div className='line-height-30'>
                                                <p className='text-16 text-dimgrey'>Quality Ankara Ga...</p>
                                                <h1 className='text-20 text-black weight-400'>NGN 26,000</h1>
                                            </div>
                                        </div>

                                        <div className='w-100p w-25p'>
                                        <button className='w-100p border border-lighter-grey bg-none text-red text-12 py-8 px-20 radius-5 weight-400'>Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                             ) : ''}
 
 
                         </div>
                        ))}
                        </div>
                      


                    </div>

                    
                </div>
               
            </div>
            <Footer />        

        </>

    );
};

export default StoreAnalytics;
