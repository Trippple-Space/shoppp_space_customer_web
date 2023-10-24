import React, { FC } from 'react'
import cx from 'classnames'

interface IInput {
    label?: string
    id?: string
    name: string
    type?: 'text'|'password'|'email'|'textarea'|'date'|'checkbox'
    placeholder?: string
    className?:string
    after?: any
    inputClass?: any
    rows?: number
}
const Input: FC<IInput> = ({label, id, name, type, placeholder, className, after, rows, inputClass}) => {
  const Component = type === 'textarea' ? 'textarea' : 'input';
  return (
    <div className={`input-group ${className}`}>
        {label && <label htmlFor={id} className='block w-fit mb-8 weight-400 text-14 text-natural-800'>{label}</label>}
        <Component 
          type={type} 
          className={`
            block font-inter w-full bg-white
            border-solid border-1 border-natural-300 py-17 px-20  
            radius-8 text-16 weight-400 outline-none
            placeholder:text-natural-700 text-natural-700
            focus:border-green placeholder:l:text-14 ${inputClass}`
          }
          placeholder={placeholder}
          rows={rows}
          id={id} name={name} 
        />
        {after}
    </div>
  )
}

export default Input
