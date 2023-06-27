import React, { FC } from 'react'

interface IProgressBar {
    percentage: number
}
const ProgressBar: FC<IProgressBar> = ({percentage}) => {
  return (
    <div className='w-full h-8 bg-lighter-grey radius-50'>
        <div className='bg-green h-full radius-50 w-0 g|transition:0.5s ' style={{width: `${percentage}%`}} ></div>
    </div>
  )
}

export default ProgressBar
