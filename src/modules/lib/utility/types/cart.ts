export interface Cart {
    cartItems: CartItem[]
}

export interface CartItem {
    id: string,
    productId: string,
    quantity: number
}