export const deliveryOptions = {
    standard: {
        title: 'Standard Delivery',
        description: 'Arrives in 3 days',
        etaInDays: 3,
        price: 2500
    },
    express: {
        title: 'Same Day Delivery',
        description: 'Arrives within 24 hours',
        etaInDays: 1,
        price: 6500
    },
  vendorManaged: {
          title: 'Vendor Managed Delivery',

            pickup: [
                {
                    "status": null,
                    "storeId": 0,
                    "storeName": ""
                }
            ],
         
            vendorManaged: [
                {
                    "fee": 0,
                    "status": null,
                    "storeId": 0,
                    "storeName": "",
                    "estimatedTime": null
                }
            ],
            vendorManagedTotal: 0
        }
}