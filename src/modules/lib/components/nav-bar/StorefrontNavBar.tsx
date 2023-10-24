'use client';

import React from 'react'
import BaseNavBar from './BaseNavBar'
import { BiHomeAlt2 } from "react-icons/bi"

import Link from 'next/link'
import { paths } from '../../utility/paths'
import { usePathname } from 'next/navigation'

const StorefrontNavBar = () => {
  const pathname = usePathname()

  return (
    <BaseNavBar 
        links={
            <ul className='w-fit mx-auto hidden l:flex space-between gap-50 weight-400'>
                <li className='flex w-fit gap-10 hover:text-green pointer'> <BiHomeAlt2 className='color-inherit' /> <span>BiliGram</span> </li>
                <li className='hover:text-green pointer'>Store analytics</li>
                <li className='hover:text-green pointer'>Update store</li>
                <Link href={paths.storefront_about} className='hover:text-green pointer'>About store</Link>
            </ul>
        }
    />
  )
}

export default StorefrontNavBar