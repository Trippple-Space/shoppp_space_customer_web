import React, { FC, HTMLInputTypeAttribute } from "react";
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
  return (
    <Input
      label={<span className="text-14 weight-400 line-height-19">{label}</span>}
      id={field}
      name={field}
      type={type || "text"}
      placeholder={placeholder}
      handleChange={formHandler.handleChange}
      handleBlur={formHandler.handleBlur}
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
        <InputAlert
          hasError={!!(formHandler.touched[field] && formHandler.errors[field])}
          errorMessage={formHandler.errors[field]}
        />
      }
    />
  );
};

export default AddressField;
