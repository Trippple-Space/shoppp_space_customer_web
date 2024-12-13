'use client'
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar'
import OngoingOrder from '@/modules/lib/components/order/OngoingOrder'
import { useOrders } from '@/modules/lib/utility/hooks/use-orders'
import classNames from 'classnames'
import { useState } from 'react'
import Image from '@/modules/lib/components/image/Image'
import Link from 'next/link'
import DeliveredOrder from '@/modules/lib/components/order/DeliveredOrder'
import CancelledOrder from '@/modules/lib/components/order/CancelledOrder'
import { useOrderView } from '@/modules/lib/utility/hooks/views/use-order-view'

const Order = () => {
  const { orders } = useOrderView({})
  const [activeTab, setActiveTab] = useState('Ongoing')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Ongoing':
        return <OngoingOrder />
      case 'Delivered':
        return <DeliveredOrder />
      case 'Cancelled/Returned':
        return <CancelledOrder />
      default:
        return null
    }
  }

  return (
    <>
      <HomepageNavBar />
      <div className='mt-150 w-full h-full flex a-items-center flex-col  gap-30'>
        <div className='l:w-50p w-90p flex flex-col gap-50'>
          <div className='flex a-items-center gap-10 bg-#F5F5F5 p-5 radius-6 '>
            <div
              className={classNames('l:w-100p radius-6 cursor-pointer p-10', {
                'bg-white': activeTab === 'Ongoing'
              })}
              onClick={() => setActiveTab('Ongoing')}
            >
              <p
                className={classNames('text-center font-inter text-bold', {
                  'weight-600': activeTab === 'Ongoing'
                })}
              >
                Ongoing
              </p>
            </div>

            <div
              className={classNames(
                'w-100p cursor-pointer cursor-pointer p-10 radius-6',
                {
                  'bg-white': activeTab === 'Delivered'
                }
              )}
              onClick={() => setActiveTab('Delivered')}
            >
              <p
                className={classNames('text-center font-inter', {
                  'weight-600': activeTab === 'Delivered'
                })}
              >
                Delivered
              </p>
            </div>
            <div
              className={classNames(
                'l:w-100p cursor-pointer w-fit p-10 radius-6 overflow-hidden whitespace-nowrap ',
                {
                  'bg-white': activeTab === 'Cancelled/Returned'
                }
              )}
              onClick={() => setActiveTab('Cancelled/Returned')}
            >
              <p
                className={classNames(
                  'text-center font-inter text-16 overflow-hidden text-ellipsis',
                  {
                    'weight-600': activeTab === 'Cancelled/Returned'
                  }
                )}
              >
                <span>Cancelled/Returned</span>
              </p>
            </div>
          </div>
          <div className='flex j-content-center'>{renderTabContent()}</div>
        </div>
      </div>
    </>
  )
}

export default Order
