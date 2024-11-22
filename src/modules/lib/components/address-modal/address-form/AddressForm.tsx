import React, { FC } from 'react'
import useAddress from '@/modules/lib/utility/hooks/use-address';
import { BiCheck } from 'react-icons/bi';
import { IoCloseCircle } from 'react-icons/io5';
import AddressField from './address-field/AddressField';

interface AddressFormProps {
  closeAddressForm: () => void
}
const AddressForm: FC<AddressFormProps> = ({ closeAddressForm }) => {
  const { formHandler } = useAddress();

  return (

    <div className="flex-col w-full">
      <h2 className='text-16 weight-600 mb-10'>NEW ADDRESS</h2>
      <form className='line-height-25 text-13 text-dimgrey opacity-70' onSubmit={formHandler.handleSubmit}>
        <h3 className='text-16 l:text-16 weight-500 text-black mb-5 '>
          <AddressField
            field='label'
            label='Label'
            handler={formHandler}
          />
        </h3>
        <p>
          <AddressField
            field='address'
            label='Address'
            handler={formHandler}
          />
        </p>
        <p>
          <div className="flex gap-5">
            <AddressField
              field='city'
              label='City'
              handler={formHandler}
            />
            <AddressField
              field='state'
              label='State'
              handler={formHandler}
            />
          </div>
        </p>
        <p>
          <AddressField
            field='contactNo'
            label='Contact Number'
            handler={formHandler}
          />

        </p>
        <p className="font-italic text-12">
          <AddressField
            field='notes'
            type='textarea'
            label='Notes'
            handler={formHandler}
          />
        </p>
        <div className='flex flex-col a-items-end a-self-end'>
          <div className='flex gap-8 l:gap-10 w-fit space-between a-self-end mt-10'>
            <button type='reset' className='btn w-50p a-items-center j-items-center l:w-100p border-none bg-grey-100 text-grey-500 hover:bg-red-100 hover:text-red text-13 pr-8 pl-2 py-5 radius-20 weight-400 pointer flex' onClick={() => closeAddressForm()} > <IoCloseCircle className='w-20  mr-3 p-0 ' /> <span>Cancel</span> </button>
            <button type='submit' className='btn w-50p l:w-100p border-none bg-green text-white text-13 pr-8 pl-2 py-5 radius-20 weight-400 pointer flex hover:bg-darkgreen' ><BiCheck className='w-20 text-white' /> <span className=''>Save</span> </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddressForm