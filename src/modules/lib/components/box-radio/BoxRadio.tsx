import React, { FC } from 'react';

interface IBoxRadio {
  id?: string;
  name: string;
  label: React.ReactNode;
  value?: string;
  className?: string;
  checked?: boolean;
  onChange?: () => void; 
}

const BoxRadio: FC<IBoxRadio> = ({ id, name, value, label, className, checked, onChange }) => {
  return (
    <label className='border-1 border-solid border-grey-300 py-25 px-16 w-full radius-5 g|transition:0.5s pointer hover:border-grey-500 g|:has(:checked)|border-color:#0B9378!'>
      <div className='flex gap-16 text-12 content-center'>
        <input
          type="radio"
          className='accent-#0B9378 w-20 h-20 border-1 border-red'
          value={value}
          name={name}
          id={id || name}
          checked={checked}
          onChange={onChange}
        />
        <div className='h-fit a-self-center w-full'>{label}</div>
      </div>
    </label>
  );
};

export default BoxRadio;
