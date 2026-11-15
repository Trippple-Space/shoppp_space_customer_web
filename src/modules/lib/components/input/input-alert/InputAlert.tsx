import { cx } from '@/modules/lib/utility/utility';
import React from 'react';
import Icon from '../../icon/Icon';
import { FormikErrors } from 'formik';

interface InputAlertProps {
  hasError?: boolean;
  errorMessage?: string | string[] | FormikErrors<JSON> | FormikErrors<Date> | undefined;
}

const isFormikErrorsJSON = (
  errors?: FormikErrors<JSON> | FormikErrors<Date>
): errors is FormikErrors<JSON> => {
  return typeof errors === 'object' && errors !== null && 'JSON' in errors;
};

const isFormikErrorsDate = (
  errors?: FormikErrors<JSON> | FormikErrors<Date>
): errors is FormikErrors<Date> => {
  return typeof errors === 'object' && errors !== null && 'Date' in errors;
};

const renderErrorMessage = (errorMessage: InputAlertProps['errorMessage']) => {
  if (typeof errorMessage === 'string') {
    return errorMessage;
  } else if (Array.isArray(errorMessage)) {
    return errorMessage.join(', ');
  } else if (isFormikErrorsJSON(errorMessage)) {
    return errorMessage as string;
  } else if (isFormikErrorsDate(errorMessage)) {
    return errorMessage as string;
  } else {
    return undefined;
  }
};

const InputAlert: React.FC<InputAlertProps> = ({ hasError, errorMessage }) => {
  return (
    <div
      className={`notice text-[12px] h-0 gap-[5px] justify-end w-full pt-[12px] pb-[12px] text-danger ${hasError ? 'flex' : "!hidden"}`}
    >
      <Icon name="alert-circle" className="w-[14px] self-center" />
      <span className="self-center">{renderErrorMessage(errorMessage)}</span>
    </div>
  );
};

export default InputAlert;
