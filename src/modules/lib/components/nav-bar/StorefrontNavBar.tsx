'use client';

import React from 'react'
import BaseNavBar from './BaseNavBar'
import { BiHomeAlt2 } from "react-icons/bi"

import Link from 'next/link'
import { paths } from '../../utility/paths'
import { usePathname } from 'next/navigation'
import { Store } from '../../utility/types/store.interface';

const StorefrontNavBar = ({store}: {store?: Store}) => {
  const pathname = usePathname()

  return (
    <BaseNavBar 
        links={
            <ul className='w-fit mx-auto hidden l:flex space-between gap-50 weight-400'>
                <li className='flex w-fit gap-10 text-green pointer whitespace-nowrap'> <BiHomeAlt2 className='color-inherit' /> <span>{store?.name}</span> </li>
                <li className='hover:text-green pointer'>Store analytics</li>
                <li className='hover:text-green pointer'>Update store</li>
                {/* <Link href={paths.storefront_about} className='hover:text-green pointer'>About store</Link> */}
            </ul>
        }
    />
  )
}

export default StorefrontNavBar