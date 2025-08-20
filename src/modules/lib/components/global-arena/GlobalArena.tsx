"use client"

import React, { useEffect, useState } from "react";
import { Toaster } from "sonner";
import AddressModal from "../address-modal/AddressModal";
import LoginModal from "../login-modal/LoginModal";
import ReviewsModal from "@/modules/views/product-details/reviews/ReviewsModal";

const GlobalArena = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

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
