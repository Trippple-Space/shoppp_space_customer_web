import React, { FC, useEffect, useRef, useState } from 'react'
import useAddress from '@/modules/lib/utility/hooks/use-address';
import AddressField from './address-field/AddressField';
import Input from '../../input/Input';

import AddressMap from '../address-map/AddressMap';
import UseCurrentLocationButton from '../address-map/UseCurrentLocationButton';
import { toast } from 'sonner';
import axios from 'axios';

interface AddressFormProps {
  closeAddressForm: (button: any) => void
  type: any
}

interface Suggestions {
  display_name: string
  lon: string
  lat: string
  address: {
    name: string,
    county: string,
    city: string,
    state: string,
    postcode: string,
    country: string,
    country_code: string
  }
}

const AddressForm: FC<AddressFormProps> = ({ closeAddressForm, type }) => {
  const { formHandler, updateFormHandler, } = useAddress();
  const [userLocation, setUserLocation] = useState<any>({})
  const [disableButton, setDisableButton] = useState(true)
  const [suggestionInputValue, setSuggestionInputValue] = useState<string>('')
  const [addressSuggestions, setAddressSuggestions] = useState<Suggestions[]>([])
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  const selectRef = useRef<HTMLDivElement>(null);

  const formhandler = (type === 'edit') ? updateFormHandler : formHandler

  const locationiqApiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API;

  useEffect(() => {
    const emptyFields = Object.entries(formhandler.values).every(
      ([key, value]) =>
        (key === "label" || key === "state") || value === "" || value === false
    );
    const errorsCheck = () => {
      return Object.keys(formhandler.errors).length !== 0
    }
    if (!errorsCheck() && !emptyFields) {
      setDisableButton(false)
    } else {
      setDisableButton(true)
    }
  }, [formhandler.values, formhandler.errors])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    };

    if (showSuggestions) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.body.style.overflow = 'auto'
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions]);

  const autoCompleteAddress = async (inputValue: string) => {
    const encodedValue = encodeURIComponent(inputValue)
    setSuggestionInputValue(inputValue)

    try {
      if (inputValue.length > 2) {
        setShowSuggestions(true)
        const response = await axios.get(
          `https://api.locationiq.com/v1/autocomplete?key=${locationiqApiKey}&q=${encodedValue}&limit=10&countrycodes=ng&dedupe=1&`
        );
        setAddressSuggestions(response.data)
        setShowSuggestions(true)
      } else {
        setShowSuggestions(false)
      }
    } catch (err: any) {
      toast.error(err.response.data.error, { duration: 2000 });
    }
  }

  const handleSelectAddress = (suggestion: Suggestions) => {
    if (suggestion.address.state.toLowerCase().includes("lagos")) {
      const latitude = suggestion.lat
      const longitude = suggestion.lon

      setSuggestionInputValue(suggestion.display_name)
      setShowSuggestions(false)
      setUserLocation({ latitude, longitude })
      formhandler.setFieldValue("address", suggestion?.address?.name || '');
      formhandler.setFieldValue("city", suggestion?.address?.county || suggestion?.address?.city || '');
      //formhandler.setFieldValue("state", suggestion?.address?.state || '');
      formhandler.setFieldValue('meta', { 'location': { latitude, longitude } })
    } else {
      toast.error("Location must be within Lagos, Nigeria", {
        duration: 2000,
      });
    }
  }

  return (
    (<div className="flex-col w-full">
      <form className='flex flex-col' onSubmit={formhandler.handleSubmit}>
        <div className='flex flex-col p-24 mt--24 mx--24 gap-16'>
          <div className={`radius-8 overflow-hidden relative h-100`}>
            <AddressMap location={{ lat: userLocation.latitude || 6.5480282, lng: userLocation.longitude || 3.1191456 }} />
            <div className='absolute bg-#00000073 t-0 b-0 w-full flex flex-col j-content-center'>
              <UseCurrentLocationButton formhandler={formhandler} setUserLocation={setUserLocation} setSuggestionInputValue={setSuggestionInputValue} />
            </div>
          </div>
          <div className='grid sm:grid-4-rows-1fr grid-2-cols-1fr gap-16'>
            <div className='sm:grid-col-span-1 grid-col-span-2'>
              <AddressField
                field='firstName'
                label={<span>First name <span className='color-#B3261E'>*</span></span>}
                placeholder='Enter your first name'
                handler={formhandler}
                disabled={false}
              />
            </div>
            <div className='sm:grid-col-span-1 grid-col-span-2'>
              <AddressField
                field='lastName'
                label={<span>Last name <span className='color-#B3261E'>*</span></span>}
                placeholder='Enter your last name'
                handler={formhandler}
                disabled={false}
              />
            </div>
            <div className='grid-col-span-2' ref={selectRef}>
              <Input
                label={<span className={`text-14 weight-400 line-height-19`}>Search Address</span>}
                id={'searchAddress'}
                name={'searchAddress'}
                type={"text"}
                value={suggestionInputValue}
                placeholder={'Start typing an address..'}
                handleChange={(e: any) => {
                  autoCompleteAddress(e.target.value);
                }}
                handleFocus={() => { }}
                className={'w-full'}
                inputClass="radius-6! p-12 w-full border-#6A6A6A4D text-16"
              />
              <div className='relative'>
                {
                  showSuggestions &&
                  <div className='absolute w-full bg-white border border-black z-10 top-0 mt-3 radius-6! border-#6A6A6A4D text-16 overflow-hidden h-fit g|max-height:182px overflow-auto'>
                    {
                      addressSuggestions.length === 0 ?
                        <div className='py-8 px-12 flex a-items-center j-content-center w-full text-center'>no address found</div>
                        :
                        <div className='flex flex-col'>
                          {
                            addressSuggestions.map((suggestion) => (
                              <div onClick={() => { handleSelectAddress(suggestion) }} className='py-8 px-12 cursor-pointer hover:bg-green hover:text-white g|transition:0.15s'>
                                <p>{suggestion.display_name}</p>
                              </div>
                            ))
                          }
                        </div>
                    }
                  </div>
                }
              </div>
            </div>
            <div className='sm:grid-col-span-1 grid-col-span-2'>
              <AddressField
                field='state'
                label={<span>State <span className='color-#B3261E'>*</span></span>}
                handler={formhandler}
              />
            </div>
            <div className='sm:grid-col-span-1 grid-col-span-2'>
              <AddressField
                field='city'
                label={<span>City <span className='color-#B3261E'>*</span></span>}
                placeholder='Enter city'
                handler={formhandler}
              />
            </div>
            <div className='grid-col-span-2'>
              <AddressField
                field='address'
                label={<span>Street address <span className='color-#B3261E'>*</span></span>}
                placeholder='Enter street address'
                handler={formhandler}
              />
            </div>
            <div className='sm:grid-col-span-1 grid-col-span-2'>
              <AddressField
                field='contactNo'
                label={<span>Contact number 1 <span className='color-#B3261E'>*</span></span>}
                placeholder='01245'
                handler={formhandler}
                disabled={false}
              />
            </div>
            <div className='sm:grid-col-span-1 grid-col-span-2'>
              <AddressField
                field="secondaryContactNo"
                label='Contact number 2'
                placeholder='01245'
                handler={formhandler}
                disabled={false}
              />
            </div>
          </div>
          <div className="">
            <AddressField
              field='notes'
              type='textarea'
              label='Delivery note'
              handler={formhandler}
              disabled={false}
              inputClassName='h-200'
            />
          </div>

          <div className="flex space-between w-full @lo:text-grey-700 text-16 weight-400 line-height-22">
            <label className="pointer content-center flex gap-8">
              <Input
                type="checkbox"
                name="isDefault"
                id="isDefault"
                className="accent-#0B9378 w-20 h-20"
                inputClass="accent-#0B9378 w-20 h-20"
                checked={formhandler.values.isDefault}
                handleChange={(e: any) => {
                  formhandler.setFieldValue("isDefault", e.target.checked)
                }
                }
              />
              <span className="l:text-16 text-12">Set as default delivery address</span>
            </label>
          </div>
        </div>
        <div className='flex j-content-end a-items-center border-t border-#00000014 py-12 gap-12'>
          <button type='reset' className='w-fit border-2 border-black text-#000000E0 bg-white hover:bg-red-100 hover:border-red hover:text-red text-14 py-12 px-20 radius-6 weight-500 pointer line-height-19 g|transition:0.5s' onClick={() => closeAddressForm('cancel')} >{type === 'edit' ? 'Discard' : 'Cancel'}</button>
          <button type='submit' className={`w-fit border-none bg-#0B9378 text-white text-14 py-15 px-20 radius-6 weight-500 hover:bg-darkgreen disabled:bg-green-300 g|transition:0.5s ${disableButton ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={disableButton}
            onClick={() => {
              if (!disableButton) {
                setTimeout(() => closeAddressForm('submit'), 1000)
              }
            }}>{type === 'edit' ? 'Save' : 'Add address'}</button>
        </div>
      </form>
    </div>)
  );
}

export default AddressForm