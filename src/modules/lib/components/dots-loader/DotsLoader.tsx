import React from 'react'
import { motion } from 'framer-motion'

export const DotsLoader = () => {
    return (
        <>
            <div className="flex justify-center w-full py-[10px] gap-[8px] text-[#FACE33] ml-[10px] lg:ml-[15px]">
                <motion.span initial={{ scale: 1 }} animate={{ scale: 1.5 }} transition={{ ease: 'easeInOut', type: 'spring', duration: 0.8, repeat: Infinity }} className='bg-brand w-[5px] h-[5px] rounded-full'></motion.span>
                <motion.span initial={{ scale: 1 }} animate={{ scale: 1.5 }} transition={{ ease: 'easeInOut', delay: 0.2, type: 'spring', duration: 0.8, repeat: Infinity }} className='bg-brand w-[5px] h-[5px] rounded-full'></motion.span>
                <motion.span initial={{ scale: 1 }} animate={{ scale: 1.5 }} transition={{ ease: 'easeInOut', delay: 0.4, type: 'spring', duration: 0.8, repeat: Infinity }} className='bg-brand w-[5px] h-[5px] rounded-full'></motion.span>
            </div>
        </>
    )
}
