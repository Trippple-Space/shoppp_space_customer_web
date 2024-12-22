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
  disabled: boolean
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
          <div className={`py-12 px-14 bg-#F3F3F3 border @lo:radius-t-l-8 @lo:radius-b-l-8 color-#545F71 text-16 h-fit flex flex-col a-self-center ${!!(formHandler.touched[field] && formHandler.errors[field]) ? 'xl:mt-3 mt-2 border-red' : isFocused ? 'xl:mt-27 mt-26 border-green' : 'xl:mt-27 mt-26 border-#00000026'}`}>+234</div>
        )
      }
      <Input
        label={<span className={`text-14 weight-400 line-height-19 ${field?.toLocaleLowerCase()?.includes('contact') && 'ml--68.025'}`}>{label}</span>}
        id={field}
        name={field}
        type={type || "text"}
        placeholder={placeholder}
        handleChange={formHandler.handleChange}
        handleBlur={() => {setIsFocused(false); formHandler.handleBlur();}}
        handleFocus={() => setIsFocused(true)}
        value={field === 'state'
          ? 'Lagos'
          : formHandler.values[field]?.replace(/^\+234/, '')}
        className={cx("w-full", className)}
        disabled={disabled}
        inputClass={cx(
          "radius-6! p-12 w-full border-#6A6A6A4D text-16",
          {
            "border-red": formHandler.touched[field] && formHandler.errors[field],
          },
          inputClassName,
        )}
        after={
          <div className={`${field?.toLocaleLowerCase()?.includes('contact') && 'ml--68.025 mt-1'}`}>
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
