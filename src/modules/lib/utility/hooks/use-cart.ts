import { useEffect } from 'react';
import { useCartStore } from '../store/cart.store';
import { CartItem } from '../types/cart.interface';
import { useAuthGuard } from './use-auth-guard';
import useUserStore from '../store/user.store';

export const useCart = () => {
    const { cart, fetchCart, addToCart, fetching, removeFromCart, incrementCartItem, decrementCartItem, isLoginModal, showLoginModal } = useCartStore();
    const { isAuthenticated } = useUserStore()

    const increment = (cartItem: CartItem) => {
        if (cartItem.quantity >= cartItem.variant.stock) return;
        incrementCartItem(cartItem.variant.id, cartItem.variant.incrementBy)
    }

    const decrement = (cartItem: CartItem) => {
        if (cartItem.quantity <= cartItem.variant.minPurchaseQuantity) {
            return removeFromCart(cartItem.id)
        };

        decrementCartItem(cartItem.variant.id, cartItem.variant.incrementBy)
    }

    useEffect(() => {
        if (!cart.id && isAuthenticated && !fetching) {
            console.log({cart, isAuthenticated, fetching})
            fetchCart();
        }
    });

    return { cart, addToCart, removeFromCart, increment, decrement, isAuthenticated, isLoginModal, showLoginModal };
};
