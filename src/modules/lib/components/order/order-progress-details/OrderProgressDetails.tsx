import { Order } from '@/modules/lib/utility/types/order.interface'
import { formatDate } from '@/modules/lib/utility/utility'
import classNames from 'classnames'

const OrderProgressDetails = ({
  orderCartModal
}: {
  orderCartModal: Order
  }) => {
  
  // const OrderProcess = ({
  //   text,
  //   date,
  //   active
  // }: {
  //   text: string
  //   date: string
  //   active: boolean
  // }) => {
  //   return (
  //     <div className='flex a-items-center gap-20 bg-white'>
  //       <div className='absolute t-0 l-24'>
  //         <div
  //           className={classNames('p-1 w-2 h-300 absolute', {
  //             'bg-#0B9378': active,
  //             'bg-#F3F3F3': !active
  //           })}
  //         >
  //           <div></div>
  //         </div>
  //       </div>

  //       <div className='z-10'>
  //         <div
  //           className={classNames(
  //             'bg-#0B9378 border w-20 h-20 opacity-1 radius-100 border border-2 border-white',
  //             {
  //               'bg-#00000026': active === false
  //             }
  //           )}
  //         ></div>
  //       </div>
  //       <div className='flex flex-col gap-10'>
  //         <p
  //           className={classNames('weight-600 text-16', {
  //             'color-#00000066': active === false
  //           })}
  //         >
  //           {text}
  //         </p>
  //         <p
  //           className={classNames('text-12', {
  //             'color-#00000066': active === false
  //           })}
  //         >
  //           {formatDate(new Date(date))}
  //         </p>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <>
      <div className='bg-white relative px-15 flex'>
        <div className='py-20 flex flex-col gap-30'>
          {/* <OrderProcess
            text='Order placed'
            date={orderCartModal.delivery.deliveryWindowStart}
            active={false}
          /> */}
          {/* <OrderProcess
            text='Pending Confirmation'
            date={orderCartModal.delivery.deliveryWindowStart}
            active={false}
          />
          <OrderProcess
            text='waiting to be shipped'
            date={orderCartModal.delivery.deliveryWindowStart}
            active={false}
          />
          <OrderProcess
            text='Out for delivery'
            date={orderCartModal.delivery.deliveryWindowStart}
            active={false}
          />
          <OrderProcess
            text='Delivered'
            date={orderCartModal.delivery.deliveryWindowStart}
            active={false}
          /> */}
        </div>
      </div>
    </>
  )
}

export default OrderProgressDetails
