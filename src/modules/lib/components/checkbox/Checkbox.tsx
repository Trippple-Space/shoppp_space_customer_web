"use client"

import React, { FC, useState } from 'react';
import { BiCheck } from 'react-icons/bi';
import Input from '../input/Input';
import { cx } from '../../utility/utility';

interface CheckboxProps {
  name?: string;
  checked?: boolean;
  className?: string;
}

const Checkbox: FC<CheckboxProps> = ({ name = '', checked: checkedFromProp, className }) => {
  const [isChecked, setIsChecked] = useState(checkedFromProp === undefined ? false : checkedFromProp);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (checkedFromProp === undefined) {
      setIsChecked(event?.target?.checked);
    }
  }

  const checked = checkedFromProp === undefined ? isChecked : checkedFromProp

  return (
    <label className={cx('border border-[#A39F9C] w-[24px] h-[20px] rounded-full bg-[#F5F5F5] cursor-pointer', className)}>
      {checked && <BiCheck className='text-black' />}
      <Input type='checkbox' className='opacity-0 pointer-none' name={name} checked={checked} handleChange={handleChange} />
    </label>
  );
};

export default Checkbox;
