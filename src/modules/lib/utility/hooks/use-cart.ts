import { useEffect } from 'react';
import { useCartStore } from '../store/cart.store';

export const useCart = () => {
    const { cart, fetchCart, addToCart, removeFromCart } = useCartStore();

    useEffect(() => {
        if (!cart.id) {
            fetchCart();
        }
    }, []);

    return { cart, addToCart, removeFromCart };
};
