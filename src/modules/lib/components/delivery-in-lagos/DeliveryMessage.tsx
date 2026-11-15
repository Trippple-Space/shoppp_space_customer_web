import React from 'react'
import { PiWarningCircleBold } from 'react-icons/pi'

export default function DeliveryMessage() {
    return (
        <div className='bg-[#1677FF] flex gap-[10px] py-[8px] sm:px-[24px] px-[16px] text-white font-bold justify-center items-center'>
            <PiWarningCircleBold className='w-[20px] h-[20px] min-w-[15px] min-h-[15px]' />
            <p className='text-[14px] leading-[22px]'>Deliveries are currently available only in Lagos, Nigeria. Nationwide delivery is coming soon!</p>
        </div>
    )
}
