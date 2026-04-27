import config from 'env';
import endpoints from '../endpoints';
import http from '../http';
import {
  PaymentResult,
  ShareLinkResponse,
  SharedCheckoutSummaryResponse,
  SharedPaystackRequest,
  SharedPaystackResponse,
} from '../types/payment.interface';
import { buildEndpoint } from '../utility';
import { PaymentDetails } from '../hooks/use-payment';

class PaymentService {
  async payWithPaystack(paymentDetails: PaymentDetails): Promise<PaymentResult> {
    const response = await http.post(endpoints.PAY_WITH_PAYSTACK, paymentDetails);
    return response.data;
  }

  async createShareLink(paymentDetails: PaymentDetails): Promise<ShareLinkResponse> {
    const response = await http.post(endpoints.PAYMENT_SHARE_LINK, paymentDetails);
    return response.data;
  }

  async getSharedCheckoutSummary(
    shareToken: string
  ): Promise<SharedCheckoutSummaryResponse> {
    const response = await fetch(
      `${config.API_HOST}/${buildEndpoint(endpoints.PAYMENT_SHARE_SUMMARY, {
        shareToken,
      })}`
    );
    if (!response.ok) {
      throw new Error('Unable to load shared checkout details.');
    }

    return response.json();
  }

  async getSharedPaystackLink(
    shareToken: string,
    payload: SharedPaystackRequest
  ): Promise<SharedPaystackResponse> {
    const response = await fetch(
      `${config.API_HOST}/${buildEndpoint(endpoints.PAYMENT_SHARE_PAYSTACK, {
        shareToken,
      })}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error('Unable to initialize payment from shared link.');
    }

    return response.json();
  }

  async payWithFlutterwave(paymentDetails: any): Promise<PaymentResult> {
    const response = await http.post('YOUR_FLUTTERWAVE_API_ENDPOINT', paymentDetails);
    return response.data;
  }
}

export const paymentService = new PaymentService();
