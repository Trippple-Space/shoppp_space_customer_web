import { create } from "zustand";
import { cartService } from "../services/cart.service";
import { BuyAgain, Cart, CartItem } from "../types/cart.interface";

type CartStore = {
     cart: Cart;
     fetching: boolean;
     fetchCart: () => void;
     addToCart: (variantId: number, quantity: number) => void;
     buyAgain: (buyAgainItems: BuyAgain[]) => void;
     incrementCartItem: (variantId: number, quantity: number) => void;
     decrementCartItem: (variantId: number, quantity: number) => void;
     removeFromCart: (variantId: number) => void;
     isLoginModal: () => void;
  showLoginModal: boolean;
     applyDiscount: (code: string, storeGroupId: number) => void;
};

export const useCartStore = create<CartStore>((set) => ({
     cart: {
       cartItems: [],
       id: 0,
       userId: 0,
       subTotal: 0,
       total: 0,
       totalDiscountedPrice: 0,
       totalDiscountValue: 0,
       meta: undefined,
       dateCreated: "",
       lastUpdated: "",
       storeGroups: []
  },
  
     fetching: false,
     fetchCart: async () => {
          try {
               set({ fetching: true });
               const cartData = await cartService.fetchCart();
               set({ cart: cartData, fetching: false });
          } catch (error) {
               set({ fetching: false });
               console.error("Error fetching cart:", error);
          }
     },
     addToCart: async (variantId: number, quantity: number = 1) => {
       const updatedCart = await cartService.addToCart(variantId, quantity);
          set({ cart: updatedCart });
     },
     buyAgain: async (buyAgainItems: BuyAgain[]) => {
          set({fetching: true})
          const updatedCart = await cartService.buyAgain(buyAgainItems);
          set({ cart: updatedCart , fetching: false});
     },
     incrementCartItem: async (variantId: number, quantity: number = 1) => {
          const updatedCart = await cartService.addToCart(variantId, quantity);
          set({ cart: updatedCart });
     },
     decrementCartItem: async (variantId: number, quantity: number = 1) => {
          const updatedCart = await cartService.addToCart(variantId, -quantity);
          set({ cart: updatedCart });
     },
     removeFromCart: async (variantId: number) => {
          const updatedCart = await cartService.removeFromCart(variantId);
          set({ cart: updatedCart });
  },
  applyDiscount: async (code: string, storeGroupId: number) => {
       const updatedCart = await cartService.applyDiscountCode(code, storeGroupId);
       set({ cart: updatedCart });
     },
     showLoginModal: false,
     isLoginModal: () =>
          set((state) => {
               const newState = !state.showLoginModal;

               return { showLoginModal: newState };
          }),
}));
