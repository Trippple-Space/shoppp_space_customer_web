'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar'
import OrderTabContent from '@/modules/lib/components/order/OrderTabContent'
import OrderHeader from '@/modules/lib/components/order/OrderHeader'
import { GoHome } from 'react-icons/go'
import Link from 'next/link'

const Order = () => {
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab')?.toUpperCase() || 'ONGOING' 

  return (
    <>
      <HomepageNavBar parent='orders' />
      <div className='mt-120 w-full flex a-items-center flex-col gap-30'>
        <div className='flex a-items-center gap-5 l:w-50p w-90p'>
          <GoHome className='w-fit color-#00000066 w-15 h-15' />
          <Link href='/home' className='text-14 color-#00000066'>
            Home /
          </Link>
          <span className='text-14 weight-400'>Orders</span>
        </div>
        <OrderHeader  />
        <div className='l:w-50p w-90p flex flex-col gap-50 pb-32'>
          <div className='flex j-content-center'>
            <OrderTabContent status={activeTab} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Order