import React, { FC, ReactNode } from 'react'

interface IButton {
    size?: 'large' | 'medium' | 'small'
    theme?: 'primary' | 'secondary' | 'neutral',
    className?: string,
    children: ReactNode,
    type?: 'submit' | 'reset' | 'button'
}

const Button: FC<IButton> = ({children, size = 'medium', theme = 'primary', className, type}) => {
  return (
    (<button type={type} className={`bg-green text-white py-10 l:py-15 px-20 w-fit radius-5 border-none
                    hover:pointer text-13 l:text-14 font-inter 
                hover:bg-darkgreen g|transition:0.5s disabled:bg-grey ${className}`}>
      {children}
    </button>)
  );
}

export default Button