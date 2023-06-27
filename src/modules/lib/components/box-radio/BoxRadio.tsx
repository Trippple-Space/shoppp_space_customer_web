import React, { FC } from 'react'

interface IBoxRadio {
    id?: string,
    name: string, 
    label: string, 
    value?: string,
    className?: string,
}
const BoxRadio: FC<IBoxRadio> = ({id, name, value, label, className}) => {
  return (
    <label className='border-1 border-lighter-grey py-25 px-16 w-full radius-5 pointer hover:border-#0B937844 g|:has(:checked)|border-color:#0B9378!'>
        <div className='flex gap-16 text-12 content-center'>
            <input type="radio" className='accent-#0B9378 w-20 h-20 border-1 border-red' value={value} name={name} id={id || name} />
            <span className='h-fit a-self-center '>{label}</span>
        </div>
    </label>
  )
}

export default BoxRadio
