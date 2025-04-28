import { ProductVariant } from "./product.interface";

export interface Cart {
    id: number;
    userId: number;
    subTotal: number;
    total: number;
    cartItems: CartItem[]
}

export interface CartItem {
    id: number,
    productId: string,
    quantity: number,
    variant: ProductVariant,
    totalPrice: number
}

export interface BuyAgain {
    variantId: number
    quantity: number
}