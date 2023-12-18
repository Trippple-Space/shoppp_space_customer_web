import { useState } from 'react';
import { paymentService } from '../services/payment.service';
import { Address } from '../types/address.interface';
import { toast } from 'sonner';

interface PaymentDetails {
    addressId?: Address['id'],
}

const usePayment = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const payWithPaystack = async (paymentDetails: PaymentDetails): Promise<void> => {
      console.log('Here')
    if (!paymentDetails.addressId) {
      toast.error('Please select an address to proceed')
      return;
    }
    try {
      setLoading(true);
      const result = await paymentService.payWithPaystack(paymentDetails);
      console.log('Paystack Payment Successful:', result);
      window.location.href = result.paymentLink;
    } catch (error) {
      toast.error('Error processing Paystack payment');
      console.error('Paystack Payment Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const payWithFlutterwave = async (paymentDetails: PaymentDetails): Promise<void> => {
    try {
      setLoading(true);
      const result = await paymentService.payWithFlutterwave(paymentDetails);
      console.log('Flutterwave Payment Successful:', result);
    } catch (error) {
      setError('Error processing Flutterwave payment');
      console.error('Flutterwave Payment Error:', error);
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
