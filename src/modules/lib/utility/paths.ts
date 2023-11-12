export const paths = {
    login: '/auth/login',
    signup: '/auth/signup',
    vendor_signup: '/auth/signup/vendor',
    storefront_about: '$storefront/about',
    product_details: '/product-details',
    checkout: '/checkout',
    homepage: '/',
    asoebi_wears: '/homepage/asoebiwears'
}

export const protectedPaths = [
    paths.checkout,
    paths.asoebi_wears
]
