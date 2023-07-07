import React, { FC, ReactNode } from 'react'

interface IButton {
    size?: 'large' | 'medium' | 'small'
    theme?: 'primary' | 'secondary' | 'neutral',
    className?: string,
    children: ReactNode
}

const Button: FC<IButton> = ({children, size = 'medium', theme = 'primary', className}) => {
  return (
    <button className='bg-green text-white py-15 l:py-15 w-117 radius-5 border 
                    hover:pointer text-13 l:text-16
                hover:bg-darkgreen g|transition:0.5s disabled:bg-grey'>
        {children}
    </button>
  )
}

export default Button