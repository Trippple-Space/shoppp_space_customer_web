import { AxiosResponse } from "axios";
import endpoints from "../endpoints";
import http from "../http";
import { BuyAgain, Cart, CartItem } from "../types/cart.interface";
import { toast } from "sonner";

class CartService {
     fetchCart(): Promise<Cart> {
          return new Promise((resolve, reject) => {
               http.get(endpoints.CART)
                    .then((response: AxiosResponse) => {
                         const cartData = response.data;
                         cartData.cartItems = cartData.cartItems.sort(
                              (a: CartItem, b: CartItem) => a.id - b.id
                         );
                         resolve(cartData);
                    })
                    .catch((error) => {
                         console.error("Error fetching cart:", error);
                         reject();
                    });
          });
     }

     addToCart(variantId: number, quantity: number): Promise<Cart> {
          
          return new Promise((resolve, reject) => {
               console.log({ variantId, quantity }, 'cart');
                    
               http.post(endpoints.CART, { variantId, quantity })
                    .then((response) => {
                         const cartData = response.data;
                         console.log({ cartData }, 'cartData')
                         cartData.cartItems = cartData.cartItems.sort(
                              (a: CartItem, b: CartItem) => a.id - b.id
                         );
                         this.fetchCart()
                              .then((updatedCartData) => {
                                   resolve(updatedCartData);
                              })
                              .catch((error) => {
                                   console.error(
                                        "Error fetching updated cart:",
                                        error
                                   );
                                   reject(error);
                              });
                    })
                    .catch((error) => {
                         console.error("Error adding to cart:", error);
                         reject(error);
                    });
          });
     }

     buyAgain(buyAgainItems: BuyAgain[]): Promise<Cart> {
          
          return new Promise((resolve, reject) => {
               console.log({items: buyAgainItems});
               
               http.post(endpoints.MULTIPLECART, {items: buyAgainItems})
                    .then((response) => {
                         const res = response.data;
                         res.summary.failedItems.forEach((item: {productName: string, quantity: number, variantId: number}) => {
                              toast.success(`${item.productName} is out of stock`, {duration: 2000})
                         })

                         console.log(res)
                         this.fetchCart()
                              .then((updatedCartData) => {
                                   resolve(updatedCartData);
                              })
                              .catch((error) => {
                                   console.error(
                                        "Error fetching updated cart:",
                                        error
                                   );
                                   reject(error);
                              });
                    })
                    .catch((error) => {
                         console.error("Error adding to cart:", error);
                         reject(error);
                    }).finally(() => {
                         toast.success("Cart updated successfully", {duration: 2000})
                    })
          });
     }

     removeFromCart(variantId: number): Promise<Cart> {
          return new Promise((resolve, reject) => {
               http.delete(`${endpoints.CART}/${variantId}`)
                    .then((response) => {
                         const cartData = response.data;
                         cartData.cartItems = cartData.cartItems.sort(
                              (a: CartItem, b: CartItem) => a.id - b.id
                         );
                         resolve(cartData);
                    })
                    .catch((error) => {
                         console.error("Error removing from cart:", error);
                         reject(error);
                    });
          });
     }

     updateItemQuantity(variantId: number, quantity: number): Promise<Cart> {
          return new Promise((resolve, reject) => {
               http.put(`${endpoints.CART}/${variantId}`, { quantity })
                    .then((response) => {
                         const cartData = response.data;
                         cartData.cartItems = cartData.cartItems.sort(
                              (a: CartItem, b: CartItem) => a.id - b.id
                         );
                         resolve(cartData);
                    })
                    .catch((error) => {
                         console.error("Error updating item quantity:", error);
                         reject(error);
                    });
          });
     }
}

export const cartService = new CartService();
