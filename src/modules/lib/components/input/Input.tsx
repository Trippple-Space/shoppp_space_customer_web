import React, {
  CSSProperties,
  FC,
  HTMLInputTypeAttribute,
  ReactNode,
  Ref,
  useEffect,
  useState
} from 'react'
import { IconType } from 'react-icons'
import { LuEye, LuEyeOff } from 'react-icons/lu'

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
  handleKeyDown?: Function
  handleFocus?: any
  onCopy?: any
  onPaste?: any
  ref?: Ref<any>
  max?: number
  min?: number
  style?: CSSProperties
}

const Input: React.ForwardRefExoticComponent<Omit<IInput, 'ref'> & React.RefAttributes<any>> = React.forwardRef<any, Omit<IInput, 'ref'>>(({
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
  handleFocus,
  handleKeyDown,
  onCopy,
  onPaste,
  min,
  max,
  style,
}, ref) => {
  const Component = type === 'textarea' ? 'textarea' : 'input'
  const controlProps = {
    [value !== undefined ? 'value' : '']: value,
    [checked !== undefined ? 'checked' : '']: checked,
    [disabled !== undefined ? 'disabled' : '']: disabled,
    [handleChange ? 'onChange' : '']: handleChange,
    [handleBlur ? 'onBlur' : '']: handleBlur,
    [handleFocus ? 'onFocus' : '']: handleFocus,
    [handleKeyDown ? 'onKeyDown' : '']: handleKeyDown,
    [onCopy ? 'onCopy' : '']: onCopy,
    [onPaste ? 'onPaste' : '']: onPaste,
  }
  const [viewPassword, setViewPassword] = useState(false)

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className='block w-fit mb-[8px] lg:font-normal font-medium lg:text-[14px] text-[12px] text-[#59534E]'
        >
          {label}
        </label>
      )}
      <div className='flex items-center relative'>
        <Component
          type={type === 'password' ? (viewPassword ? 'text' : 'password') : type}
          className={`
            block font-inter w-full bg-white
            border-solid border border-[#E4E1DF] lg:py-[17px] py-[12px] px-[20px] lg:text-[16px] font-normal outline-none
            placeholder:text-[#C8C6C3] text-[#6B6662]
            focus:border-brand placeholder:lg:text-[12px] placeholder:text-[12px] disabled:bg-[#F3F3F3] resize-none ${inputClassNames} ${
            id?.toLocaleLowerCase()?.includes('contact')
              ? 'rounded-tr-[8px] rounded-br-[8px] border-l-0'
              : 'rounded-[8px]'
            }`}
          ref={ref}
          placeholder={placeholder}
          rows={rows}
          id={id}
          name={name}
          min={min ?? 0}
          max={max}
          style={style}
          {...controlProps}
        />
        {type === 'password' && (
          <div
            className='absolute  flex right-[10px] items-center justify-center text-right cursor-pointer ml-[10px] h-[30px] bg-inherit w-[30px]'
            onClick={() => setViewPassword(view => !view)}
          >
            {!viewPassword ? <LuEye className='w-[20px] h-[20px]'/>  : <LuEyeOff  className='w-[20px] h-[20px]'/>}
          </div>
        )}
      </div>
      {after}
    </div>
  )
})

export default Input
