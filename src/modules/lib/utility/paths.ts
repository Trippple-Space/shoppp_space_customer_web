export const paths = {
     login: "/auth/login",
     signup: "/auth/signup",
     verify: "/auth/verify",
     create_password: "/auth/create-password",
     vendor_signup: "/auth/signup/vendor",
     storefront_about: "$storefront/about",
     product_details: "/product-details",
     checkout: "/checkout",
     homepage: "/",
     asoebi_fabrics: "/fabrics",
     asoebi_wears: "/wears",
  explore: "/explore",
  orders: "/orders",
  vendor_link: "https://vendor.asoebi.africa/auth/signup"
};

export const protectedPaths = [paths.checkout, paths.orders];
