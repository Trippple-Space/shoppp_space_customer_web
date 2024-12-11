import React, { FC } from 'react'
import useAddress from '@/modules/lib/utility/hooks/use-address';
import AddressField from './address-field/AddressField';
import AddressMap from '../address-map/AddressMap';
import { SlLocationPin } from 'react-icons/sl';
import { cx } from '@/modules/lib/utility/utility';
import Input from '../../input/Input';

interface AddressFormProps {
  closeAddressForm: () => void
}
const AddressForm: FC<AddressFormProps> = ({ closeAddressForm }) => {
  const { formHandler } = useAddress();

  console.log(formHandler.values)
  return (

    <div className="flex-col w-full">
      <form className='flex flex-col' onSubmit={formHandler.handleSubmit}>
        <div className='flex flex-col p-24 gap-16'>
          <div className='radius-8 h-100 overflow-hidden relative'>
            <AddressMap />
            <div className='absolute bg-#00000073 t-0 b-0 w-full flex flex-col j-content-center'>
              <div className='py-12 px-24 flex a-items-center gap-10 radius-6 bg-#F5F5F5 w-fit mx-auto weight-500 text-16 line-height-22 pointer'>
                <SlLocationPin className='w-24 h-24' />
                <p>Use current location</p>
              </div>
            </div>
          </div>
          <div className='grid grid-4-rows-1fr grid-2-cols-1fr gap-16'>
            <AddressField
              field='firstname'
              label={<span>First name <span className='color-#B3261E'>*</span></span>}
              placeholder='Enter your first name'
              handler={formHandler}
              disabled={false}
            />
            <AddressField
              field='lastname'
              label={<span>Last name <span className='color-#B3261E'>*</span></span>}
              placeholder='Enter your last name'
              handler={formHandler}
              disabled={false}
            />
            <AddressField
              field='state'
              label={<span>State <span className='color-#B3261E'>*</span></span>}
              handler={formHandler}
              disabled={true}
            />
            <AddressField
              field='city'
              label={<span>City <span className='color-#B3261E'>*</span></span>}
              placeholder='Enter city'
              handler={formHandler}
              disabled={false}
            />
            <p className='grid-col-span-2'>
              <AddressField
                field='address'
                label={<span>Street address <span className='color-#B3261E'>*</span></span>}
                placeholder='Enter street address'
                handler={formHandler}
                disabled={false}
              />
            </p>
            <AddressField
              field='contactNo1'
              label={<span>Contact number 1 <span className='color-#B3261E'>*</span></span>}
              placeholder='01245'
              handler={formHandler}
              disabled={false}
            />
            <AddressField
              field='contactNo2'
              label='Contact number 2'
              placeholder='01245'
              handler={formHandler}
              disabled={false}
            />
          </div>
          <p className="">
            <AddressField
              field='notes'
              type='textarea'
              label='Delivery note'
              handler={formHandler}
              disabled={false}
              inputClassName='h-200'
            />
          </p>

          <div className="flex space-between w-full mt-18 @lo:text-grey-700 text-14 l:text-14">
            <label className="pointer content-center flex">
              <Input
                type="checkbox"
                name="isDefault"
                id="isDefault"
                className="accent-#0B9378 w-14 l:w-20 h-14 l:h-20 mr-5 l:mr-10 "
                inputClass="accent-#0B9378 w-14 l:w-20 h-14 l:h-20 mr-5 l:mr-10 "
                checked={formHandler.values.isDefault}
                handleChange={(e: any) => formHandler.setFieldValue("isDefault", e.target.checked)}
              />
              <span className="l:text-16 text-12">Set as default delivery address</span>
            </label>
          </div>
        </div>
        <div className='flex j-content-end a-items-center border-t border-#00000014 py-12 px-24 gap-12'>
          <button type='reset' className='w-fit border-2 border-black text-#000000E0 bg-white hover:bg-red-100 hover:border-red hover:text-red text-14 py-12 px-20 radius-6 weight-500 pointer line-height-19 g|transition:0.5s' onClick={() => closeAddressForm()} >Cancel</button>
          <button type='submit' className='w-fit border-none bg-#0B9378 text-white text-14 py-15 px-20 radius-6 weight-500 pointer hover:bg-darkgreen g|transition:0.5s'>Add address</button>
        </div>
      </form>
    </div>
  )
}

export default AddressForm