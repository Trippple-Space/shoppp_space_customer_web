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
    <label className={cx('border @lo:border-grey-500 @lo:w-24 @lo:h-20 round @lo:bg-whitesmoke @lo:pointer', className)}>
      {checked && <BiCheck className='text-black' />}
      <Input type='checkbox' className='opacity-0 pointer-none' name={name} checked={checked} handleChange={handleChange} />
    </label>
  );
};

export default Checkbox;
