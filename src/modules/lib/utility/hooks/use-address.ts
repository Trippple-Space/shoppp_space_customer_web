"use client";

import { useEffect } from "react";
import useAddressStore from "../store/address.store";
import useUserStore from "../store/user.store";
import { Address } from "../types/address.interface";
import { FormikConfig, useFormik } from "formik";
import * as Yup from "yup";

export const AddressValidationSchema = Yup.object().shape({
  firstname: Yup.string().trim().required("First name is required"),
  lastname: Yup.string().trim().required("Last name is required"),
  address: Yup.string().trim().required("Address is required"),
  city: Yup.string().trim().required("City is required"),
  state: Yup.string().trim().required("State is required"),
  contactNo1: Yup.string()
    .matches(/^\+234\d{10}$/, "Phone number must be in +234 format")
    .required("Contact number is required"),
  contactNo2: Yup.string().test(
    "is-valid-phone",
    "Phone number must be in +234 format",
    (value) => {
      if (!value) return true;
      return /^\+234\d{10}$/.test(value);
    }
  ),
  isDefault: Yup.boolean(),
});

const formikAddressConfig = (
  initialValues: Address | undefined,
  handleSubmit: Function
): FormikConfig<any> => ({
  initialValues: initialValues || {
    firstname: "",
    lastname: "",
    address: "",
    city: "",
    state: "Lagos",
    contactNo1: "",
    contactNo2: "",
    notes: "",
    isDefault: false,
  },
  onSubmit: (values, { resetForm }) => {
    console.log(values);
    handleSubmit(values);
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
