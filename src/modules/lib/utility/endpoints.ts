const endpoints = {
  SIGN_IN: "/auth/login",
  SIGN_UP: "/auth/register",
  VALIDATE_TOKEN: "/auth/validate",
  PRODUCT_CATEGORIES: "product/categories",
  PRODUCTS: "products",
  PRODUCT: "products/:slug",
  SEARCH_PRODUCTS: "products",
  CART: "/cart",
  USER_ADDRESSES: "users/:userId/addresses",
  PAY_WITH_PAYSTACK: "payment/initialize/paystack",
  STORES: "stores",
  STORE: "stores/:slug",
  ORDERS: "orders",
  LOG_VISIT: "/store-visit/log/:storeID",
  GET_VISIT: "/store-visit/:storeID?period=monthly",
  GET_PRODUCT_SOLD: "/orders/product-sold/:storeID",
};

export default endpoints;
