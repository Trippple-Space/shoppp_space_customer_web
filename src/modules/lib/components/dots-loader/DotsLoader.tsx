import React from 'react'
import { motion } from 'framer-motion'

export const DotsLoader = () => {
    return (
        <>
            <div className="flex j-content-center w-full py-10 gap-8 text-yellow ml-10 l:ml-15">
                <motion.span initial={{ scale: 1 }} animate={{ scale: 2 }} transition={{ ease: 'easeInOut', type: 'spring', duration: 0.8, repeat: Infinity }} className='bg-green w-5 h-5 round'></motion.span>
                <motion.span initial={{ scale: 1 }} animate={{ scale: 2 }} transition={{ ease: 'easeInOut', delay: 0.2, type: 'spring', duration: 0.8, repeat: Infinity }} className='bg-green w-5 h-5 round'></motion.span>
                <motion.span initial={{ scale: 1 }} animate={{ scale: 2 }} transition={{ ease: 'easeInOut', delay: 0.4, type: 'spring', duration: 0.8, repeat: Infinity }} className='bg-green w-5 h-5 round'></motion.span>
            </div>
        </>
    )
}
