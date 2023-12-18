// payment.service.ts

import { AxiosResponse } from 'axios';
import endpoints from '../endpoints';
import http from '../http';
import { PaymentResult } from '../types/payment.interface';
import { buildEndpoint } from '../utility';

class PaymentService {
    payWithPaystack(paymentDetails: any): Promise<PaymentResult> {
        return new Promise((resolve, reject) => {
            http.post(endpoints.PAY_WITH_PAYSTACK, paymentDetails)
                .then((response: AxiosResponse) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    console.error('Error processing Paystack payment:', error);
                    reject(error);
                });
        });
    }

    payWithFlutterwave(paymentDetails: any): Promise<PaymentResult> {
        return new Promise((resolve, reject) => {
            // Replace 'YOUR_FLUTTERWAVE_API_ENDPOINT' with the actual endpoint
            http.post('YOUR_FLUTTERWAVE_API_ENDPOINT', paymentDetails)
                .then((response: AxiosResponse) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    console.error('Error processing Flutterwave payment:', error);
                    reject(error);
                });
        });
    }
}

export const paymentService = new PaymentService();
