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
            <div className="app-width mb-100 mt-90">
                <div className="text-28 weight-700 text-black mt-46">Store Overview</div>

                <div className="l:flex w-100p l:gap-60 py-20 ">
                    <div className="l:w-70p l:pr-20 ">
                        <div>
                            <Charts />
                        </div>
                        <div className="mt-75">
                            <OrderStatus />
                        </div>
                    </div>
                    <div className="l:w-40p border border-1 border-lighter-grey radius-20 py-20 px-10">
                        <div className="px-10">
                        <div className="text-20 weight-700 text-black">Promotions</div>
                        

                        {!createPromo ? (
                            <div className="py-10">
                                <button onClick={handleCreatePromo} className='border-none w-100p bg-green flex space-between text-white text-16 l:text-16 py-12 px-20 radius-5 weight-500'>
                                    Create New Promotion 
                                    <div className="border border-white py-2 px-3 flex a-items-center radius-5" onClick={handleOpenModal}>
                                        <AiOutlinePlus className="w-16" />
                                    </div>
                                </button>
                            </div>

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
                                        {/* <div className="notification-btn flex a-items-center gap-10 text-14">
                                            <label className="switch">
                                                <input className="input" type="checkbox" name="" value="" checked={true} />
                                                <span className="slider round"></span>
                                            </label>
                                            <p className="text-black weight-400 text-14">No end</p>
                                        </div> */}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-18 weight-700 text-dimgrey">Promotion details:</p>
                                    <div className="flex gap-20 py-20">
                                        <div className="w-60p ">
                                            <label htmlFor="" className="text-14 weight-400">Type</label>
                                            <div className='flex space-between my-5 py-15 px-20 text-15 m:text-20 radius-5  border border-grey-300'>
                                                <select name="" id="" className='w-100p border-none text-15 m:text-14 text-grey opacity-100 weight-400 outline-none bg-white'>
                                                    <option value="">New year sale</option>
                                                    <option value="">Black Monday</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="w-40p">
                                            <label htmlFor="" className="text-14 weight-400">Of</label>
                                            <div className="flex items-center">
                                                <Input
                                                    id='promotionDate'
                                                    name='promotionDate'
                                                    type='text'
                                                    placeholder='value'
                                                    className='w-70p my-5 text-14'
                                                    inputClass='radius-t-r-0 radius-b-r-0 h-50'
                                                />
                                                <div className="bg-whitesmoke border border-1 border-grey-300 py-14 px-5  radius-t-r-5 radius-b-r-5">%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-16 weight-700 text-grey">Products</p>
                                    <div className='flex space-between my-7 py-12 px-20 text-15 m:text-16 radius-5 border border-grey-300 pointer' onClick={handleOpenModal}>
                                        <div className='text-grey-700 text-16 weight-400'>Add products</div>
                                        <div className="border border-deep-grey py-2 flex a-items-center radius-5">
                                            <AiOutlinePlus className="w-20" />
                                        </div>
                                    </div>
                                    <PromoProductModal modalOpen={open} handleCloseModal={handleCloseModal} data='data' />

                                </div>
                                <div className="gap-20 py-20 flex j-content-end">
                                    <button onClick={handleCreatePromo} className='border border-grey-300 bg-white text-grey-700 text-14 py-8 px-16 radius-8 weight-400'>Discard</button>
                                    <button className='border-none bg-green text-white text-14 py-8 px-16 radius-5 weight-400'>Save Promotion</button>
                                </div>
                            </div>
                        )}

                        <div className="pt-20 text-18 weight-700 text-dimgrey">Available promotions </div>
                        {[0,0,,0].map((data: any) => (
                            <div className="radius-5 my-20 border border-grey-300">
                                <div className='flex space-between py-15 px-20 text-15 m:text-16 pointer' onClick={handleDropDown}>
                                    <div className='flex items-center'>
                                        <div className="text-grey-900 weight-400">Special Sales</div> 
                                        <div className="relative bg-red w-30 h-30 text-12 ml-15 p-5 radius-50p text-white">
                                            <div className="take-to-center">15</div>
                                        </div>
                                    </div>
                                    <IoIosArrowDown className="w-20 pointer" />
                                </div>
                                {dropDown ? (
                                <div className="px-20">
                                {[0,0].map((data: any) => (
                                    <div className='grid gap-10 l:gap-0 l:flex space-between items-center py-10 border-t border-lighter-grey'>
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
                                                <p className='text-14 text-grey-700'>Quality Ankara Ga...</p>
                                                <h1 className='text-16 text-grey-900 weight-400'>NGN 26,000</h1>
                                            </div>
                                        </div>

                                        <div className='w-100p w-20p'>
                                            <button className='l:w-100p border border-lighter-grey bg-none text-red weight-400 text-12 py-8 px-20 radius-5 weight-400'>Remove</button>
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
