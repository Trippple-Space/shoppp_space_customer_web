import React, { FC } from 'react'

interface IBoxSelect {
    id?: string,
    name: string, 
    label: any, 
    value?: string,
    className?: string,
}
const BoxSelect: FC<IBoxSelect> = ({id, name, value, label, className}) => {
  return (
    <label className='flex border-1 border-solid border-natural-300 px-16 w-full radius-5 g|transition:0.5s pointer hover:border-natural-500 g|:has(:checked)|border-color:#0B9378!'>
        <div className='flex gap-16 text-12 content-center'>
            <div className="w-fit h-fit a-self-center">
              <input type="checkbox" className='accent-#0B9378 w-20 h-20 border-1 border-red' value={value} name={name} id={id || name} />
            </div>
            <div className='h-fit a-self-center '>{label}</div>
        </div>
    </label>
  )
}

export default BoxSelect
