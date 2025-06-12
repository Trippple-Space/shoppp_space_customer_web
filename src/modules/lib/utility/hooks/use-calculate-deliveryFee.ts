import React, { useEffect, useState } from 'react'
import { IDeliveryDetails } from '../types/delivery.interface'
import { deliveryService } from '../services/delivery.service'

export const useCalculatedeliveryFee = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [deliveryFeeResponse, setDeliveryFeeResponse] = useState<any>()

    const calculateFee = async (deliveryDetails: IDeliveryDetails) => {
        setLoading(true)
        try {
            const response = await deliveryService.calculateDeliveryFee(deliveryDetails);
            setDeliveryFeeResponse(response)
            return response
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }
  return {loading, deliveryFeeResponse, calculateFee}
}
