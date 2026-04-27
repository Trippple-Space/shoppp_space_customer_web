import React from 'react'
import { PiWarningCircleBold } from 'react-icons/pi'

export default function DeliveryMessage() {
    return (
        <div className='bg-#1677FF flex gap-10 py-8 sm:px-24 px-16 text-white weight-700 j-content-center a-items-center'>
            <PiWarningCircleBold className='w-20 h-20 min-w-15 min-h-15' />
            <p className='text-14 line-height-22'>Deliveries are currently available only in Lagos, Nigeria. Nationwide delivery is coming soon!</p>
        </div>
    )
}
