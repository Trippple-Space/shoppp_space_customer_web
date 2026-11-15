'use client'

import classNames from 'classnames'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const OrderHeader = ({ orderStatus }: { orderStatus?: string }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
   const tab = searchParams.get("tab");

  const handleTabChange = (tab: string) => {
    params.set('tab', tab)
    router.push(`/orders?${params.toString()}`, { scroll: false })
    setActiveTab(tab)
  }
  const clickedTab = searchParams.get('tab')?.toUpperCase() || 'ONGOING' 

  const [activeTab, setActiveTab] = useState('')

  useEffect(() => {
    setActiveTab(orderStatus || clickedTab)
  }, [orderStatus, tab])
  
 
  return (
    <>
      <div className='w-full h-fit flex items-center flex-col  lg:gap-[30px]'>
        <div className='lg:w-1/2 w-[90%] flex flex-col gap-[50px]'>
          <div className='flex items-center lg:gap-[10px] bg-[#F5F5F5] p-[5px] rounded-[6px] '>
            <div
              className={classNames('w-full rounded-[6px] cursor-pointer p-[10px] font-normal', {
                'bg-white': activeTab === 'ONGOING'
              })}
              onClick={() => handleTabChange('ONGOING')}
            >
              <p
                className={classNames('text-center font-inter text-bold text-[16px]', {
                  'font-semibold': activeTab === 'ONGOING'
                })}
              >
                Ongoing
              </p>
            </div>

            <div
              className={classNames(
                'w-full cursor-pointer cursor-pointer p-[10px] rounded-[6px] font-normal',
                {
                  'bg-white': activeTab === 'DELIVERED'
                }
              )}
              onClick={() => handleTabChange('DELIVERED')}
            >
              <p
                className={classNames('text-center font-inter text-[16px]', {
                  'font-semibold': activeTab === 'DELIVERED'
                })}
              >
                Delivered
              </p>
            </div>
            <div
              className={classNames(
                'w-full cursor-pointer p-[10px] rounded-[6px] overflow-hidden whitespace-nowrap ',
                {
                  'bg-white': activeTab === 'CANCELLED'
                }
              )}
              onClick={() => handleTabChange('CANCELLED')}
            >
              <p
                className={classNames(
                  'text-center font-inter text-[16px] overflow-hidden text-ellipsis font-normal',
                  {
                    'font-semibold': activeTab === 'CANCELLED'
                  }
                )}
              >
                <span>Cancelled/Returned</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderHeader
