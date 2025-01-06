"use client";

import { useEffect } from "react";
import useAddressStore from "../store/address.store";
import useUserStore from "../store/user.store";
import { Address } from "../types/address.interface";
import { FormikConfig, useFormik } from "formik";
import * as Yup from "yup";

const nameValidation = Yup.string()
  .trim()
  .matches(/^[a-zA-Z\s]+$/, "Name must only contain letters and spaces")
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .required("Name cannot be empty");

export const AddressValidationSchema = Yup.object().shape({
  label: Yup.string().trim().required("Label is required"),
  firstName: nameValidation.required("First name is required"),
  lastName: nameValidation.required("Last name is required"),
  address: Yup.string().trim().required("Address is required"),
  city: Yup.string().trim().required("City is required"),
  state: Yup.string().trim().required("State is required"),
  contactNo: Yup.string()
    .test(
      "valid-nigerian-phone",
      "Phone number must be a valid Nigerian number",
      (value) => {
        if (!value) return false;

        const phoneNumber = value.startsWith("+234")
          ? value.slice(4)
          : value.startsWith("0")
          ? value.slice(1)
          : value;
        return /^(7|8|9)\d{9}$/.test(phoneNumber);
      }
    )
    .required("Contact number is required"),

  secondaryContactNo: Yup.string()
    .nullable()
    .test(
      "valid-nigerian-phone",
      "Phone number must be a valid Nigerian number",
      function (value) {
        const { secondaryContactNo } = this.parent;
        if (
          !value ||
          secondaryContactNo === null ||
          secondaryContactNo === undefined
        ) {
          return true;
        }
        const phoneNumber = value.startsWith("+234")
          ? value.slice(4)
          : value.startsWith("0")
          ? value.slice(1)
          : value;
        return /^(7|8|9)\d{9}$/.test(phoneNumber);
      }
    ),

  isDefault: Yup.boolean(),
});

const formikAddressConfig = (
  initialValues: Address | undefined,
  handleSubmit: Function
): FormikConfig<any> => ({
  initialValues: initialValues || {
    label: "something",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "Lagos",
    contactNo: "",
    secondaryContactNo: "",
    notes: "",
    isDefault: false,
  },
  onSubmit: (values, { resetForm }) => {
    const transformedValues = {
      ...values,
      contactNo: `+234${values.contactNo
        .replace(/^0/, "")
        .replace(/^\+234/, "")}`,
      secondaryContactNo: values.secondaryContactNo
        ? `+234${values.secondaryContactNo
            .replace(/^0/, "")
            .replace(/^\+234/, "")}`
        : "",
    };
    if (!values.secondaryContactNo) {
      delete transformedValues.secondaryContactNo;
    }

    handleSubmit(transformedValues);
    resetForm();
  },

  validationSchema: AddressValidationSchema,
  enableReinitialize: true,
});

const useAddress = () => {
  const {
    isAddressModalOpen,
    addresses,
    selectedAddressId,
    openAddressModal,
    closeAddressModal,
    fetchAddresses,
    selectAddress,
    setAddressToUpdateId,
    addressToUpdateId,
    updateAddress,
    createAddress,
    deleteAddress,
  } = useAddressStore();

  const { isAuthenticated, user } = useUserStore();
  const addressToUpdate = addresses?.find(
    (address) => address.id === addressToUpdateId
  );

  const handleCreateAddress = (newAddress: Address) => {
    if (user?.id) {
      createAddress(user.id, newAddress);
    }
  };

  const handleUpdateAddress = (addressId: number, newAddress: Address) => {
    if (user?.id && selectedAddressId !== null) {
      updateAddress(user.id, addressId, newAddress);
    }
  };

  const handleDeleteAddress = (addressId: number) => {
    if (user?.id) {
      deleteAddress(user.id, addressId);
    }
  };

  const formHandler = useFormik<Address>(
    formikAddressConfig(undefined, handleCreateAddress)
  );
  const updateFormHandler = useFormik<Address>(
    formikAddressConfig(addressToUpdate, (address: Address) => {
      handleUpdateAddress(address.id, address);
    })
  );

  useEffect(() => {
    if (isAddressModalOpen && !addresses && isAuthenticated && user) {
      fetchAddresses(user.id);
    }
  }, [isAddressModalOpen, isAuthenticated]);

  const selectedAddress = addresses?.find(
    (address) => address.id === selectedAddressId
  );

  return {
    isAddressModalOpen,
    addresses,
    selectedAddressId,
    selectedAddress,
    openAddressModal,
    closeAddressModal,
    selectAddress,
    handleUpdateAddress,
    handleCreateAddress,
    handleDeleteAddress,
    formHandler,
    addressToUpdateId,
    setAddressToUpdateId,
    updateFormHandler,
  };
};

export default useAddress;
