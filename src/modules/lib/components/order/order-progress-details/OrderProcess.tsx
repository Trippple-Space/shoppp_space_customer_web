import { useOrderView } from '@/modules/lib/utility/hooks/views/use-order-view'
import { Order } from '@/modules/lib/utility/types/order.interface'
import { formatDate } from '@/modules/lib/utility/utility'
import classNames from 'classnames'
import { PiDotsThreeOutline } from 'react-icons/pi'

interface OrderProcessProps {
  text: string
  date: string
  active: boolean
  styles?: string
  orderCartModal: Order
  handleViewTimeline?: () => void
  viewTimeline?: boolean
}

interface OrderProgressProps {
  active: boolean
  styles?: string
  text?: string
  orderCartModal?: Order
}

// Reusable Progress Circle Component
const OrderProgressCircle = ({
  active,
  styles,
  text,
  orderCartModal
}: OrderProgressProps) => (
  <div
    className={classNames(
      `w-20 h-20 radius-20 z-10 border border-3 border-white  ${
        orderCartModal?.status === 'CANCELLED' &&
        text === 'Cancelled-Payment Unsuccessful' &&
        'bg-#D4280C'
      }`,
      {
        'bg-green': active,
        'bg-#d9d9d9': !active
      }
    )}
  ></div>
)

// Reusable Progress Line Component
const OrderProgressLine = ({ active, styles = '' }: OrderProgressProps) => (
  <div
    className={classNames(`p-1 absolute ${styles}`, {
      'bg-green': active,
      'bg-#F3F3F3': !active
    })}
  ></div>
)

// Main OrderProcess Component
const OrderProcess = ({
  text,
  date,
  active,
  styles,
  orderCartModal,
  handleViewTimeline,
  viewTimeline
}: OrderProcessProps) => {
  const { cancelOrderById } = useOrderView({})

  const isTimelineView =
    orderCartModal.status === 'CONFIRMED' && text === 'View all timelines'

  const handleCancelOrder = (id: number) => {
    cancelOrderById(id, {})
  }

  return (
    <div className='w-full h-fit flex gap-20 a-items-center'>
      <div className='relative flex flex-col a-items-center j-content-center gap-5'>
        {isTimelineView ? (
          <>
            <OrderProgressLine
              styles='b-10 h-70 l-10'
              active={active}
              orderCartModal={orderCartModal}
              text={text}
            />
            <div className='w-100p h-100p radius-20 z-10 border border-3 border-white flex a-items-center mr-10'>
              <PiDotsThreeOutline className='w-25 h-25 bg-white border border-2 border-white' />
            </div>
            <OrderProgressLine styles={styles} active={active} text={text} />
          </>
        ) : orderCartModal.status === 'CANCELLED' ? (
          <>
            <OrderProgressLine
              styles='b-1 h-70'
              active={active}
              orderCartModal={orderCartModal}
              text={text}
            />
            <OrderProgressCircle
              styles={``}
              active={active}
              orderCartModal={orderCartModal}
              text={text}
            />
            <OrderProgressLine
              styles={`${styles}`}
              active={active}
              orderCartModal={orderCartModal}
              text={text}
            />
          </>
        ) : (
          <>
            <OrderProgressLine
              styles='b-10 h-70'
              active={active}
              orderCartModal={orderCartModal}
              text={text}
            />
            <OrderProgressCircle
              styles=''
              active={active}
              orderCartModal={orderCartModal}
              text={text}
            />
            <OrderProgressLine
              styles={styles}
              active={active}
              orderCartModal={orderCartModal}
              text={text}
            />
          </>
        )}
      </div>

      <div
        className={`flex flex-col ${
          orderCartModal.status !== 'CONFIRMED' && 'gap-10'
        }  j-content-center`}
      >
        {isTimelineView || text === 'Close timelines' ? (
          <button
            className='px-10 py-7 bg-white weight-400 border border-2 border-#00000026 radius-5 cursor-pointer absolute'
            onClick={handleViewTimeline}
          >
            {viewTimeline ? 'Close timeline' : text}
          </button>
        ) : text === 'Cancelled-Payment Unsuccessful' &&
          orderCartModal.status === 'CANCELLED' ? (
          <>
            <p
              className={classNames(
                'weight-600 font-inter text-16 text-danger'
              )}
            >
              {text}
            </p>
            <p className={classNames(`text-12 text-danger`)}>
              {formatDate(new Date(date))}
            </p>
          </>
        ) : (
          <p
            className={classNames('weight-600 font-inter text-16', {
              'color-#00000066': !active,
              'color-black': active
            })}
          >
            {text}
          </p>
        )}

        {!isTimelineView && text !== 'Cancelled-Payment Unsuccessful' && (
          <p
            className={classNames(`text-12`, {
              'color-#00000066': !active,
              'color-#00000099': active
            })}
          >
            {formatDate(new Date(date))}
          </p>
        )}

        {orderCartModal.status === 'ONGOING' && text === 'Order placed' && (
          <p
            className='border-b text-danger weight-500 w-fit text-14 cursor-pointer'
            onClick={() => handleCancelOrder(orderCartModal.id)}
          >
            Cancel order
          </p>
        )}
      </div>
    </div>
  )
}

export default OrderProcess
