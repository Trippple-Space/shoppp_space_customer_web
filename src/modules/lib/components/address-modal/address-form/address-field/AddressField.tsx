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
}

const AddressField: FC<AddressFieldProps> = ({
  field,
  label,
  type,
  className,
  inputClassName,
  placeholder,
  handler: formHandler,
}) => {
  const input_className = `${
    field == "label"
      ? "text-16 weight-400 text-black opacity-100"
      : "line-height-25 text-13 text-black opacity-70"
  }`;
  return (
    <Input
      label={<span className="uppercase text-12 ">{label}</span>}
      id={field}
      name={field}
      type={type || "text"}
      placeholder={placeholder}
      handleChange={formHandler.handleChange}
      handleBlur={formHandler.handleBlur}
      value={formHandler.values[field]}
      className={cx("my-5 w-full", className)}
      inputClass={cx(
        "radius-3! py-7 px-10 w-full border-grey-400",
        {
          "border-red": formHandler.touched[field] && formHandler.errors[field],
        },
        inputClassName,
        input_className
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
