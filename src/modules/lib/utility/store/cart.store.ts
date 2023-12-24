import { create } from 'zustand';
import { cartService } from '../services/cart.service';
import { Cart } from '../types/cart.interface';

type CartStore = {
    cart: Cart;
    fetching: boolean;
    fetchCart: () => void;
    addToCart: (variantId: number, quantity: number) => void;
    incrementCartItem: (variantId: number, quantity: number) => void;
    decrementCartItem: (variantId: number, quantity: number) => void;
    removeFromCart: (variantId: number) => void;
};

export const useCartStore = create<CartStore>((set) => ({
    cart: {
        cartItems: [],
        id: 0,
        userId: 0,
        subTotal: 0,
        total: 0,
    },        
    fetching: false,
    fetchCart: async () => {
        try {
            set({ fetching: true })
            const cartData = await cartService.fetchCart();
            set({ cart: cartData, fetching: false });
        } catch (error) {
            set({ fetching: false })
            console.error('Error fetching cart:', error);
        }
    },
    addToCart: async (variantId: number, quantity: number = 1) => {

        const updatedCart = await cartService.addToCart(variantId, quantity);
        set({ cart: updatedCart });

        console.log(`Adding ${quantity} of product ${variantId} to the cart`);
    },
    incrementCartItem: async (variantId: number, quantity: number = 1) => {

        const updatedCart = await cartService.addToCart(variantId, quantity);
        set({ cart: updatedCart });

        console.log(`Adding ${quantity} of product ${variantId} to the cart`);
    },
    decrementCartItem: async (variantId: number, quantity: number = 1) => {
        const updatedCart = await cartService.addToCart(variantId, -quantity);
        set({ cart: updatedCart });
        console.log(`Removing ${quantity} of product ${variantId} from the cart`);
    },
    removeFromCart: async (cartItemId: number) => {
        const updatedCart = await cartService.removeFromCart(cartItemId);
        set({ cart: updatedCart });
    
        console.log(`Removing product ${cartItemId} from the cart`);
      },
}));
