import React, { useEffect, useState } from 'react'
import { IDeliveryDetails } from '../types/delivery.interface'
import { deliveryService } from '../services/delivery.service'

export const useCalculatedeliveryFee = () => {
    const [deliveryFeeResponse, setDeliveryFeeResponse] = useState<any>()

    const calculateFee = async (deliveryDetails: IDeliveryDetails) => {
       
        try {
            const response = await deliveryService.calculateDeliveryFee(deliveryDetails);
            setDeliveryFeeResponse(response)
            return response
        } catch (error) {
            //console.log(error);
        }
    }
  return {deliveryFeeResponse, calculateFee}
}
