import React, {
  FC,
  HTMLInputTypeAttribute,
  ReactNode,
  useEffect,
  useState
} from 'react'
import { IconType } from 'react-icons'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

interface IInput {
  label?: string | ReactNode
  id?: string
  name?: string
  type?: HTMLInputTypeAttribute
  placeholder?: string
  className?: string
  suffixIcon?: IconType
  after?: any
  inputClass?: any
  rows?: number
  value?: any
  checked?: boolean
  disabled?: boolean
  handleChange?: Function
  handleBlur?: Function
  handleFocus?: any
}
const Input: FC<IInput> = ({
  label,
  id,
  name,
  type,
  placeholder,
  className,
  after,
  rows,
  inputClass: inputClassNames,
  value,
  checked,
  disabled,
  handleChange,
  handleBlur,
  handleFocus
}) => {
  const Component = type === 'textarea' ? 'textarea' : 'input'
  const controlProps = {
    [value !== undefined ? 'value' : '']: value,
    [checked !== undefined ? 'checked' : '']: checked,
    [disabled !== undefined ? 'disabled' : '']: disabled,
    [handleChange ? 'onChange' : '']: handleChange,
    [handleBlur ? 'onBlur' : '']: handleBlur,
    [handleFocus ? 'onFocus' : '']: handleFocus
  }
  const [viewPassword, setViewPassword] = useState(false)

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className='block w-fit mb-8 l:weight-400 weight-500 l:text-14 text-12 text-grey-800'
        >
          {label}
        </label>
      )}
      <div className='flex a-items-center relative'>
        <Component
          type={type === 'password' ? (viewPassword ? 'text' : 'password') : type}
          className={`
            block font-inter @lo:w-full @lo:bg-white
            @lo:border-solid @lo:border-1 @lo:border-grey-300 l:@lo:py-17 @lo:py-12 @lo:px-20 @lo:l:text-16 @lo:weight-400 @lo:outline-none
            @lo:placeholder:text-grey-400 @lo:text-grey-700
            @lo:focus:border-green @lo:placeholder:l:text-12 @lo:placeholder:text-12 disabled:bg-#F3F3F3 resize-none ${inputClassNames} ${
            id?.toLocaleLowerCase()?.includes('contact')
              ? '@lo:radius-t-r-8 @lo:radius-b-r-8 border-l-0'
              : '@lo:radius-8'
          }`}
          placeholder={placeholder}
          rows={rows}
          id={id}
          name={name}
          min={0}
          {...controlProps}
        />
        {type === 'password' && (
          <div
            className='absolute b-0 h-100p r-15 flex a-items-center j-content-center cursor-pointer'
            onClick={() => setViewPassword(view => !view)}
          >
            {!viewPassword ? <FaEye /> : <FaEyeSlash />}
          </div>
        )}
      </div>
      {after}
    </div>
  )
}

export default Input
