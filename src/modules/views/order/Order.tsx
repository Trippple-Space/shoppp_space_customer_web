'use client'
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar'
import OngoingOrder from '@/modules/lib/components/order/OngoingOrder'
import classNames from 'classnames'
import { useState, useEffect } from 'react'
import DeliveredOrder from '@/modules/lib/components/order/DeliveredOrder'
import CancelledOrder from '@/modules/lib/components/order/CancelledOrder'
import OrderHeader from '@/modules/lib/components/order/OrderHeader'

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
      <HomepageNavBar />

      <div className='mt-150 w-full h-full flex a-items-center flex-col gap-30'>
        <OrderHeader setActiveTab={handleTabChange} activeTab={activeTab} />
        <div className='l:w-50p w-90p flex flex-col gap-50'>
          <div className='flex j-content-center'>{renderTabContent()}</div>
        </div>
      </div>
    </>
  )
}

export default Order
