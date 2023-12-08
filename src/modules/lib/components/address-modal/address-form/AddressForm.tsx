import React from 'react'
import Input from '../../input/Input'
import useAddress from '@/modules/lib/utility/hooks/use-address';
import { cx } from '@/modules/lib/utility/utility';
import InputAlert from '../../input/input-alert/InputAlert';

const AddressForm = () => {
    const { formHandler } = useAddress();
  return (
    <div className='text-16 weight-400 text-grey-700'>
    <form className="form px-20 l:px-35" onSubmit={formHandler.handleSubmit}>
      <div className='grid l:grid-2-cols-auto gap-20 py-20 w-100p'>
        <Input
          label='Address label'
          id='label'
          name='label'
          type='text'
          placeholder='My home address'
          handleChange={formHandler.handleChange}
          handleBlur={formHandler.handleBlur}
          value={formHandler.values.label}
          className='l:my-10'
          inputClass={cx({
            "border-red":
              formHandler.touched.label && formHandler.errors.label,
          })}
          after={
            <InputAlert 
              hasError={!!(formHandler.touched.label && formHandler.errors.label)} 
              errorMessage={formHandler.errors.label?.toString()}
            />
          }
        />

        <Input
          label='Contact number'
          id='contactNo'
          name='contactNo'
          type='text'
          placeholder='080****'
          handleChange={formHandler.handleChange}
          handleBlur={formHandler.handleBlur}
          value={formHandler.values.contactNo}
          className='l:my-10'
          inputClass={cx({
            "border-red":
              formHandler.touched.contactNo && formHandler.errors.contactNo,
          })}
          after={
            <InputAlert 
              hasError={!!(formHandler.touched.contactNo && formHandler.errors.contactNo)} 
              errorMessage={formHandler.errors.contactNo?.toString()}
            />
          }
        />

        <Input
          label='Address'
          id='address'
          name='address'
          type='text'
          placeholder='Enter your house address'
          handleChange={formHandler.handleChange}
          handleBlur={formHandler.handleBlur}
          value={formHandler.values.label}
          className='l:my-10'
          inputClass={cx({
            "border-red":
              formHandler.touched.address && formHandler.errors.address,
          })}
          after={
            <InputAlert 
              hasError={!!(formHandler.touched.address && formHandler.errors.address)} 
              errorMessage={formHandler.errors.address?.toString()}
            />
          }
        />

        <Input
          label='LGA'
          id='city'
          name='city'
          type='text'
          placeholder='Select from dropdowns'
          handleChange={formHandler.handleChange}
          handleBlur={formHandler.handleBlur}
          value={formHandler.values.label}
          className='l:my-10'
          inputClass={cx({
            "border-red":
              formHandler.touched.city && formHandler.errors.city,
          })}
          after={
            <InputAlert 
              hasError={!!(formHandler.touched.city && formHandler.errors.city)} 
              errorMessage={formHandler.errors.city?.toString()}
            />
          }
        />

        <Input
          label='State'
          id='state'
          name='state'
          type='text'
          placeholder='Select from dropdowns'
          handleChange={formHandler.handleChange}
          handleBlur={formHandler.handleBlur}
          value={formHandler.values.label}
          className='l:my-10'
          inputClass={cx({
            "border-red":
              formHandler.touched.state && formHandler.errors.state,
          })}
          after={
            <InputAlert 
              hasError={!!(formHandler.touched.state && formHandler.errors.state)} 
              errorMessage={formHandler.errors.state?.toString()}
            />
          }
        />

        <Input
          label='Description & Notes'
          id='notes'
          name='notes'
          type='textarea'
          placeholder=''
          handleChange={formHandler.handleChange}
          handleBlur={formHandler.handleBlur}
          value={formHandler.values.notes}
          className='l:my-10'
          inputClass={cx({
            "border-red":
              formHandler.touched.notes && formHandler.errors.notes,
          })}
          after={
            <InputAlert 
              hasError={!!(formHandler.touched.notes && formHandler.errors.notes)} 
              errorMessage={formHandler.errors.notes?.toString()}
            />
          }
        />

        <Input
          label='Set as default address'
          id='isDefault'
          name='isDefault'
          type='checkbox'
          placeholder=''
          handleChange={formHandler.handleChange}
          handleBlur={formHandler.handleBlur}
          checked={formHandler.values.isDefault}
          className='l:my-10' 
        />
      </div>

      <div className="w-100p gap-30 pt-10 flex j-content-end text-16">
          <button
            type="button"
            onClick={formHandler.handleReset}
            className="bg-none border-none text-dimgrey pointer"
          >
            Discard
          </button>
          <button
            type="submit"
            className="bg-green border-none radius-5 text-white px-50 l:px-20 py-10 pointer"
            // disabled={!formHandler.isValid || formHandler.isSubmitting}
          >
            {'Save'}
          </button>
        </div>
    </form>
  </div>
  )
}

export default AddressForm