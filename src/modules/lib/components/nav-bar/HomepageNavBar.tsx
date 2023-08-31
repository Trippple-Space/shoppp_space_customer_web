'use client';

import React from 'react'
import BaseNavBar from './BaseNavBar'
import { TbShoppingBag } from "react-icons/tb"
import Link from 'next/link'
import { paths } from '../../utility/paths'
import { usePathname } from 'next/navigation'

const HomepageNavBar = () => {
  const pathname = usePathname()

  return (
    <BaseNavBar 
        links={
            <ul className='w-fit mx-auto hidden l:flex space-between gap-50 weight-500 text-20'>
                <li className='flex w-fit gap-10 text-green pointer'>Asoebi</li>
                <li className='hover:text-green pointer relative'>Asoebi wears<div  className='bg-yellow py-1 px-4 round absolute r--12 t--14'><TbShoppingBag className='w-15'/></div></li>
                <li className='hover:text-green pointer'>Explore Stores</li>
            </ul>
        }
    />
  )
}

export default HomepageNavBar