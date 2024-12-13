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

  return (
    <>
      <div className='py-20 px-15 bg-white flex flex-col gap-25 a-items-center w-full overflow-hidden'>
        {orderCartModal.status.toUpperCase() === 'CONFIRMED' ? (
          <>
            <OrderProcess
              text='Order placed'
              date={orderCartModal.delivery.deliveryWindowStart}
              active={true}
              styles='b-10 h-70 z-0'
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
              styles='t-0 h-60 bg-#D4280C overflow'
              orderCartModal={orderCartModal}
            />
            <div className='bg-#FFE5E1 w-100p z-10 px-10 py-20 radius-5 border border-2 border-#D4280C font-inter'>
              <p className='text-danger text-14 w-90p'>
                Unfortunately this item/order has been cancelled because your
                payment could not be completed. If you consider this an error
                and you have been charged, kindly reach out to our support team
                for assistance.
              </p>
            </div>
          </>
        ) : (
          <>
            <OrderProcess
              text='Order placed'
              date={orderCartModal.delivery.deliveryWindowStart}
              active={true}
              styles='b-10 h-70 z-0'
              orderCartModal={orderCartModal}
            />
            <OrderProcess
              text='Pending Confirmation'
              date={orderCartModal.delivery.deliveryWindowStart}
              active={true}
              orderCartModal={orderCartModal}
            />
            <OrderProcess
              text='waiting to be shipped'
              date={orderCartModal.delivery.deliveryWindowStart}
              active={false}
              orderCartModal={orderCartModal}
            />
            <OrderProcess
              text='Out for delivery'
              date={orderCartModal.delivery.deliveryWindowStart}
              active={false}
              orderCartModal={orderCartModal}
            />
            <OrderProcess
              text='Delivered'
              date={orderCartModal.delivery.deliveryWindowStart}
              active={false}
              styles='t-0 h-70'
              orderCartModal={orderCartModal}
            />
          </>
        )}
      </div>
    </>
  )
}

export default OrderProgressDetails
