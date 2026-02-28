import { Order } from '@/modules/lib/utility/types/order.interface'
import OrderProcess from './OrderProcess'
import { useState } from 'react'
import { getStatusText, onGoingOrderStatus } from '@/modules/lib/utility/utility'

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
      <div className='py-20 px-15 bg-white flex flex-col gap-25 a-items-center w-full overflow-hidden'>
        {singleOrder.status.toUpperCase() === 'DELIVERED' ? (
          <>
            <OrderProcess
              text='Order placed'
              date={singleOrder.delivery.deliveryWindowStart}
              active={true}
              styles='b-10 h-0 z-0'
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
                    text='Pending Confirmation'
                    date={singleOrder.delivery.deliveryWindowStart}
                    active={singleOrder.status === 'DELIVERED'}
                    singleOrder={singleOrder}
                  />
                <OrderProcess
                  text='Your order has been recieved'
                  date={singleOrder.delivery.deliveryWindowStart}
                  active={singleOrder.status === 'DELIVERED'}
                  singleOrder={singleOrder}
                />
                <OrderProcess
                  text='waiting to be shipped'
                  date={singleOrder.delivery.deliveryWindowStart}
                  active={singleOrder.status === 'DELIVERED'}
                  singleOrder={singleOrder}
                />
                <OrderProcess
                  text='Out for delivery'
                  date={singleOrder.delivery.deliveryWindowStart}
                  active={singleOrder.status === 'DELIVERED'}
                  singleOrder={singleOrder}
                />
              </>
            )}

            <OrderProcess
              text='Delivered'
              date={singleOrder.delivery.deliveryWindowStart}
              active={true}
              styles='t-0 h-50'
              singleOrder={singleOrder}
            />
          </>
        ) : singleOrder.status === 'CANCELLED' ? (
          <>
            <OrderProcess
              text='Order placed'
              date={singleOrder.delivery.createAt}
              active={true}
              styles='b-10 h-200 z-0'
              singleOrder={singleOrder}
            />
            <OrderProcess
              text='Cancelled-Payment Unsuccessful'
              date={singleOrder.delivery.deliveryWindowStart}
              active={true}
              styles='t-0 h-60 bg-#D4280C weight-600 overflow'
              singleOrder={singleOrder}
            />
            <div className='bg-#FFE5E1 w-100p px-10 py-20 radius-5 border border-2 border-#D4280C font-inter z-1'>
              <p className='text-danger text-14 weight-400 w-90p'>
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
                date={singleOrder.delivery.deliveryWindowStart}
                active={index <= currentStatusIndex}
                singleOrder={singleOrder}
                styles={index === 0 ? 'b-1 z-0' : 't-0 h-80'}
              />
            ))}
          </>
        )}
      </div>
    </>
  )
}

export default OrderProgressDetails
