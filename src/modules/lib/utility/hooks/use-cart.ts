import { useEffect } from 'react';
import { useCartStore } from '../store/cart.store';

export const useCart = () => {
    const { cart, fetchCart, addToCart } = useCartStore();

    useEffect(() => {
        if (!cart.cartItems.length) {
            fetchCart();
        }
    }, []);

    return { cart, addToCart };
};
