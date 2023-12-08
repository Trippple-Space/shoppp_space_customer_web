import { cx } from '@/modules/lib/utility/utility'
import React, { FC, HTMLInputTypeAttribute } from 'react'
import AddressField from '../../address-form/address-field/AddressField'
import { Address } from '@/modules/lib/utility/types/address.interface'

interface AddressFieldProps {
    field: keyof Address,
    type?: HTMLInputTypeAttribute
}

const AddressEditField: FC<AddressFieldProps> = ({field, type = 'text'}) => {
    const className=`${field == 'label' ? 'text-16 l:text-20 weight-400 text-black opacity-100' : 'line-height-25 text-13 text-dimgrey opacity-70'}`
  return (
    <AddressField
        // label='Fake label'
        field={field}
        placeholder={field}
        className='l:my-0 w-fit'
        inputClassName={cx('p-0 w-fit border-whitesmoke', className)}
        type={type}
        isEdit
    />
  )
}

export default AddressEditField