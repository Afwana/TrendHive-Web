/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const initialAddressFormData = {
  name: "",
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [addAddress, setAddAddress] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast.warning("Limit reached! You can add max 3 addresses.");

      return;
    }

    currentEditedId !== null
      ? dispatch(
          editaAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            toast.success("Address updated successfully.");
            setAddAddress(false);
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: user?.id,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setFormData(initialAddressFormData);
            toast.success("Address added successfully.");
            setAddAddress(false);
          }
        });
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        toast.success("Address deleted successfully.");
      }
    });
  }

  function handleEditAddress(getCuurentAddress) {
    setCurrentEditedId(getCuurentAddress?._id);
    setFormData({
      ...formData,
      name: getCuurentAddress?.name,
      address: getCuurentAddress?.address,
      city: getCuurentAddress?.city,
      state: getCuurentAddress?.state,
      country: getCuurentAddress?.country,
      phone: getCuurentAddress?.phone,
      pincode: getCuurentAddress?.pincode,
      notes: getCuurentAddress?.notes,
    });
    setAddAddress(false);
  }

  function isFormValid() {
    const requiredFields = [
      "name",
      "address",
      "city",
      "state",
      "country",
      "phone",
      "pincode",
    ];

    return requiredFields.every(
      (field) => formData[field] && formData[field].trim() !== ""
    );
  }

  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch]);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem, index) => (
              <AddressCard
                key={index}
                selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={singleAddressItem}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <div className="flex items-center justify-between gap-3 p-3">
        <Button
          className={`${
            addAddress || currentEditedId !== null ? "w-1/2" : "w-full"
          }`}
          onClick={() => {
            setAddAddress(true);
            setCurrentEditedId(null);
          }}>
          Add New Address
        </Button>
        {(addAddress || currentEditedId !== null) && (
          <Button
            className="w-1/2"
            onClick={() => {
              setAddAddress(false);
              setCurrentEditedId(null);
              setFormData(initialAddressFormData);
            }}>
            Cancel
          </Button>
        )}
      </div>
      {(addAddress || currentEditedId !== null) && (
        <>
          <CardHeader>
            <CardTitle>
              {currentEditedId !== null ? "Edit Address" : "Add New Address"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CommonForm
              formControls={addressFormControls}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              onSubmit={handleManageAddress}
              isBtnDisabled={!isFormValid()}
            />
          </CardContent>
        </>
      )}
    </Card>
  );
}

export default Address;
