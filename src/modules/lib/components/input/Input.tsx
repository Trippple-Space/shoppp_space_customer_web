import React, { FC, HTMLInputTypeAttribute, ReactNode, useState } from 'react'

interface IInput {
  label?: string | ReactNode
  id?: string
  name: string
  type?: HTMLInputTypeAttribute
  placeholder?: string
  className?: string
  after?: any
  inputClass?: any
  rows?: number
  value?: any
  checked?: boolean
  disabled?: boolean
  handleChange?: Function,
  handleBlur?: Function
}
const Input: FC<IInput> = ({ label, id, name, type, placeholder, className, after, rows, inputClass: inputClassNames, value, checked, disabled, handleChange, handleBlur }) => {
  const Component = type === 'textarea' ? 'textarea' : 'input';
  const controlProps = {
    [value !== undefined ? 'value' : '']: value,
    [checked !== undefined ? 'checked' : '']: checked,
    [disabled !== undefined ? 'disabled' : '']: disabled,
    [handleChange ? 'onChange' : '']: handleChange,
    [handleBlur ? 'onBlur' : '']: handleBlur
  }

  return (
    <div className={`input-group ${className}`}>
      {label && <label htmlFor={id} className='block w-fit mb-8 l:weight-400 weight-500 l:text-14 text-12 text-grey-800'>{label}</label>}
      <div className='flex a-items-center'>
        {
          id?.toLocaleLowerCase()?.includes('contact') && (
            <div className='py-12 px-14 bg-#F3F3F3 border @lo:border-grey-300 @lo:radius-t-l-8 @lo:radius-b-l-8 color-#545F71 text-16'>+234</div>
          )
        }
        <Component
          type={type}
          className={`
            block font-inter @lo:w-full @lo:bg-white
            @lo:border-solid @lo:border-1 @lo:border-grey-300 l:@lo:py-17 @lo:py-12 @lo:px-20 @lo:l:text-16 @lo:weight-400 @lo:outline-none
            @lo:placeholder:text-grey-400 @lo:text-grey-700
            @lo:focus:border-green @lo:placeholder:l:text-12 @lo:placeholder:text-12 disabled:bg-#F3F3F3 resize-none ${inputClassNames} ${id?.toLocaleLowerCase()?.includes('contact') ? '@lo:radius-t-r-8 @lo:radius-b-r-8 border-l-0' : '@lo:radius-8'}`
          }
          placeholder={placeholder}
          rows={rows}
          id={id}
          name={name}
          {...controlProps}
        />
      </div>
      {after}
    </div>
  )
}

export default Input
