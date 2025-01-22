'use client'
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar'
import OngoingOrder from '@/modules/lib/components/order/OngoingOrder'
import classNames from 'classnames'
import { useState, useEffect } from 'react'
import DeliveredOrder from '@/modules/lib/components/order/DeliveredOrder'
import CancelledOrder from '@/modules/lib/components/order/CancelledOrder'
import OrderHeader from '@/modules/lib/components/order/OrderHeader'
import { GoHome } from 'react-icons/go'
import Link from 'next/link'

const Order = () => {
  const [activeTab, setActiveTab] = useState<string>('ONGOING')

  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab')

    if (savedTab) {
      setActiveTab(savedTab)
    }
  }, [activeTab])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    localStorage.setItem('activeTab', tab)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ONGOING':
        return <OngoingOrder />
      case 'CONFIRMED':
        return <DeliveredOrder />
      case 'CANCELLED':
        return <CancelledOrder />
      default:
        return null
    }
  }

  return (
    <>
      <HomepageNavBar parent={'orders'} />
      <div className='mt-120 w-full flex a-items-center flex-col gap-30'>
        <div className='flex  a-items-center gap-5 l:w-50p w-90p'>
          <GoHome className='w-fit color-#00000066 w-15 h-15' />
          <Link href='/home' className='text-14 color-#00000066'>
            Home /
          </Link>
          <span className='text-14 weight-400'>Orders</span>
        </div>
        <OrderHeader setActiveTab={handleTabChange} activeTab={activeTab} />
        <div className='l:w-50p w-90p flex flex-col gap-50 pb-32'>
          <div className='flex j-content-center'>{renderTabContent()}</div>
        </div>
      </div>
    </>
  )
}

export default Order
