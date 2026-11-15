import React, { FC, useEffect, useRef, useState } from 'react'
import useAddress from '@/modules/lib/utility/hooks/use-address';
import AddressField from './address-field/AddressField';
import Input from '../../input/Input';

import AddressMap from '../address-map/AddressMap';
import UseCurrentLocationButton from '../address-map/UseCurrentLocationButton';
import { toast } from 'sonner';
import axios from 'axios';
import { useDebounce } from '@/modules/lib/utility/hooks/use-debounce';

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
  const { debouncedValue: addressDebounce } = useDebounce(suggestionInputValue, 500);

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
        const encodedValue = encodeURIComponent(inputValue);

        try {
          const response = await axios.get(
            `https://api.locationiq.com/v1/autocomplete?key=${locationiqApiKey}&q=${encodedValue}&limit=10&countrycodes=ng&dedupe=1&`
          );
          setAddressSuggestions(response.data);
          setShowSuggestions(true);
        } catch (err: any) {
          console.error(err);
        }
      };


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

  useEffect(() => {
  if (addressDebounce.trim().length > 2) {
    autoCompleteAddress(addressDebounce); 
  } else {
    setShowSuggestions(false);
  }
}, [addressDebounce]);


  return (
    (<div className="flex-col w-full">
      <form className='flex flex-col' onSubmit={formhandler.handleSubmit}>
        <div className='flex flex-col p-[24px] -mt-[24px] -mx-[24px] gap-[16px]'>
          <div className={`rounded-[8px] overflow-hidden relative h-[100px]`}>
            <AddressMap location={{ lat: userLocation.latitude || 6.5480282, lng: userLocation.longitude || 3.1191456 }} />
            <div className='absolute bg-[#00000073] top-0 bottom-0 w-full flex flex-col justify-center'>
              <UseCurrentLocationButton formhandler={formhandler} setUserLocation={setUserLocation} setSuggestionInputValue={setSuggestionInputValue} />
            </div>
          </div>
          <div className='grid sm:grid-4-rows-1fr grid-cols-2 gap-[16px]'>
            <div className='sm:col-span-1 col-span-2'>
              <AddressField
                field='firstName'
                label={<span>First name <span className='text-[#B3261E]'>*</span></span>}
                placeholder='Enter your first name'
                handler={formhandler}
                disabled={false}
              />
            </div>
            <div className='sm:col-span-1 col-span-2'>
              <AddressField
                field='lastName'
                label={<span>Last name <span className='text-[#B3261E]'>*</span></span>}
                placeholder='Enter your last name'
                handler={formhandler}
                disabled={false}
              />
            </div>
            <div className='col-span-2' ref={selectRef}>
            <Input
  label={<span className={`text-[14px] font-normal leading-[19px]`}>Search Address</span>}
  id={'searchAddress'}
  name={'searchAddress'}
  type={"text"}
  value={suggestionInputValue}
  placeholder={'Start typing an address..'}
  handleChange={(e: any) => {
    setSuggestionInputValue(e.target.value); // ✅ only update value
  }}
  handleFocus={() => { }}
  className={'w-full'}
  inputClass="rounded-[6px] p-[12px] w-full border-[#6A6A6A4D] text-[16px]"
/>

              <div className='relative'>
                {
                  showSuggestions &&
                  <div className='absolute w-full bg-white border border-black z-[10px] top-0 mt-[3px] rounded-[6px] border-[#6A6A6A4D] text-[16px] overflow-hidden h-fit max-h-[182px] overflow-auto'>
                    {
                      addressSuggestions.length === 0 ?
                        <div className='py-[8px] px-[12px] flex items-center justify-center w-full text-center'>no address found</div>
                        :
                        <div className='flex flex-col'>
                          {
                            addressSuggestions.map((suggestion) => (
                              <div onClick={() => { handleSelectAddress(suggestion) }} className='py-[8px] px-[12px] cursor-pointer hover:bg-brand hover:text-white transition-all duration-150'>
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
            <div className='sm:col-span-1 col-span-2'>
              <AddressField
                field='state'
                label={<span>State <span className='text-[#B3261E]'>*</span></span>}
                handler={formhandler}
              />
            </div>
            <div className='sm:col-span-1 col-span-2'>
              <AddressField
                field='city'
                label={<span>City <span className='text-[#B3261E]'>*</span></span>}
                placeholder='Enter city'
                handler={formhandler}
              />
            </div>
            <div className='col-span-2'>
              <AddressField
                field='address'
                label={<span>Street address <span className='text-[#B3261E]'>*</span></span>}
                placeholder='Enter street address'
                handler={formhandler}
              />
            </div>
            <div className='sm:col-span-1 col-span-2'>
              <AddressField
                field='contactNo'
                label={<span>Contact number 1 <span className='text-[#B3261E]'>*</span></span>}
                placeholder='01245'
                handler={formhandler}
                disabled={false}
              />
            </div>
            <div className='sm:col-span-1 col-span-2'>
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
              inputClassName='h-[200px]'
            />
          </div>

          <div className="flex justify-between w-full text-[#6B6662] text-[16px] font-normal leading-[22px]">
            <label className="cursor-pointer content-center flex gap-[8px]">
              <Input
                type="checkbox"
                name="isDefault"
                id="isDefault"
                className="accent-[#0357EE] w-[20px] h-[20px]"
                inputClass="accent-[#0357EE] w-[20px] h-[20px]"
                checked={formhandler.values.isDefault}
                handleChange={(e: any) => {
                  formhandler.setFieldValue("isDefault", e.target.checked)
                }
                }
              />
              <span className="lg:text-[16px] text-[12px]">Set as default delivery address</span>
            </label>
          </div>
        </div>
        <div className='flex justify-end items-center border-t border-[#00000014] py-[12px] gap-[12px]'>
          <button type='reset' className='w-fit border-[2px] border-black text-[#000000E0] bg-white hover:bg-red-100 hover:border-[#DE3838] hover:text-[#DE3838] text-[14px] py-[12px] px-[20px] rounded-[6px] font-medium cursor-pointer leading-[19px] transition-all duration-500' onClick={() => closeAddressForm('cancel')} >{type === 'edit' ? 'Discard' : 'Cancel'}</button>
          <button type='submit' className={`w-fit border-none bg-[#0357EE] text-white text-[14px] py-[15px] px-[20px] rounded-[6px] font-medium hover:bg-brand-hover disabled:bg-brand transition-all duration-500 ${disableButton ? 'cursor-not-allowed' : 'cursor-pointer'}`}
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