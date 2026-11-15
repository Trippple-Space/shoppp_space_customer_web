import React, { FC, HTMLInputTypeAttribute, useState } from "react";
import Input from "../../../input/Input";
import { cx } from "@/modules/lib/utility/utility";
import InputAlert from "../../../input/input-alert/InputAlert";
import { Address } from "@/modules/lib/utility/types/address.interface";

interface AddressFieldProps {
  field: keyof Address;
  label?: React.ReactNode;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  isEdit?: boolean;
  handler: any;
  disabled?: boolean
}

const AddressField: FC<AddressFieldProps> = ({
  field,
  label,
  type,
  className,
  inputClassName,
  placeholder,
  handler: formHandler,
  disabled
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    (<div className="flex">
      {
        field?.toLocaleLowerCase()?.includes('contact') && (
          <div className={`py-[12px] px-[14px] bg-[#F3F3F3] border rounded-tl-[8px] rounded-bl-[8px] text-[#545F71] text-[16px] h-[47.2px] flex flex-col self-center ${!!(formHandler.touched[field] && formHandler.errors[field]) ? 'lg:mt-[5px] mt-[3px] border-[#DE3838]' : isFocused ? 'lg:mt-[29px] mt-[27px] border-brand' : 'lg:mt-[29px] mt-[27px] border-[#00000026]'}`}>+234</div>
        )
      }
      <Input
        label={<span className={`text-[14px] font-normal leading-[19px] ${field?.toLocaleLowerCase()?.includes('contact') && '-ml-[68.025px]'}`}>{label}</span>}
        id={field}
        name={field}
        type={type || "text"}
        placeholder={placeholder}
        handleChange={formHandler.handleChange}
        handleBlur={(e: any) => {
          setIsFocused(false);
          formHandler.handleBlur(e);
        }}
        handleFocus={() => setIsFocused(true)}
        value={
          field === 'state'
            ? 'Lagos'
            : formHandler.values[field]?.replace(/^\+234/, '') || ''
        }

        className={cx("w-full", className)}
        disabled={disabled}
        inputClass={cx(
          "rounded-r-[6px] p-[12px] w-full border border text-[16px]",
          {
            "border-[#DE3838]": formHandler.touched[field] && formHandler.errors[field],
          },
          inputClassName,
        )}
        after={
          <div className={`${field?.toLocaleLowerCase()?.includes('contact') && '-ml-[68.025px] mt-[1px]'}`}>
            <InputAlert
              hasError={!!(formHandler.touched[field] && formHandler.errors[field])}
              errorMessage={formHandler.errors[field]}
            />
          </div>
        }
      /></div>)
  );
};

export default AddressField;
