export interface IDeliveryDetails {
    addressId: number,
    deliveryType: string
}

export interface DeliveryOption {
    standard: {
      title: string,
      available: boolean,
      description: string,
      etaInDays: number,
      price: number,
      error: string | null,
      message: string | null
    },
    express: {
      title: string,
      available: boolean,
      description: string,
      etaInDays: number,
      price: number,
            error: string | null,
      message: string | null
    },
    pickup: {
      title: string,
      available: boolean,
      description: string,
      etaInDays: number | string,
      price: number,
      error: string | null,
      message: string | null
    }
}