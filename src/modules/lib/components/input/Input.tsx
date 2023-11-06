import React, { FC } from 'react'
import cx from 'classnames'

interface IInput {
  label?: string
  id?: string
  name: string
  type?: 'text' | 'password' | 'email' | 'textarea' | 'date' | 'checkbox'
  placeholder?: string
  className?: string
  after?: any
  inputClass?: any
  rows?: number
  value?: any
  handleChange?: Function,
  handleBlur?: Function
}
const Input: FC<IInput> = ({ label, id, name, type, placeholder, className, after, rows, inputClass: inputClassNames, value, handleChange, handleBlur }) => {
  const Component = type === 'textarea' ? 'textarea' : 'input';
  const controlProps = {
    [value ? 'value' : '']: value,
    [handleChange ? 'onChange' : '']: handleChange,
    [handleBlur ? 'onBlur': '']: handleBlur
  }
  return (
    <div className={`input-group ${className}`}>
      {label && <label htmlFor={id} className='block w-fit mb-8 weight-400 text-14 text-natural-800'>{label}</label>}
      <Component
        type={type}
        className={`
            block font-inter w-full bg-white
            border-solid border-1 @lo:border-natural-300 py-17 px-20  
            radius-8 text-16 weight-400 outline-none
            placeholder:text-natural-700 text-natural-700
            focus:border-green placeholder:l:text-14 ${inputClassNames}`
        }
        placeholder={placeholder}
        rows={rows}
        id={id}
        name={name}
        {...controlProps}
      />
      {after}
    </div>
  )
}

export default Input
