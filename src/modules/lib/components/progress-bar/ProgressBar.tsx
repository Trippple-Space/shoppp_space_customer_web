import React, { CSSProperties, FC } from 'react'

interface IProgressBar {
    percentage: number,
    baseStyle?: CSSProperties,
    barStyle?: CSSProperties,
}
const ProgressBar: FC<IProgressBar> = ({percentage, baseStyle = {}, barStyle}) => {
  return (
    <div className='w-full h-[8px] bg-[#D9D9D9] rounded-[50px]' style={baseStyle}>
        <div  className='bg-brand h-full rounded-[50px] w-0 transition-all duration-500 ' style={{width: `${percentage}%`, ...barStyle}} ></div>
    </div>
  )
}

export default ProgressBar
