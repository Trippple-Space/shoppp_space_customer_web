import { create } from 'zustand';
import { cartService } from '../services/cart.service';
import { Cart } from '../types/cart.interface';

type CartStore = {
    cart: Cart;
    fetchCart: () => void;
    addToCart: (variantId: number, quantity: number) => void;
    removeFromCart: (variantId: number) => void;
};

export const useCartStore = create<CartStore>((set) => ({
    cart: {
        cartItems: [],
        id: 0,
        userId: 0,
        subTotal: 0,
        total: 0
    },
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
    removeFromCart: async (cartItemId: number) => {
        const updatedCart = await cartService.removeFromCart(cartItemId);
        set({ cart: updatedCart });
    
        console.log(`Removing product ${cartItemId} from the cart`);
      },
}));
