import React, { FC } from "react";

interface IBoxRadio {
  id?: string;
  name?: string;
  label?: React.ReactNode;
  value?: string;
  className?: string;
  checked?: boolean;
  onChange?: () => void;
  disabled?: boolean
}

const BoxRadio: FC<IBoxRadio> = ({
  id,
  name,
  value,
  label,
  className,
  checked,
  onChange,
  disabled = false
}) => {
  
  return (
    (<label
      className={`border-solid border-[#E4E1DF] transition-all duration-500 ${disabled ? 'not-allowed !bg-[#e4e1df1a]' : 'cursor-pointer hover:border-[#A39F9C]'} has-checked:!border-brand ${className === "checkout" ? "p-[14px] lg:!border-[2px] border rounded-[8px] w-full" : className === 'address' || className === 'filter' ? 'border-0 p-0 w-fit' : "border py-[25px] px-[16px] rounded-[5px] w-full"
        }`}
    >
      <div className={`flex text-[12px] content-center ${className === 'checkout' ? 'gap-[8px] items-center' : className === 'filter' ? 'gap-[12px] items-center' : 'gap-[16px]'}`}>
        <input
          type="radio"
          className="accent-[#0357EE] w-[20px] h-[20px] border border-[#DE3838] outline-none"
          value={value}
          name={name}
          id={id || name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        {
          className !== 'address' && <div className={`h-fit self-center w-full ${className === 'filter' ? 'font-normal text-[16px] leading-[24px]' : ''}`}>{label}</div>
        }
      </div>
    </label>)
  );
};

export default BoxRadio;