import { useEffect } from 'react';
import { useCartStore } from '../store/cart.store';
import { CartItem } from '../types/cart.interface';

export const useCart = () => {
    const { cart, fetchCart, addToCart, removeFromCart, incrementCartItem, decrementCartItem } = useCartStore();

    const increment = (cartItem: CartItem) => {
        if (cartItem.quantity >= cartItem.variant.stock) return;
        incrementCartItem(cartItem.variant.id, cartItem.variant.incrementBy)
    }
    const decrement = (cartItem: CartItem) => {
        if (cartItem.quantity <= cartItem.variant.minPurchaseQuantity) return;
        decrementCartItem(cartItem.variant.id, cartItem.variant.incrementBy)
    }

    useEffect(() => {
        if (!cart.id) {
            fetchCart();
        }
    }, []);

    return { cart, addToCart, removeFromCart, increment, decrement };
};
