import React from "react";
import { Toaster } from "sonner";
import AddressModal from "../address-modal/AddressModal";
import LoginModal from "../login-modal/LoginModal";
import ReviewsModal from "@/modules/views/product-details/reviews/ReviewsModal";

const GlobalArena = () => {
  return (
    <>
      <Toaster position="top-center" />
      <AddressModal />
      <LoginModal />
      <ReviewsModal />
    </>
  );
};

export default GlobalArena;
