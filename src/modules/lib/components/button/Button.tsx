import React, { FC, ReactNode } from 'react';

interface IButton {
  size?: 'large' | 'medium' | 'small';
  theme?: 'primary' | 'secondary' | 'neutral';
  className?: string;
  children: ReactNode;
  type?: 'submit' | 'reset' | 'button';
  disabled?: boolean;
  onClick?: () => void;
}

const Button: FC<IButton> = ({
  children,
  size = 'medium',
  theme = 'primary',
  className,
  type,
  disabled,
  onClick,
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      className={`bg-brand text-white py-[10px] lg:py-[15px] px-[20px] w-fit rounded-[5px] border-none
                    hover:cursor-pointer text-[13px] lg:text-[14px] font-inter 
                hover:bg-brand-hover transition-all duration-500 disabled:bg-[#0357EEcb] disabled:cursor-not-allowed ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
