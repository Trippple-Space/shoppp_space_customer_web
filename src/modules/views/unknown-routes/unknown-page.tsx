import BaseNavBar from '@/modules/lib/components/nav-bar/BaseNavBar'
import Link from 'next/link'
import React from 'react'

function UnknownPage() {
  return (
    <main className="flex h-100vh a-items-center j-content-center min-h-screen">
      <BaseNavBar links={undefined} parent={undefined} />
      <div className="text-center">
        <img src="/images/images/404.png" alt="" className='l:w-50p l:h-50p ' />
        <h1 className="font-bold ">Oops, nothing to see here 👀</h1>
        <p className="mt-2 text-gray-600">The page you’re looking for doesn’t exist.</p>
       CYNTHIA OFURI GO <Link href="/" className="color-link undderline">HOME</Link>
      </div>
    </main>
  )
}

export default UnknownPage