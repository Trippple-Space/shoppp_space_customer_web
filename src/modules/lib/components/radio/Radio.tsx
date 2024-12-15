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
    <div className='flex flex-col gap-20'>
      {options.map((option, index) => (
        <div className='' key={index}>
          <label className='flex a-items-center gap-10'>
            <input
              type='radio'
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
                      onChange={e => onChange(e.target.value)}
                      className='radio-accent-color-green'
            />
            <span className='weight-400'>{option.label}</span>
          </label>
        </div>
      ))}
    </div>
  )
}

export default RadioGroup
