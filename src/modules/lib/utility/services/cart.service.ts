import { AxiosResponse } from "axios";
import endpoints from "../endpoints";
import http from "../http";
import { BuyAgain, Cart, CartItem, StoreGroupResponse } from "../types/cart.interface";
import { toast } from "sonner";

class CartService {
     fetchCart(isCheckout?: boolean): Promise<Cart> {
          return new Promise((resolve, reject) => {
               http.get(isCheckout ? endpoints.CHECKOUTCART : endpoints.CART)
                 .then((response: AxiosResponse) => {
                      
                   const cartData = response.data;
                   let combinedItems: CartItem[] = [];

                   combinedItems = cartData.storeGroups?.flatMap((group: StoreGroupResponse) => group.items);

                    const combinedCart: Cart = {
                          ...cartData,
                          cartItems: combinedItems,
                          storeGroups: cartData.storeGroups.map((group: StoreGroupResponse) => ({
                                ...group,
                                items: group.items.sort((a, b) => a.id - b.id),
                          })),
                    };

                   

                   resolve(combinedCart);
                    })
                    .catch((error) => {
                         console.error("Error fetching cart:", error);
                         reject();
                    });
          });
     }

     addToCart(variantId: number, quantity: number): Promise<Cart> {
          
          return new Promise((resolve, reject) => {
           
                    
               http.post(endpoints.CART, { variantId, quantity })
                    .then((response) => {
                     
                     
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
    const outOfStockItems: { productName: string; quantity: number; variantId: number }[] = [];
    const otherFailedReasons: { productName: string; quantity: number; variantId: number; reason: string }[] = [];
    const addedItems: { productName: string; quantity: number; variantId: number }[] = [];

    return new Promise((resolve, reject) => {


        http.post(endpoints.MULTIPLECART, { items: buyAgainItems })
            .then((response) => {
                const res = response.data;
              const cartData = res.cart;
              

                   let combinedItems: CartItem[] = [];
                   
                   combinedItems = cartData.storeGroups?.flatMap((group: StoreGroupResponse) => group.items);

                    const combinedCart: Cart = {
                          ...cartData,
                          cartItems: combinedItems,
                          storeGroups: cartData.storeGroups.map((group: StoreGroupResponse) => ({
                                ...group,
                                items: group.items.sort((a, b) => a.id - b.id),
                          })),
                    };
                   

                res.summary.addedItems.forEach((item: { productName: string, quantity: number, variantId: number }) => {
                    addedItems.push(item);
                });

                res.summary.failedItems.forEach((item: { productName: string, quantity: number, variantId: number, reason: string }) => {
                    if (item.reason === 'Out of stock') {
                        outOfStockItems.push(item);
                    } else {
                        otherFailedReasons.push(item);
                    }
                });

                // Combine error messages into one toast
                const errorMessages = [];
                if (outOfStockItems.length > 0) {
                    errorMessages.push(`${outOfStockItems.length} item(s) are out of stock`);
                }
                if (otherFailedReasons.length > 0) {
                    errorMessages.push(`${otherFailedReasons.length} item(s) failed to add to cart`);
                }
                if (errorMessages.length > 0) {
                    toast.error(
                        `${errorMessages.join(", ")}. ${addedItems.length} item(s) added to cart`,
                        { duration: 2000 }
                    );
                }

           

                this.fetchCart()
                    .then((updatedCartData) => {
                   resolve(combinedCart);
                        resolve(updatedCartData);
                    })
                    .catch((error) => {
                        console.error("Error fetching updated cart:", error);
                        reject(error);
                    }).finally(() => {
                        toast.success("Cart updated successfully", { duration: 2000 });
                    })
            })
            .catch((error) => {
                console.error("Error adding to cart:", error);
                reject(error);
            });
    });
}


     removeFromCart(cartItemId: number): Promise<Cart> {
          return new Promise((resolve, reject) => {
               http.delete(`${endpoints.CART}/remove/${cartItemId}`)
                    .then((response) => {
                         const cartData = response.data;
                   let combinedItems: CartItem[] = [];
                   
                   combinedItems = cartData.storeGroups?.flatMap((group: StoreGroupResponse) => group.items);

                    const combinedCart: Cart = {
                          ...cartData,
                          cartItems: combinedItems,
                          storeGroups: cartData.storeGroups.map((group: StoreGroupResponse) => ({
                                ...group,
                                items: group.items.sort((a, b) => a.id - b.id),
                          })),
                    };
          
                           this.fetchCart()
                    .then((updatedCartData) => {
                   resolve(combinedCart);
                        resolve(updatedCartData);
                    })
                    .catch((error) => {
                        console.error("Error fetching updated cart:", error);
                        reject(error);
                    });
                    
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
      
              

                   let combinedItems: CartItem[] = [];
                   
                   combinedItems = cartData.storeGroups?.flatMap((group: StoreGroupResponse) => group.items);

                    const combinedCart: Cart = {
                          ...cartData,
                          cartItems: combinedItems,
                          storeGroups: cartData.storeGroups.map((group: StoreGroupResponse) => ({
                                ...group,
                                items: group.items.sort((a, b) => a.id - b.id),
                          })),
                    };

                   

                   resolve(combinedCart);
                    })
                    .catch((error) => {
                         console.error("Error updating item quantity:", error);
                         reject(error);
                    });
          });
     }
  
  applyDiscountCode(code: string): Promise<Cart> {
    return new Promise((resolve, reject) => {
      http.post(`${endpoints.CART}/apply-discount`, {
        "discountCode": code        
      })
            .then((response) => {
                const cartData = response.data;
                let combinedItems: CartItem[] = [];

                combinedItems = cartData.storeGroups?.flatMap((group: StoreGroupResponse) => group.items);

                const combinedCart: Cart = {
                    ...cartData,
                    cartItems: combinedItems,
                    storeGroups: cartData.storeGroups.map((group: StoreGroupResponse) => ({
                        ...group,
                        items: group.items.sort((a, b) => a.id - b.id),
                    })),
                };
                toast.success("Discount code applied successfully", { duration: 2000 });
              this.fetchCart(true).then((updatedCartData) => {
                    resolve(updatedCartData);
                    resolve(combinedCart);
                }).catch((error) => {
                    console.error("Error fetching updated cart:", error);
                    reject(error);
                });
            })

            .catch((error) => {
                console.error("Error applying discount code:", error);
                reject(error);
            });
    });
   }

   removeDiscountCodes() {
    return new Promise(() => {
        http.post(`${endpoints.CART}/remove-discount`).then((response) => {
            console.log(response.data)
        })
    })
   }
  
}

export const cartService = new CartService();
