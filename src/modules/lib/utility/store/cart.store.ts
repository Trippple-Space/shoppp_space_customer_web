import { create } from "zustand";
import { cartService } from "../services/cart.service";
import { BuyAgain, Cart, CartItem } from "../types/cart.interface";
import { toast } from "sonner";

type CartStore = {
  cart: Cart;
  fetching: boolean;
  applyingCode: boolean;
  showLoginModal: boolean;
  pendingRequests: Record<string, number>;
  fetchCart: (isCheckout?: boolean) => void;
  addToCart: (variantId: string, quantity?: number, userConfigurations?: Record<string, any>) => void;
  incrementCartItem: (variantId: string, quantity?: number, userConfigurations?: Record<string, any>) => void;
  decrementCartItem: (variantId: string, quantity?: number, userConfigurations?: Record<string, any>) => void;
  removeFromCart: (variantId: string) => void;
  buyAgain: (buyAgainItems: BuyAgain[]) => void;
  applyDiscount: (code: string) => void;
  removeDiscountCode: () => void;
  isLoginModal: () => void;
};

export const useCartStore = create<CartStore>((set, get) => ({
  cart: {
    cartItems: [],
    id: "",
    userId: "",
    subTotal: 0,
    total: 0,
    totalDiscountedPrice: 0,
    totalDiscountValue: 0,
    meta: undefined,
    createAt: "",
    lastUpdated: "",
    storeGroups: [],
    discountValue: 0,
    discountedPrice: 0,
    systemDiscountCode: "",
    systemDiscountValue: 0,
  },

  fetching: true,
  applyingCode: false,
  showLoginModal: false,
  pendingRequests: {},

  // Fetch cart from backend
  fetchCart: async (isCheckout?: boolean) => {
    try {
      set({ fetching: true });
      const cartData = await cartService.fetchCart(isCheckout);
      set({ cart: cartData, fetching: false });
    } catch {
      set({ fetching: false });
    }
  },

  // Add to cart (non-optimistic, waits for backend)
  addToCart: async (variantId, quantity = 1, userConfigurations) => {
    try {
      const updatedCart = await cartService.addToCart(variantId, quantity, userConfigurations);
      set({ cart: updatedCart });
    } catch {
      toast.error("Failed to add item to cart.");
    }
  },

  // Increment item quantity (optimistic)
  incrementCartItem: async (variantId, quantity = 1, userConfigurations) => {
    const prevCart = get().cart;

    // Immediately reflect UI changes
    const optimisticCart = {
      ...prevCart,
      cartItems: prevCart.cartItems.map((item) =>
        item.variant.id === variantId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ),
    };
    set({ cart: optimisticCart });

    // Track request ID to prevent flicker if multiple clicks occur
    const requestId = (get().pendingRequests[variantId] ?? 0) + 1;
    set((state) => ({
      pendingRequests: { ...state.pendingRequests, [variantId]: requestId },
    }));

    try {
      const updatedCart = await cartService.addToCart(variantId, quantity, userConfigurations);
      const latest = get().pendingRequests[variantId];
      if (latest === requestId) {
        set({ cart: updatedCart });
      }
    } catch {
      set({ cart: prevCart });
      toast.error("Failed to update cart.");
    }
  },

  // Decrement item quantity (optimistic)
  decrementCartItem: async (variantId, quantity = 1, userConfigurations) => {
    const prevCart = get().cart;

    // Update UI immediately
    const optimisticCart = {
      ...prevCart,
      cartItems: prevCart.cartItems
        .map((item) =>
          item.variant.id === variantId
            ? { ...item, quantity: Math.max(item.quantity - quantity, 0) }
            : item
        )
        .filter((item) => item.quantity > 0),
    };
    set({ cart: optimisticCart });

    const requestId = (get().pendingRequests[variantId] ?? 0) + 1;
    set((state) => ({
      pendingRequests: { ...state.pendingRequests, [variantId]: requestId },
    }));

    try {
      const updatedCart = await cartService.addToCart(variantId, -quantity, userConfigurations);
      const latest = get().pendingRequests[variantId];
      if (latest === requestId) {
        set({ cart: updatedCart });
      }
    } catch {
      set({ cart: prevCart });
      toast.error("Failed to update cart.");
    }
  },

  // Remove item from cart (non-optimistic)
  removeFromCart: async (variantId: string) => {
    const prevCart = get().cart;
    const optimisticCart = {
      ...prevCart,
      cartItems: prevCart.cartItems.filter(
        (item) => item.variant.id !== variantId
      ),
    };
    set({ cart: optimisticCart });

    try {
      const updatedCart = await cartService.removeFromCart(variantId);
      set({ cart: updatedCart });
    } catch {
      set({ cart: prevCart });
    }
  },

  // Buy again
  buyAgain: async (buyAgainItems: BuyAgain[]) => {
    set({ fetching: true });
    try {
      const updatedCart = await cartService.buyAgain(buyAgainItems);
      set({ cart: updatedCart, fetching: false });
    } catch {
      set({ fetching: false });
    }
  },

  // Apply discount
  applyDiscount: async (code: string) => {
    try {
      set({ applyingCode: true });
      const updatedCart = await cartService.applyDiscountCode(code);
      set({ cart: updatedCart, applyingCode: false });
    } catch (error) {
      set({ applyingCode: false });
      if (error instanceof Object && 'status' in error && error.status === 400) {
        toast.error("Invalid discount code.");
        return;
      }
      toast.error("Failed to apply discount code.");
    }
  },

  // Remove discount code
  removeDiscountCode: async () => {
    try {
      await cartService.removeDiscountCodes();
    } catch { }
  },

  // Toggle login modal
  isLoginModal: () =>
    set((state) => ({
      showLoginModal: !state.showLoginModal,
    })),
}));
