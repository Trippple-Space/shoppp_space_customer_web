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
        'flex flex-row space-between gap-12 a-items-center w-full p-16 radius-6 border border-#00000014 pointer',
        {
          'border-green-400': isAddressSelected
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
        <div className='flex space-between a-items-center w-full'>
          <div className='flex flex-col gap-4 weight-400 text-16 line-height-24 color-#00000099'>
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
              <span className='bg-#D4280C1F py-2 px-10 radius-4 color-#D4280C weight-400 text-12 line-height-20 w-fit'>
                Default
              </span>
            )}
          </div>
          <div className=''>
            <button
              className='border-none pointer bg-white'
              onClick={e => {
                e.stopPropagation()
                setAddressToUpdateId(address.id)
                setShowAddressForm(true)
              }}
            >
              <span className='color-#1677FF text-16 weight-500 line-height-24 underline'>
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
