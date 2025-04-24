import { Order } from '@/modules/lib/utility/types/order.interface'
import { formatDate } from '@/modules/lib/utility/utility'
import classNames from 'classnames'
import { PiDotsThreeOutline } from 'react-icons/pi'
import Modal from '../../modal/modal'
import { useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import RadioGroup from '../../radio/Radio'
import { useOrders } from '@/modules/lib/utility/hooks/use-orders'

interface OrderProcessProps {
  text: string
  date: string
  active: boolean
  styles?: string
  singleOrder: Order
  handleViewTimeline?: () => void
  viewTimeline?: boolean
}

interface OrderProgressProps {
  active: boolean
  styles?: string
  text?: string
  singleOrder?: Order
}

// Reusable Progress Circle Component
const OrderProgressCircle = ({
  active,
  text,
  singleOrder
}: OrderProgressProps) => (
  <div
    className={classNames(
      `w-20 h-20 radius-20 z-2 border border-3 border-white  ${
        singleOrder?.status === 'CANCELLED' &&
        text === 'Cancelled-Payment Unsuccessful' &&
        'bg-#D4280C'
      }`,
      {
        'bg-green': active,
        'bg-#d9d9d9 z-2': !active
      }
    )}
  ></div>
)

// Reusable Progress Line Component
const OrderProgressLine = ({ active, styles = '' }: OrderProgressProps) => (
  <div
    className={classNames(`p-1 absolute ${styles}`, {
      'bg-green z-1': active,
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
  singleOrder,
  handleViewTimeline,
  viewTimeline
}: OrderProcessProps) => {
  const { cancelOrderById } = useOrders({})
  const [openCancelOrderModal, setOpenCancelOrderModal] = useState(false)
  const [selectedReason, setSelectedReason] = useState<string>('')

  const isTimelineView =
    singleOrder.status === 'DELIVERED' && text === 'View all timelines'

  const handleCancelOrder = (id: number, reasons?: string) => {
    const finalReason = reasons || 'This order has been cancelled'
    cancelOrderById(id, finalReason, {})
  }

  const handleOpenCancelOrderModal = () => {
    setOpenCancelOrderModal(prev => !prev)
    if (openCancelOrderModal) {
      setSelectedReason('')
    }
  }

  const options = [
    { value: 'too-expensive', label: 'Too Expensive' },
    { value: 'wrong-details', label: 'Wrong Details Provided' },
    { value: 'found-another-option', label: 'Found Another Option' },
    { value: 'personal-reason', label: 'Personal Reason' },
    { value: 'other-reasons', label: 'Other reasons' }
  ]

  const handleSelection = (label: string) => {
    setSelectedReason(label)
  }

  return (
    <div className='w-full h-fit flex gap-20 a-items-center'>
      <div className='relative flex flex-col a-items-center j-content-center gap-5'>
        {isTimelineView ? (
          <>
            <OrderProgressLine
              styles='b-10 h-70 l-9'
              active={active}
              singleOrder={singleOrder}
              text={text}
            />
            <PiDotsThreeOutline className='w-20 h-20 radius-20 bg-white z-10' />
            <OrderProgressLine styles={styles} active={active} text={text} />
          </>
        ) : singleOrder.status === 'CANCELLED' ? (
          <>
            <OrderProgressLine
              styles='b-1 h-70'
              active={active}
              singleOrder={singleOrder}
              text={text}
            />
            <OrderProgressCircle
              styles={``}
              active={active}
              singleOrder={singleOrder}
              text={text}
            />
            <OrderProgressLine
              styles={`${styles}`}
              active={active}
              singleOrder={singleOrder}
              text={text}
            />
          </>
        ) : (
          <>
            <OrderProgressLine
              styles='h-150'
              active={active}
              singleOrder={singleOrder}
              text={text}
            />
            
            <OrderProgressCircle
              styles=''
              active={active}
              singleOrder={singleOrder}
              text={text}
            />
            <OrderProgressLine
              styles={styles}
              active={active}
              singleOrder={singleOrder}
              text={text}
            />
          </>
        )}
      </div>

      <div
        className={`flex flex-col ${
          singleOrder.status !== 'CONFIRMED' && 'gap-10'
        }  j-content-center`}
      >
        {isTimelineView || text === 'Close timelines' ? (
          <button
            className='px-10 py-7 bg-white weight-400 border border-2 border-#00000026 radius-5 cursor-pointer absolute'
            onClick={handleViewTimeline}
          >
            {viewTimeline ? 'Close all timelines' : text}
          </button>
        ) : text === 'Cancelled-Payment Unsuccessful' &&
          singleOrder.status === 'CANCELLED' ? (
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

        {singleOrder.status === 'ONGOING' && text === 'Order placed' && (
          <>
            {
              <p
                className='border-b text-danger weight-500 w-fit text-14 cursor-pointer'
                onClick={handleOpenCancelOrderModal}
              >
                Cancel this order
              </p>
            }
            {openCancelOrderModal && (
              <Modal
                onClose={handleOpenCancelOrderModal}
                children={
                  <>
                    <div className='l:w-400 p-20 flex flex-col gap-10'>
                      <div className='flex a-items-center j-content-end'>
                        <IoMdClose
                          className='w-fit cursor-pointer'
                          onClick={handleOpenCancelOrderModal}
                        />
                      </div>
                      <div className='flex flex-col gap-20'>
                        <p className='weight-600'>Cancel order</p>
                        <div className='flex flex-col gap-10'>
                          <p className='color-#6A6A6A text-14'>
                            Why did you want to cancel this order?
                          </p>

                          <div className='bg-#F5F5F5 p-20 radius-5'>
                            <RadioGroup
                              options={options}
                              name='reason'
                              selectedValue={selectedReason}
                              onChange={handleSelection}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='flex a-items-center j-content-end gap-10'>
                        <button
                          className='bg-none border-1 border-black px-20 py-7 radius-5 cursor-pointer bg-green'
                          onClick={handleOpenCancelOrderModal}
                        >
                          Keep order
                        </button>
                        <button
                          className='border-none px-20 py-8  radius-5 bg-#D4280C color-white cursor-pointer'
                          onClick={() =>
                            handleCancelOrder(singleOrder.id, selectedReason)
                          }
                        >
                          Cancel order
                        </button>
                      </div>
                    </div>
                  </>
                }
                isOpen={openCancelOrderModal}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default OrderProcess
