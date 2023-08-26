import React, { CSSProperties, FC } from 'react'

interface IProgressBar {
    percentage: number,
    baseStyle?: CSSProperties,
    barStyle?: CSSProperties,
}
const ProgressBar: FC<IProgressBar> = ({percentage, baseStyle = {}, barStyle}) => {
  return (
    <div className='w-full h-8 bg-lighter-grey radius-50' style={baseStyle}>
        <div  className='bg-green h-full radius-50 w-0 g|transition:0.5s ' style={{width: `${percentage}%`, ...barStyle}} ></div>
    </div>
  )
}

export default ProgressBar
