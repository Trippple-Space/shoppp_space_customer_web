import { Order } from '@/modules/lib/utility/types/order.interface'
import OrderProcess from './OrderProcess'
import { useState } from 'react'
import {
  getOrderTimelineStepDate,
  getStatusText,
  onGoingOrderStatus
} from '@/modules/lib/utility/utility'

const OrderProgressDetails = ({
  singleOrder
}: {
  singleOrder: Order
}) => {
  const [viewTimeline, setTimeline] = useState(false)
  const handleViewTimeline = () => {
    setTimeline(prev => !prev)
  }

  const currentStatusIndex = onGoingOrderStatus.indexOf(
    singleOrder.status.toUpperCase()
  )




  return (
    <>
      <div className='py-[20px] px-[15px] bg-white flex flex-col gap-[25px] items-center w-full overflow-hidden'>
        {singleOrder.status.toUpperCase() === 'DELIVERED' ? (
          <>
            <OrderProcess
              text='Order placed'
              date={getOrderTimelineStepDate(singleOrder, 'ONGOING')}
              active={true}
              styles='bottom-[10px] h-0 z-0'
              singleOrder={singleOrder}
            />

            <OrderProcess
              text={'View all timelines'}
              date=''
              active={true}
              singleOrder={singleOrder}
              styles=''
              handleViewTimeline={handleViewTimeline}
              viewTimeline={viewTimeline}
            />

            {viewTimeline && (
              <>
                <OrderProcess
                  text={getStatusText('PENDING_CONFIRMATION')}
                  date={getOrderTimelineStepDate(
                    singleOrder,
                    'PENDING_CONFIRMATION'
                  )}
                  active={singleOrder.status === 'DELIVERED'}
                  singleOrder={singleOrder}
                />
                <OrderProcess
                  text={getStatusText('ACKNOWLEDGED')}
                  date={getOrderTimelineStepDate(singleOrder, 'ACKNOWLEDGED')}
                  active={singleOrder.status === 'DELIVERED'}
                  singleOrder={singleOrder}
                />
                <OrderProcess
                  text={getStatusText('WAITING_TO_BE_SHIPPED')}
                  date={getOrderTimelineStepDate(
                    singleOrder,
                    'WAITING_TO_BE_SHIPPED'
                  )}
                  active={singleOrder.status === 'DELIVERED'}
                  singleOrder={singleOrder}
                />
                <OrderProcess
                  text={getStatusText('OUT_FOR_DELIVERY')}
                  date={getOrderTimelineStepDate(
                    singleOrder,
                    'OUT_FOR_DELIVERY'
                  )}
                  active={singleOrder.status === 'DELIVERED'}
                  singleOrder={singleOrder}
                />
              </>
            )}

            <OrderProcess
              text='Delivered'
              date={getOrderTimelineStepDate(singleOrder, 'DELIVERED')}
              active={true}
              styles='top-0 h-[50px]'
              singleOrder={singleOrder}
            />
          </>
        ) : singleOrder.status === 'CANCELLED' ? (
          <>
            <OrderProcess
              text='Order placed'
              date={getOrderTimelineStepDate(singleOrder, 'ONGOING')}
              active={true}
              styles='bottom-[10px] h-[200px] z-0'
              singleOrder={singleOrder}
            />
            <OrderProcess
              text='Cancelled-Payment Unsuccessful'
              date={
                singleOrder.cancelledAt ??
                singleOrder.updatedAt ??
                getOrderTimelineStepDate(singleOrder, 'ONGOING')
              }
              active={true}
              styles='top-0 h-[60px] bg-[#D4280C] font-semibold overflow'
              singleOrder={singleOrder}
            />
            <div className='bg-[#FFE5E1] w-full px-[10px] py-[20px] rounded-[5px] border border-[2px] border-[#D4280C] font-inter z-[1px]'>
              <p className='text-danger text-[14px] font-normal w-[90%]'>
                {singleOrder?.cancellationReason
                  ? `Reason for cancellation: ${singleOrder?.cancellationReason}`
                  : 'This order has been cancelled'}
              </p>
            </div>
          </>
        ) : (
          <>
            {onGoingOrderStatus.map((status, index) => (
              <OrderProcess
                key={index}
                text={getStatusText(status)}
                date={
                  currentStatusIndex >= 0 && index <= currentStatusIndex
                    ? getOrderTimelineStepDate(singleOrder, status)
                    : ''
                }
                active={index <= currentStatusIndex}
                singleOrder={singleOrder}
                styles={index === 0 ? 'bottom-[1px] z-0' : 'top-0 h-[80px]'}
              />
            ))}
          </>
        )}
      </div>
    </>
  )
}

export default OrderProgressDetails
