import { Order } from '@/modules/lib/utility/types/order.interface'
import {
  formatDate,
  isValidTimelineDate,
  parseApiInstant
} from '@/modules/lib/utility/utility'
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
      `w-[20px] h-[20px] rounded-[20px] z-[2px] border border-[3px] border-white  ${
        singleOrder?.status === 'CANCELLED' &&
        text === 'Cancelled-Payment Unsuccessful' &&
        'bg-[#D4280C]'
      }`,
      {
        'bg-brand': active,
        'bg-[#d9d9d9] z-[2px]': !active
      }
    )}
  ></div>
)

// Reusable Progress Line Component
const OrderProgressLine = ({ active, styles = '' }: OrderProgressProps) => (
  <div
    className={classNames(`p-[1px] absolute ${styles}`, {
      'bg-brand z-[1px]': active,
      'bg-[#F3F3F3]': !active
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

  const handleCancelOrder = (id: string , reasons?: string) => {
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
    <div className='w-full h-fit flex gap-[20px] items-center'>
      <div className='relative flex flex-col items-center justify-center gap-[5px]'>
        {isTimelineView ? (
          <>
            <OrderProgressLine
              styles='bottom-[10px] h-[70px] left-[9px]'
              active={active}
              singleOrder={singleOrder}
              text={text}
            />
            <PiDotsThreeOutline className='w-[20px] h-[20px] rounded-[20px] bg-white z-[10px]' />
            <OrderProgressLine styles={styles} active={active} text={text} />
          </>
        ) : singleOrder.status === 'CANCELLED' ? (
          <>
            <OrderProgressLine
              styles='bottom-[1px] h-[70px]'
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
              styles='h-[150px]'
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
          singleOrder.status !== 'CONFIRMED' && 'gap-[10px]'
        }  justify-center`}
      >
        {isTimelineView || text === 'Close timelines' ? (
          <button
            className='px-[10px] py-[7px] bg-white font-normal border border-[2px] border-[#00000026] rounded-[5px] cursor-pointer absolute'
            onClick={handleViewTimeline}
          >
            {viewTimeline ? 'Close all timelines' : text}
          </button>
        ) : text === 'Cancelled-Payment Unsuccessful' &&
          singleOrder.status === 'CANCELLED' ? (
          <>
            <p
              className={classNames(
                'font-semibold font-inter text-[16px] text-danger'
              )}
            >
              {text}
            </p>
            {isValidTimelineDate(date) && (
              <p className={classNames(`text-[12px] text-danger`)}>
                {formatDate(parseApiInstant(date))}
              </p>
            )}
          </>
        ) : (
          <p
            className={classNames('font-semibold font-inter text-[16px]', {
              'text-[#00000066]': !active,
              'text-black': active
            })}
          >
            {text}
          </p>
        )}

        {!isTimelineView &&
          text !== 'Cancelled-Payment Unsuccessful' &&
          isValidTimelineDate(date) && (
            <p
              className={classNames(`text-[12px]`, {
                'text-[#00000066]': !active,
                'text-[#00000099]': active
              })}
            >
              {formatDate(parseApiInstant(date))}
            </p>
          )}

        {singleOrder.status === 'ONGOING' && text === 'Order placed' && (
          <>
            {
              <p
                className='border-b text-danger font-medium w-fit text-[14px] cursor-pointer'
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
                    <div className='lg:w-[400px] p-[20px] flex flex-col gap-[10px]'>
                      <div className='flex items-center justify-end'>
                        <IoMdClose
                          className='w-fit cursor-pointer'
                          onClick={handleOpenCancelOrderModal}
                        />
                      </div>
                      <div className='flex flex-col gap-[20px]'>
                        <p className='font-semibold'>Cancel order</p>
                        <div className='flex flex-col gap-[10px]'>
                          <p className='text-[#6A6A6A] text-[14px]'>
                            Why do you want to cancel this order?
                          </p>

                          <div className='bg-[#F5F5F5] p-[20px] rounded-[5px]'>
                            <RadioGroup
                              options={options}
                              name='reason'
                              selectedValue={selectedReason}
                              onChange={handleSelection}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center justify-end gap-[10px]'>
                        <button
                          className='bg-transparent border border-black px-[20px] py-[7px] rounded-[5px] cursor-pointer bg-brand'
                          onClick={handleOpenCancelOrderModal}
                        >
                          Keep order
                        </button>
                        <button
                          className='border-none px-[20px] py-[8px]  rounded-[5px] bg-[#D4280C] text-white cursor-pointer'
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
