import { create } from 'zustand';
import { cartService } from '../services/cart.service';
import { Cart } from '../types/cart';

type CartStore = {
    cart: Cart;
    fetchCart: () => void;
    addToCart: (variantId: number, quantity: number) => void;
};

export const useCartStore = create<CartStore>((set) => ({
    cart: { cartItems: []},
    fetchCart: async () => {
        try {
            const cartData = await cartService.fetchCart();
            set({ cart: cartData });
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    },
    addToCart: async (variantId: number, quantity: number = 1) => {

        const updatedCart = await cartService.addToCart(variantId, quantity);
        set({ cart: updatedCart });

        console.log(`Adding ${quantity} of product ${variantId} to the cart`);
    },
}));
