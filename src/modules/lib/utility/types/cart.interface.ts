import { ProductVariant } from "./product.interface";

export interface Cart {
    id: number;
    userId: number;
    subTotal: number;
    total: number;
    cartItems: CartItem[]
}

export interface CartItem {
    id: string,
    productId: string,
    quantity: number,
    variant: ProductVariant
}