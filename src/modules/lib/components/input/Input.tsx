import React, { FC } from 'react'
import cx from 'classnames'

interface IInput {
    label?: string,
    id?: string,
    name: string,
    type?: 'text'|'password'|'email',
    placeholder?: string,
    className?:string
    after?: any
}
const Input: FC<IInput> = ({label, id, name, type, placeholder, className, after}) => {
  return (
    <div className={`input-group ${className}`}>
        {label && <label htmlFor={id} className='block w-fit mb-14 weight-400 text-14 text-grey'>{label}</label>}
        <input 
        type={type} 
        className={`block font-roboto w-full bg-white border-1 
                    border-lighter-grey py-17 px-20 
                    radius-8 text-16 weight-400 outline-none
                    placeholder:text-faint-grey text-grey
                    focus:border-green`}
        placeholder={placeholder}
        id={id} name={name} 
        />
        {after}
    </div>
  )
}

export default Input
