import { AxiosResponse } from "axios"
import endpoints from "../endpoints"
import http from "../http"
import { IDeliveryDetails } from "../types/delivery.interface"

class DeliveryService {
    calculateDeliveryFee(deliveryDetails: IDeliveryDetails) {
        return http.post(endpoints.CALCULATEDELIVERYFEE, deliveryDetails).then((response: AxiosResponse) => response.data)
    }
}

export const deliveryService = new DeliveryService()