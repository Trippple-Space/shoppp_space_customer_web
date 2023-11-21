import { AxiosResponse } from 'axios';
import endpoints from '../endpoints';
import http from '../http';
import { Cart, CartItem } from '../types/cart';

class CartService {
  fetchCart(): Promise<Cart> {
    return new Promise((resolve) => {
      http.get(endpoints.CART)
        .then((response: AxiosResponse) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error('Error fetching cart:', error);
          resolve({ cartItems: []});
        });
    });
  }

  addToCart(variantId: number, quantity: number): Promise<Cart> {
    return new Promise((resolve, reject) => {
      http.post(endpoints.CART, { variantId, quantity })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error('Error adding to cart:', error);
          reject(error);
        });
    });
  }

  // Add more methods as needed, e.g., removeItem, updateQuantity, etc.
}

export const cartService = new CartService();
