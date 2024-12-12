import React, { FC } from "react";
import { Address } from "@/modules/lib/utility/types/address.interface";
import useAddress from "@/modules/lib/utility/hooks/use-address";
import { cx } from "@/modules/lib/utility/utility";
import AddressField from "../address-form/address-field/AddressField";
import Checkbox from "../../checkbox/Checkbox";
import { BiCheck, BiTrash } from "react-icons/bi";
import { PiPencil } from "react-icons/pi";
import { IoCloseCircle } from "react-icons/io5";
import { delay } from "framer-motion";
import BoxRadio from "../../box-radio/BoxRadio";
import AddressForm from "../address-form/AddressForm";

interface AddressCardProps {
  address: Address;
}
const AddressCard: FC<AddressCardProps> = ({ address }) => {
  const {
    handleDeleteAddress,
    setAddressToUpdateId,
    updateFormHandler,
    addressToUpdateId,
    selectedAddressId,
    selectAddress,
    closeAddressModal,
  } = useAddress();

  const editMode = addressToUpdateId === address.id;
  const isAddressSelected = address.id === selectedAddressId;

  return (
    <div
      className={cx(
        "flex flex-row space-between gap-12 a-items-center w-full p-16 radius-6 border border-#00000014 pointer",
        {
          "border-green-400": isAddressSelected,
        }
      )}
      onClick={() => {
        selectAddress(address.id);
        if (!editMode) {
          delay(() => {
            closeAddressModal();
          }, 500);
        }
      }}
    >
      <BoxRadio id={`${address.id}`} name={`${address.id}`} checked={isAddressSelected} label='' className="address" />
      {
        editMode ?
          (
            <>
              {/**<AddressForm
                closeAddressForm={(button) => {
                  if (button === 'cancel') {
                    setAddressToUpdateId(null);
                  }
                }}
                type={'edit'} /> */}

              <form
                className=""
                onSubmit={updateFormHandler.handleSubmit}
              >
                <p>
                  <AddressField
                    field="contactNo"
                    label="Contact Number"
                    handler={updateFormHandler}
                    disabled={false}
                  />
                </p>
                <p>
                  {editMode ? (
                    <AddressField
                      field="address"
                      label="Address"
                      handler={updateFormHandler}
                      disabled={false}
                    />
                  ) : (
                    address.address
                  )}
                </p>
                <p>
                  {editMode ? (
                    <div className="flex gap-5">
                      <AddressField
                        field="city"
                        label="City"
                        handler={updateFormHandler}
                        disabled={false}
                      />
                      <AddressField
                        field="state"
                        label="State"
                        handler={updateFormHandler}
                        disabled={false}
                      />
                    </div>
                  ) : (
                    <span>
                      {address.city} {address.state}
                    </span>
                  )}
                </p>
                {(address.notes || editMode) && (
                  <p className="font-italic text-12">
                    {editMode ? (
                      <AddressField
                        field="notes"
                        type="textarea"
                        label="Notes"
                        handler={updateFormHandler}
                        disabled={false}
                      />
                    ) : (
                      <span>Notes: {address.notes}</span>
                    )}
                  </p>
                )}
                {editMode && (
                  <div className="flex flex-col a-items-end a-self-end">
                    <div className="flex gap-8 l:gap-10 w-fit space-between a-self-end mt-10">
                      <button
                        type="reset"
                        className="btn w-50p a-items-center j-items-center l:w-100p border-none bg-grey-100 text-grey-500 hover:bg-red-100 hover:text-red text-13 pr-8 pl-2 py-5 radius-20 weight-400 pointer flex"
                        onClick={() => {
                          setAddressToUpdateId(null);
                          delay(() => {
                            closeAddressModal();
                          }, 500);
                        }}
                      >
                        {" "}
                        <IoCloseCircle className="w-20  mr-3 p-0 " />{" "}
                        <span>Discard</span>{" "}
                      </button>
                      <button
                        type="submit"
                        className="btn w-50p l:w-100p border-none bg-green text-white text-13 pr-8 pl-2 py-5 radius-20 weight-400 pointer flex hover:bg-darkgreen"
                      >
                        <BiCheck className="w-20 text-white" />{" "}
                        <span className="">Save</span>{" "}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </>
          )
          :
          (
            <div className="flex space-between a-items-center w-full">
              <div className="flex flex-col gap-4 weight-400 text-16 line-height-24 color-#00000099">
                <p>{address.contactNo}{address?.secondaryContactNo && ', '}{address?.secondaryContactNo}</p>
                <p>{address.address}{', '}{address.city}{', '}{address.state}</p>
                {
                  address.notes && <p>Delivery note: {address.notes}</p>
                }
                {
                  address.isDefault && <span className="bg-#D4280C1F py-2 px-10 radius-4 color-#D4280C weight-400 text-12 line-height-20 w-fit">Default</span>
                }
              </div>
              <div className="">
                {/*<button
                    className="w-50p border-danger border-1 @lo:border-none bg-none text-danger text-15 p-5 round bg-grey-100 hover:bg-red-100 hover:border-red pointer radius-5 weight-400"
                    onClick={() => handleDeleteAddress(address.id)}
                  >
                    {" "}
                    <BiTrash className="w-20" />{" "}
                  </button> */}
                <button
                  className="border-none pointer bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAddressToUpdateId(address.id);
                  }}
                >
                  <span className="color-#1677FF text-16 weight-500 line-height-24 underline">Edit</span>
                </button>
              </div>
            </div>
          )
      }
    </div>

  );
};

export default AddressCard;
