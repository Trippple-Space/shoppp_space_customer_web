import React from 'react'

interface Option {
  value: string
  label: string
}

interface RadioGroupProps {
  options: Option[]
  name: string
  onChange: (value: string) => void
  selectedValue: string
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  name,
  onChange,
  selectedValue
}) => {
  return (
    <div className='flex flex-col gap-[20px]'>
      {options.map((option, index) => (
        <div className='' key={index}>
          <label className='flex items-center gap-[10px]'>
            <input
              type='radio'
              name={name}
              value={option.label}
              checked={selectedValue === option.label}
                      onChange={e => onChange(e.target.value)}
                      className='accent-[#0357EE]'
            />
            <span className='font-normal'>{option.label}</span>
          </label>
        </div>
      ))}
    </div>
  )
}

export default RadioGroup
