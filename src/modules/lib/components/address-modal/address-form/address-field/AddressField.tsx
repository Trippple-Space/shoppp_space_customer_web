import useAddress from "@/modules/lib/utility/hooks/use-address";
import React, { FC, HTMLInputTypeAttribute } from "react";
import Input from "../../../input/Input";
import { cx } from "@/modules/lib/utility/utility";
import InputAlert from "../../../input/input-alert/InputAlert";
import { Address } from "@/modules/lib/utility/types/address.interface";

interface AddressFieldProps {
    field: keyof Address,
    label?: string,
    type?: HTMLInputTypeAttribute,
    placeholder?: string,
    className?: string,
    inputClassName?: string,
    isEdit?: boolean
}

const AddressField: FC<AddressFieldProps> = ({field, label, type, className, inputClassName, isEdit = false, placeholder }) => {
    const {formHandler: createFormHandler, updateFormHandler} = useAddress();
  const formHandler = isEdit ? updateFormHandler : createFormHandler
  return (
    <Input
      label={label}
      id={field}
      name={field}
      type={type || 'text'}
      placeholder={placeholder}
      handleChange={formHandler.handleChange}
      handleBlur={formHandler.handleBlur}
      value={formHandler.values[field]}
      className={cx("l:my-10", className)}
      inputClass={cx({
        "border-red": formHandler.touched[field] && formHandler.errors[field],
      }, inputClassName)}
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
