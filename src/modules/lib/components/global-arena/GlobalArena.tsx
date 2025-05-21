'use client'

import React, { useEffect } from "react";
import { Toaster } from "sonner";
import AddressModal from "../address-modal/AddressModal";
import LoginModal from "../login-modal/LoginModal";
import { usePathname } from "next/navigation";
import { useCart } from "../../utility/hooks/use-cart";

const GlobalArena = () => {
  const pathname = usePathname()
  const { removeDiscountCode } = useCart();

  useEffect(() => {
    if (pathname !== "/checkout") {
      removeDiscountCode()
    }
  }, [pathname])

  return (
    <>
      <Toaster position="top-center" />
      <AddressModal />
      <LoginModal />
    </>
  );
};

export default GlobalArena;
