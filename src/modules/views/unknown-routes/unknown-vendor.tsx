'use client'

import BaseNavBar from '@/modules/lib/components/nav-bar/BaseNavBar'
import { paths } from '@/modules/lib/utility/paths'
import Link from 'next/link'
import path from 'path'
import React from 'react'

function UnknownVendor() {
  return (
    <main className="flex h-screen items-center justify-center min-h-screen">
      <BaseNavBar links={undefined} parent={undefined} />
      <div className="text-center">
        <img src="/images/images/404.png" alt="" className='lg:w-1/2 lg:h-1/2' />
        <h1 className="font-bold">We could not find the vendor you are are looking for👀</h1>
       However, you can <Link href={paths.vendor_link} className="color-link undderline">own this space</Link>
      </div>
    </main>
  )
}

export default UnknownVendor