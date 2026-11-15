import React, { FC } from 'react'
import { Address } from '@/modules/lib/utility/types/address.interface'
import useAddress from '@/modules/lib/utility/hooks/use-address'
import { cx } from '@/modules/lib/utility/utility'
import AddressField from '../address-form/address-field/AddressField'
import Checkbox from '../../checkbox/Checkbox'
import { BiCheck, BiTrash } from 'react-icons/bi'
import { PiPencil } from 'react-icons/pi'
import { IoCloseCircle } from 'react-icons/io5'
import { delay } from 'framer-motion'
import BoxRadio from '../../box-radio/BoxRadio'
import AddressForm from '../address-form/AddressForm'

interface AddressCardProps {
  address: Address
  showAddressForm: any
  setShowAddressForm: any
}
const AddressCard: FC<AddressCardProps> = ({
  address,
  showAddressForm,
  setShowAddressForm
}) => {
  const {
    setAddressToUpdateId,
    addressToUpdateId,
    selectedAddressId,
    selectAddress,
    closeAddressModal
  } = useAddress()

  const editMode = addressToUpdateId === address.id
  const isAddressSelected = address.id === selectedAddressId

  return (
    <div
      className={cx(
        'flex flex-row justify-between gap-[12px] items-center w-full p-[16px] rounded-[6px] border border-[#00000014] cursor-pointer',
        {
          'border-brand': isAddressSelected
        }
      )}
      onClick={() => {
        selectAddress(address.id)
        if (!editMode) {
          delay(() => {
            closeAddressModal()
          }, 500)
        }
      }}
    >
      {!editMode && (
        <BoxRadio
          id={`${address.id}`}
          checked={isAddressSelected}
          label=''
          className='address'
          onChange={() => { }}
        />
      )}
      {editMode && showAddressForm ? (
        <>
          <AddressForm
            closeAddressForm={button => {
              if (button === 'cancel') {
                setAddressToUpdateId(null)
              }
            }}
            type={'edit'}
          />
        </>
      ) : (
        <div className='flex justify-between items-center w-full'>
          <div className='flex flex-col gap-[4px] font-normal text-[16px] leading-[24px] text-[#00000099]'>
            <p>
              {address.contactNo}
              {address?.secondaryContactNo && ', '}
              {address?.secondaryContactNo}
            </p>
            <p>
              {address.address}
              {', '}
              {address.city}
              {', '}
              {address.state}
            </p>
            {address.notes && <p>Delivery note: {address.notes}</p>}
            {address.isDefault && (
              <span className='bg-[#D4280C1F] py-[2px] px-[10px] rounded-[4px] text-[#D4280C] font-normal text-[12px] leading-[20px] w-fit'>
                Default
              </span>
            )}
          </div>
          <div className=''>
            <button
              className='border-none cursor-pointer bg-white'
              onClick={e => {
                e.stopPropagation()
                setAddressToUpdateId(address.id)
                setShowAddressForm(true)
              }}
            >
              <span className='text-[#1677FF] text-[16px] font-medium leading-[24px] underline'>
                Edit
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddressCard
