'use client'

import BaseNavBar from '@/modules/lib/components/nav-bar/BaseNavBar'
import Link from 'next/link'
import React from 'react'

function UnknownPage() {
  return (
    <main className="flex h-screen items-center justify-center min-h-screen">
      <BaseNavBar links={undefined} parent={undefined} />
      <div className="text-center">
        <img src="/images/images/404.png" alt="" className='lg:w-1/2 lg:h-1/2 ' />
        <h1 className="font-bold ">Oops, nothing to see here 👀</h1>
        <p className="mt-[2px] text-gray-600">The page you’re looking for doesn’t exist.</p>
      GO <Link href="/" className="color-link undderline">HOME</Link>
      </div>
    </main>
  )
}

export default UnknownPage