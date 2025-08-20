import React from 'react'
import { PiWarningCircleBold } from 'react-icons/pi'

export default function DeliveryMessage() {
    return (
        <div className='bg-#1677FF flex gap-10 py-8 px-24 text-white weight-700 j-content-center'>
            <PiWarningCircleBold className='w-20 h-20' />
            <p className='text-14 line-height-22'>Deliveries are currently available only in Lagos, Nigeria. Nationwide delivery is coming soon!</p>
        </div>
    )
}
