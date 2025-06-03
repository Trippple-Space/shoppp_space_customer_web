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
    pickup: {
        title: 'Pick Up',
        description: 'Pick up in stores close to you',
        etaInDays: '',
        price: 0
    }
}