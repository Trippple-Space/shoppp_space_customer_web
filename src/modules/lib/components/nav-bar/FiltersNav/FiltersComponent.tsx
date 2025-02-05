import React, { ReactNode, FC, useState } from 'react'
import { LiaAngleDownSolid, LiaStar, LiaTagSolid } from 'react-icons/lia'

const Filters = () => {

    return (
        <div className='flex flex-row j-content-center s:gap-12 gap-8 pb-24'>
            <div className='s:py-8 py-6 s:px-12 px-10 flex flex-row gap-6 a-items-center bg-#F5F5F5 radius-999 w-fit weight-500 s:text-14 text-12 line-height-16.94 cursor-pointer'>
                <LiaTagSolid className='s:w-16 w-14 s:h-16 h-14' />
                <span>Offers</span>
            </div>
            <div className='s:py-8 py-6 s:px-12 px-10 flex flex-row gap-6 a-items-center bg-#F5F5F5 radius-999 w-fit weight-500 s:text-14 text-12 line-height-16.94 cursor-pointer'>
                <LiaStar className='s:w-16 w-14 s:h-16 h-14' />
                <span>Rating</span>
                <LiaAngleDownSolid className='s:w-12 w-10 s:h-12 h-10 mt-2' />
            </div>
            <div className='s:py-8 py-6 s:px-12 px-10 flex flex-row gap-6 a-items-center bg-#F5F5F5 radius-999 w-fit weight-500 s:text-14 text-12 line-height-16.94 cursor-pointer'>
                <span>Price</span>
                <LiaAngleDownSolid className='s:w-12 w-10 s:h-12 h-10 mt-2' />
            </div>
            <div className='s:py-8 py-6 s:px-12 px-10 flex flex-row gap-6 a-items-center bg-#F5F5F5 radius-999 w-fit weight-500 s:text-14 text-12 line-height-16.94 cursor-pointer'>
                <span>Sort</span>
                <LiaAngleDownSolid className='s:w-12 w-10 s:h-12 h-10 mt-2' />
            </div>
        </div>
    )
}

export default Filters
