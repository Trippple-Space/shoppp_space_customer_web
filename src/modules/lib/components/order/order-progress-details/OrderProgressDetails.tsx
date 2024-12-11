import { Order } from '@/modules/lib/utility/types/order.interface'
import { formatDate } from '@/modules/lib/utility/utility'
import classNames from 'classnames'

const OrderProgressDetails = ({
  orderCartModal
}: {
  orderCartModal: Order
}) => {
  const OrderProcess = ({
    text,
    date,
    active
  }: {
    text: string
    date: string
    active: boolean
  }) => {
    return (
      <>
        <div className='flex a-items-center gap-20 bg-white relative'>
          <div
            className={classNames(
              'h-20 w-20 radius-100 z-100 border border-2 border-white absolute',
              {
                'bg-#0B9378': active,
                'bg-#00000026': !active
              }
            )}
          ></div>
          <div className='absolute t--20 l-9'>
            <div
              className={classNames('p-1 w-2 h-100 absolute', {
                'bg-#0B9378': active,
                'bg-#F3F3F3': !active
              })}
            ></div>
          </div>

          <div className='z-10'>
            <div
              className={classNames(
                'bg-#0B9378 border w-20 h-20 opacity-1 radius-100 border border-2 border-white',
                {
                  'bg-#00000026': active === false
                }
              )}
            ></div>
          </div>
          <div className='flex flex-col gap-10'>
            <p
              className={classNames('weight-600 text-16', {
                'color-#00000066': active === false
              })}
            >
              {text}
            </p>
            <p
              className={classNames('text-12', {
                'color-#00000066': active === false
              })}
            >
              {formatDate(new Date(date))}
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className='bg-white relative px-15 flex'>
        <div className='py-20 flex flex-col gap-30 overflow-hidden'>
          <div className='flex relative'>
            <OrderProcess
              text='Order placed'
              date={orderCartModal.delivery.deliveryWindowStart}
              active={true}
            />
          </div>

          <OrderProcess
            text='Pending Confirmation'
            date={orderCartModal.delivery.deliveryWindowStart}
            active={true}
          />
          <OrderProcess
            text='waiting to be shipped'
            date={orderCartModal.delivery.deliveryWindowStart}
            active={true}
          />
          <OrderProcess
            text='Out for delivery'
            date={orderCartModal.delivery.deliveryWindowStart}
            active={true}
          />
          <OrderProcess
            text='Delivered'
            date={orderCartModal.delivery.deliveryWindowStart}
            active={true}
          />
        </div>
      </div>
    </>
  )
}

export default OrderProgressDetails
