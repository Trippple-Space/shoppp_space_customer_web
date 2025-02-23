import { Order } from '@/modules/lib/utility/types/order.interface'
import OrderProcess from './OrderProcess'
import { useState } from 'react'

const OrderProgressDetails = ({
  orderCartModal
}: {
  orderCartModal: Order
}) => {
  const [viewTimeline, setTimeline] = useState(false)
  const handleViewTimeline = () => {
    setTimeline(prev => !prev)
  }

  const statusOrder = [
    'ONGOING',
    'PENDING_CONFIRMATION',
    'ACKNOWLEDGED',
    'WAITING_TO_BE_SHIPPED',
    'SHIPPED',
    'DELIVERED'
  ]
  const currentStatusIndex = statusOrder.indexOf(
    orderCartModal.delivery.status.toUpperCase()
  )

  function getStatusText (status: string) {
    switch (status) {
      case 'ONGOING':
        return 'Order placed'
      case 'PENDING_CONFIRMATION':
        return 'Pending Confirmation'
      case 'ACKNOWLEDGED':
        return 'Your order has being received'
      case 'WAITING_TO_BE_SHIPPED':
        return 'Waiting to be shipped'
      case 'OUT_FOR_DELIVERY':
        return 'Out for delivery'
      case 'DELIVERED':
        return 'Delivered'
      default:
        return ''
    }
  }

  return (
    <>
      <div className='py-20 px-15 bg-white flex flex-col gap-25 a-items-center w-full overflow-hidden'>
        {orderCartModal.status.toUpperCase() === 'CONFIRMED' ? (
          <>
            <OrderProcess
              text='Order placed'
              date={orderCartModal.delivery.deliveryWindowStart}
              active={true}
              styles='b-10 h-0 z-0'
              orderCartModal={orderCartModal}
            />

            <OrderProcess
              text={'View all timelines'}
              date=''
              active={true}
              orderCartModal={orderCartModal}
              styles=''
              handleViewTimeline={handleViewTimeline}
              viewTimeline={viewTimeline}
            />

            {viewTimeline && (
              <>
                  <OrderProcess
                    text='Pending Confirmation'
                    date={orderCartModal.delivery.deliveryWindowStart}
                    active={orderCartModal.status === 'CONFIRMED'}
                    orderCartModal={orderCartModal}
                  />
                <OrderProcess
                  text='Your order has been recieved'
                  date={orderCartModal.delivery.deliveryWindowStart}
                  active={orderCartModal.status === 'CONFIRMED'}
                  orderCartModal={orderCartModal}
                />
                <OrderProcess
                  text='waiting to be shipped'
                  date={orderCartModal.delivery.deliveryWindowStart}
                  active={orderCartModal.status === 'CONFIRMED'}
                  orderCartModal={orderCartModal}
                />
                <OrderProcess
                  text='Out for delivery'
                  date={orderCartModal.delivery.deliveryWindowStart}
                  active={orderCartModal.status === 'CONFIRMED'}
                  orderCartModal={orderCartModal}
                />
              </>
            )}

            <OrderProcess
              text='Delivered'
              date={orderCartModal.delivery.deliveryWindowStart}
              active={true}
              styles='t-0 h-50'
              orderCartModal={orderCartModal}
            />
          </>
        ) : orderCartModal.status === 'CANCELLED' ? (
          <>
            <OrderProcess
              text='Order placed'
              date={orderCartModal.delivery.deliveryWindowStart}
              active={true}
              styles='b-10 h-70 z-0'
              orderCartModal={orderCartModal}
            />
            <OrderProcess
              text='Cancelled-Payment Unsuccessful'
              date={orderCartModal.delivery.deliveryWindowStart}
              active={true}
              styles='t-0 h-60 bg-#D4280C weight-600 overflow'
              orderCartModal={orderCartModal}
            />
            <div className='bg-#FFE5E1 w-100p px-10 py-20 radius-5 border border-2 border-#D4280C font-inter z-10'>
              <p className='text-danger text-14 weight-400 w-90p'>
                {orderCartModal?.cancellationReason
                  ? `Reason for cancellation: ${orderCartModal?.cancellationReason}`
                  : 'This order has been cancelled'}
              </p>
            </div>
          </>
        ) : (
          <>
            {statusOrder.map((status, index) => (
              <OrderProcess
                key={status}
                text={getStatusText(status)}
                date={orderCartModal.delivery.deliveryWindowStart}
                active={index <= currentStatusIndex}
                orderCartModal={orderCartModal}
                styles={index === 0 ? 'b-10 h-70 z-0' : 't-0 h-70'}
              />
            ))}
          </>
        )}
      </div>
    </>
  )
}

export default OrderProgressDetails
