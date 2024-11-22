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

  //console.log({ selectedAddressId });

  return (
    <div
      className={cx(
        "l:flex space-between items-center w-full h-fit pointer",
        {}
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
      <div
        className={cx(
          "flex gap-10 l:gap-15 items-center w-full bg-white p-15 radius-5 border @lo:border-grey-300",
          {
            "border-black ": isAddressSelected,
          }
        )}
      >
        <Checkbox
          name="address"
          className={cx("a-self-start mt-4", {
            "border-black bg-yellow": isAddressSelected,
          })}
          checked={isAddressSelected}
        />

        <div className="flex-col w-full">
          <form
            className="line-height-25 text-13 text-dimgrey opacity-70"
            onSubmit={updateFormHandler.handleSubmit}
          >
            <h2 className="text-16 l:text-16 weight-500 text-black mb-5 ">
              {editMode ? (
                <AddressField
                  field="label"
                  label="Label"
                  handler={updateFormHandler}
                />
              ) : (
                address.label
              )}
            </h2>
            <p>
              {editMode ? (
                <AddressField
                  field="address"
                  label="Address"
                  handler={updateFormHandler}
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
                  />
                  <AddressField
                    field="state"
                    label="State"
                    handler={updateFormHandler}
                  />
                </div>
              ) : (
                <span>
                  {address.city} {address.state}
                </span>
              )}
            </p>
            <p>
              {editMode ? (
                <AddressField
                  field="contactNo"
                  label="Contact Number"
                  handler={updateFormHandler}
                />
              ) : (
                address.contactNo
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
          {!editMode && (
            <div className="flex flex-col a-items-end a-self-end">
              <div className="flex gap-8 l:gap-10 w-fit space-between a-self-end mt-10">
                <button
                  className="w-50p border-danger border-1 @lo:border-none bg-none text-danger text-15 p-5 round bg-grey-100 hover:bg-red-100 hover:border-red pointer radius-5 weight-400"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  {" "}
                  <BiTrash className="w-20" />{" "}
                </button>
                <button
                  className="w-50p l:w-100p border-none round bg-faint-cream hover:bg-light-yellow text-white text-15 p-5 radius-7 weight-400 pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAddressToUpdateId(address.id);
                  }}
                >
                  <PiPencil className="w-20 text-black" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
