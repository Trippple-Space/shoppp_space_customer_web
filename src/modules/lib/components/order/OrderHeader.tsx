import classNames from 'classnames'

const OrderHeader = ({
  setActiveTab,
  activeTab
}: {
  renderTabContent?: () => JSX.Element | null
  setActiveTab?: (tab: string) => void
  activeTab?: string
}) => {
  return (
    <>
      <div className='w-full h-full flex a-items-center flex-col  l:gap-30'>
        <div className='l:w-50p w-90p flex flex-col gap-50'>
          <div className='flex a-items-center gap-10 bg-#F5F5F5 p-5 radius-6 '>
            <div
              className={classNames('w-100p radius-6 cursor-pointer p-10 ', {
                'bg-white': activeTab === 'ONGOING'
              })}
              onClick={() => setActiveTab?.('ONGOING')}
            >
              <p
                className={classNames('text-center font-inter text-bold', {
                  'weight-600': activeTab === 'ONGOING'
                })}
              >
                Ongoing
              </p>
            </div>

            <div
              className={classNames(
                'w-100p cursor-pointer cursor-pointer p-10 radius-6',
                {
                  'bg-white': activeTab === 'CONFIRMED'
                }
              )}
              onClick={() => setActiveTab?.('CONFIRMED')}
            >
              <p
                className={classNames('text-center font-inter', {
                  'weight-600': activeTab === 'CONFIRMED'
                })}
              >
                Delivered
              </p>
            </div>
            <div
              className={classNames(
                'w-100p cursor-pointer p-10 radius-6 overflow-hidden whitespace-nowrap ',
                {
                  'bg-white': activeTab === 'CANCELLED'
                }
              )}
              onClick={() => setActiveTab?.('CANCELLED')}
            >
              <p
                className={classNames(
                  'text-center font-inter text-16 overflow-hidden text-ellipsis',
                  {
                    'weight-600': activeTab === 'CANCELLED'
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
