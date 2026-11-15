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
      <div className='mt-[120px] w-full flex items-center flex-col gap-[30px]'>
        <div className='flex items-center gap-[5px] lg:w-1/2 w-[90%]'>
          <GoHome className='w-fit text-[#00000066] w-[15px] h-[15px]' />
          <Link href='/home' className='text-[14px] text-[#00000066]'>
            Home /
          </Link>
          <span className='text-[14px] font-normal'>Orders</span>
        </div>
        <OrderHeader  />
        <div className='lg:w-1/2 w-[90%] flex flex-col gap-[50px] pb-[32px]'>
          <div className='flex justify-center'>
            <OrderTabContent status={activeTab} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Order