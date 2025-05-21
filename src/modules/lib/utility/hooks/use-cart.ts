import { useEffect } from "react";
import { useCartStore } from "../store/cart.store";
import { CartItem } from "../types/cart.interface";
import { useAuthGuard } from "./use-auth-guard";
import useUserStore from "../store/user.store";
import { toast } from "sonner";

export const useCart = () => {
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
     const { isAuthenticated } = useUserStore();

     const increment = (cartItem: CartItem) => {
          if (cartItem.quantity >= cartItem.variant.stock) {
               return toast.error('You’ve reached the maximum quantity available for this item.');   
          } else {
          incrementCartItem(cartItem.variant.id, cartItem.variant.incrementBy);
          }
     };

     const decrement = (cartItem: CartItem) => {
          if (cartItem.quantity <= cartItem.variant.minPurchaseQuantity) {
               return removeFromCart(cartItem.id);
          }

          decrementCartItem(cartItem.variant.id, cartItem.variant.incrementBy);
     };



     useEffect(() => {
          if (!cart.id && isAuthenticated && !fetching) {
            fetchCart();
            
          }
     },[isAuthenticated]);

     return {
          cart,
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
