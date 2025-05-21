import React, { FC, ReactNode } from 'react'

interface IButton {
    size?: 'large' | 'medium' | 'small'
    theme?: 'primary' | 'secondary' | 'neutral',
    className?: string,
    children: ReactNode,
    type?: 'submit' | 'reset' | 'button'
    disabled?: boolean
}

const Button: FC<IButton> = ({children, size = 'medium', theme = 'primary', className, type, disabled}) => {
  return (
    (<button disabled={disabled} type={type} className={`bg-green text-white py-10 l:py-15 px-20 w-fit radius-5 border-none
                    hover:pointer text-13 l:text-14 font-inter 
                hover:bg-darkgreen g|transition:0.5s disabled:bg-#0b9378cb disabled:cursor-not-allowed ${className}`}>
      {children}
    </button>)
  );
}

export default Button