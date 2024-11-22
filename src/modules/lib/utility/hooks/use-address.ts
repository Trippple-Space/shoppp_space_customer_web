"use client";

import { useEffect } from "react";
import useAddressStore from "../store/address.store";
import useUserStore from "../store/user.store";
import { Address } from "../types/address.interface";
import { FormikConfig, useFormik } from "formik";
import * as Yup from "yup";

export const AddressValidationSchema = Yup.object().shape({
  label: Yup.string().trim().required("Label is required"),
  address: Yup.string().trim().required("Address is required"),
  city: Yup.string().trim().required("City is required"),
  state: Yup.string().trim().required("State is required"),
  contactNo: Yup.string()
    .matches(
      /^\+234\d{10}$/,
      "Phone number must be in +234 format"
    )
    .required("Contact number is required"),

  isDefault: Yup.boolean(),
});

const formikAddressConfig = (
  initialValues: Address | undefined,
  handleSubmit: Function
): FormikConfig<any> => ({
  initialValues: initialValues || {
    label: "",
    address: "",
    city: "",
    state: "",
    contactNo: "",
    notes: "",
    isDefault: false,
  },
  onSubmit: (values, { resetForm }) => {
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
      console.log({ addressId, newAddress });
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
      console.log({ ll: address });
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
