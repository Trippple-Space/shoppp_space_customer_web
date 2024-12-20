import React, { FC } from "react";

interface IBoxRadio {
  id?: string;
  name: string;
  label: React.ReactNode;
  value?: string;
  className?: string;
  checked?: boolean;
  onChange?: () => void;
}

const BoxRadio: FC<IBoxRadio> = ({
  id,
  name,
  value,
  label,
  className,
  checked,
  onChange,
}) => {
  return (
    (<label
      className={`border-solid border-grey-300 g|transition:0.5s pointer hover:border-grey-500 g|:has(:checked)|border-color:#0B9378! ${className === "checkout" ? "p-14 l:g|border-width:2px! border-1 radius-8 w-full" : className === 'address' ? 'border-0 p-0 w-fit' : "border-1 py-25 px-16 radius-5 w-full"
        }`}
    >
      <div className={`flex text-12 content-center ${className === 'checkout' ? 'gap-8 a-items-center' : 'gap-16'}`}>
        <input
          type="radio"
          className="accent-#0B9378 w-20 h-20 border-1 border-red"
          value={value}
          name={name}
          id={id || name}
          checked={checked}
          onChange={onChange}
        />
        {
          className !== 'address' && <div className="h-fit a-self-center w-full">{label}</div>
        }
      </div>
    </label>)
  );
};

export default BoxRadio;
