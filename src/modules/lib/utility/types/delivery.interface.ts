export interface IDeliveryDetails {
    addressId: number,
    deliveryType: string
}

export interface DeliveryOption {
    standard: {
      title: string,
      description: string,
      etaInDays: number,
      price: number
    },
    express: {
      title: string,
      description: string,
      etaInDays: number,
      price: number
    },
    pickup: {
      title: string,
      description: string,
      etaInDays: number | string,
      price: number
    }
}