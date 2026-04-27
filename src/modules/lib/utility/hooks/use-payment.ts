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
  const [sharing, setSharing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const redirectToPaystack = (paymentLink: string) => {
    try {
      const parsedUrl = new URL(paymentLink);
      if (!parsedUrl.hostname.includes("paystack.com")) {
        throw new Error("Invalid paystack url");
      }
      window.location.assign(parsedUrl.toString());
    } catch {
      toast.error("Invalid payment link returned");
    }
  };

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

      redirectToPaystack(result.paymentLink);
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

  const sharePaymentLink = async (
    paymentDetails: PaymentDetails
  ): Promise<void> => {
    if (!paymentDetails.addressId) {
      toast.error("Please select an address to proceed");
      return;
    }

    try {
      setSharing(true);
      const result = await paymentService.createShareLink(paymentDetails);
      const shareLink = `${window.location.origin}/pay/${result.shareToken}`;
      await navigator.clipboard.writeText(shareLink);
      toast.success("Payment link copied to clipboard");
    } catch (error) {
      toast.error("Error creating share payment link");
    } finally {
      setSharing(false);
    }
  };

  return {
    loading,
    sharing,
    error,
    payWithPaystack,
    payWithFlutterwave,
    sharePaymentLink,
  };
};

export default usePayment;
