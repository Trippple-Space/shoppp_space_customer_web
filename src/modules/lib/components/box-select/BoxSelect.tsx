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
    <label className='flex border border-solid border-[#E4E1DF] px-[16px] w-full rounded-[5px] transition-all duration-500 cursor-pointer hover:border-[#A39F9C] has-checked:!border-brand'>
        <div className='flex gap-[16px] text-[12px] content-center'>
            <div className="w-fit h-fit self-center">
              <input type="checkbox" className='accent-[#0357EE] w-[20px] h-[20px] border border-[#DE3838]' value={value} name={name} id={id || name} />
            </div>
            <div className='h-fit self-center '>{label}</div>
        </div>
    </label>
  )
}

export default BoxSelect
