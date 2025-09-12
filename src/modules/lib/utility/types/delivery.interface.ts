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
    vendorManaged: {
      title: string,  
      pickup: Array<{
    status: string | null;
    storeId: number;
    storeName: string;
  }>;

  vendorManaged: Array<{
    fee: number;
    status: string | null;
    storeId: number;
    storeName: string;
    estimatedTime: string | null;
  }>;

  vendorManagedTotal: number;
};

}

        // {
                    // "fee": null,
                    // "status": null,
                    // "storeId": 2,
                    // "storeName": "Ego",
                    // "estimatedTime": null
            
            // }