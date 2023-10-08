'use client';

import React, { FC } from 'react'
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
            <ul className='w-fit mx-auto hidden l:flex space-between gap-50 weight-500 text-18'>
                <Link href={paths.homepage}  className='flex w-fit gap-10 hover:text-green pointer'>Asoebi</Link>
                <Link href={paths.asoebi_wears} className='hover:text-green pointer pointer relative'>
                  <span>Asoebi wears</span>
                  <div className='bg-yellow py-1 px-4 w-25 h-25 round absolute r--12 t--14'>
                    <TbShoppingBag className='w-15' />
                  </div>
                </Link>
                <li className='hover:text-green pointer'>Explore Stores</li>
            </ul>
        }
    />
  )
}

export default HomepageNavBar