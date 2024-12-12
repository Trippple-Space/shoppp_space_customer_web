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
  .max(50, "Name must be less than 50 characters");

export const AddressValidationSchema = Yup.object().shape({
  firstname: nameValidation.required("First name is required"),
  lastname: nameValidation.required("Last name is required"),
  address: Yup.string().trim().required("Address is required"),
  city: Yup.string().trim().required("City is required"),
  state: Yup.string().trim().required("State is required"),
  contactNo: Yup.string()
    .test(
      "valid-nigerian-phone",
      "Phone number must be a valid Nigerian number",
      (value) => {
        return typeof value === "string" && /^(7|8|9)\d{9}$/.test(value);
      }
    )
    .required("Contact number is required"),
  secondaryContactNo: Yup.string().test(
    "valid-nigerian-phone",
    "Phone number must be a valid Nigerian number",
    (value) => {
      if (!value) return true;
      return typeof value === "string" && /^(7|8|9)\d{9}$/.test(value);
    }
  ),
  isDefault: Yup.boolean(),
});

const formikAddressConfig = (
  initialValues: Address | undefined,
  handleSubmit: Function
): FormikConfig<any> => ({
  initialValues: initialValues || {
    label: 'something',
    firstname: "",
    lastname: "",
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
      contactNo: `+234${values.contactNo}`,
      secondaryContactNo: values.secondaryContactNo
        ? `+234${values.secondaryContactNo}`
        : "",
    };

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
