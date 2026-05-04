import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "../store/cart.store";
import { CartItem } from "../types/cart.interface";
import useUserStore from "../store/user.store";
import { toast } from "sonner";
import { guestSession } from "../guest-session";

export const useCart = (isCheckout?: boolean) => {
     const {
          cart,
          fetchCart,
          addToCart,
          buyAgain,
          fetching,
          removeFromCart,
          incrementCartItem,
          decrementCartItem,
          isLoginModal,
          showLoginModal,
          applyDiscount,
          removeDiscountCode,
          applyingCode
     } = useCartStore();
     const { isAuthenticated, user } = useUserStore();
     const hasSession = Boolean(isAuthenticated && user);
     const [guestCartVersion, setGuestCartVersion] = useState(0);

     useEffect(() => {
          const handleGuestCartUpdate = () => setGuestCartVersion((value) => value + 1);
          window.addEventListener('guest-cart-updated', handleGuestCartUpdate);
          return () => window.removeEventListener('guest-cart-updated', handleGuestCartUpdate);
     }, []);

     const effectiveCart = useMemo(() => {
          if (hasSession) {
               return cart;
          }
          return guestSession.getGuestCart();
     }, [hasSession, cart, guestCartVersion]);

     const increment = (cartItem: CartItem, userConfigurations?: Record<string, any>) => {
          if (cartItem.quantity >= cartItem.variant.stock) {
               return toast.error('You’ve reached the maximum quantity available for this item.');
          } else {
               incrementCartItem(cartItem.variant.id, cartItem.variant.incrementBy, userConfigurations);
          }
     };

     const decrement = (cartItem: CartItem, userConfigurations?: Record<string, any>) => {
          if (cartItem.quantity <= cartItem.variant.minPurchaseQuantity) {
               return removeFromCart(cartItem.id);
          } else {
               decrementCartItem(cartItem.variant.id, cartItem.variant.incrementBy, userConfigurations)
          }
     };



     useEffect(() => {
          if (!cart.id && hasSession && !fetching) {
               fetchCart(isCheckout);
          }
     }, [hasSession, cart.id, fetching, fetchCart, isCheckout]);

     return {
          cart: effectiveCart,
          addToCart,
          buyAgain,
          removeFromCart,
          increment,
          decrement,
          fetching,
          fetchCart,
          applyDiscount,
          applyingCode,
          removeDiscountCode,
          isAuthenticated,
          isLoginModal,
          showLoginModal,
     };
};
