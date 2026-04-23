import { useState } from "react";
import { paymentService } from "../services/payment.service";
import { Address } from "../types/address.interface";
import { toast } from "sonner";
import { deliveryOptions } from "../constants";

export interface PaymentDetails {
  addressId?: Address["id"];
  deliveryOption: keyof typeof deliveryOptions;
  customerWhatsAppOptIn?: boolean;
  customerWhatsAppNumber?: string;
}

const usePayment = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const payWithPaystack = async (
    paymentDetails: PaymentDetails
  ): Promise<void> => {
    if (!paymentDetails.addressId) {
      toast.error("Please select an address to proceed");
      return;
    }
    try {
      setLoading(true);
      const result = await paymentService.payWithPaystack(paymentDetails);

      window.location.href = result.paymentLink;
    } catch (error) {
      toast.error("Error processing Paystack payment");
    } finally {
      setLoading(false);
    }
  };

  const payWithFlutterwave = async (
    paymentDetails: PaymentDetails
  ): Promise<void> => {
    try {
      setLoading(true);
      const result = await paymentService.payWithFlutterwave(paymentDetails);
    } catch (error) {
      setError("Error processing Flutterwave payment");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    payWithPaystack,
    payWithFlutterwave,
  };
};

export default usePayment;
