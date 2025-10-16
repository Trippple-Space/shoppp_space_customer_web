import { create } from 'zustand';
import { Product } from '../types/product.interface';

interface ProductStore {
    productsCache: {
        [x: string]: Product[]
    };
    productCacheIdempotencyTracker: {
        [x: string]: {
            [x: string]: true
        }
    }
    setProductsCache: (cacheKey: string, products: Product[]) => void;
    setProductsCacheIdempotencyTracker: (cacheKey: string, productIds: {[x:string]: true}) => void;
}

const placeholderProduct: Product = {
    longDescription: "",
    keywords: [],
    tags: [{ label: "" }],
    id: "",
    slug: "",
    price: 0,
    name: "",
    type: "",
    stockUnit: "",
    status: 0,
    createAt: "",
    shortDescription: "",
    lastUpdated: "",
    reviewRating: 0,
    reviews: undefined,
    comments: undefined,
    discount: {
        id: "",
        title: "",
        discountCode: "",
        discountType: "",
        discountCalculationType: "",
        value: 0,
        activeStartDate: "",
        activeEndDate: "",
        status: "",
        minOrderAmount: 0,
        minOrderQuantity: 0,
        channel: [],
        createdAt: "",
        updatedAt: ""
    },
    variants: [
         {
              id: "",
              media: [
                   {
                        url: "",
                        type: "image",
                   },
            ],
            size:[
                {
                    size: "",
                    quantity: 0,
                    isAvailable: false
                }
            ],
              status:'',
              stock: 0,
              price: 0,
              finalPrice: 0,
              discountedPrice: 0,
              minPurchaseQuantity: 0,
              incrementBy: 0,
              meta: undefined,
              properties: undefined,
              stockUnit: "",
              createAt: "",
              lastUpdated: "",
              preOrder: false,
         },
    ],
    store: {
        name: "",
        slug: "",
        id: "",
        description: "",
        status: 'ACTIVE',
        type: "",
        thumbnail: '',
        heading: '',
        subHeading: '',
        meta: null
    },
    finalPrice: 0,
};


export const useProductStore = create<ProductStore>((set) => ({
    productsCache: {
        placeholder: Array.from({ length: 10 }).map(() => placeholderProduct)
    },
    productCacheIdempotencyTracker: {},
    setProductsCache: (cacheKey, products) =>
        set((state) => ({
            productsCache: {
                ...state.productsCache,
                [cacheKey]: products ?? [],
            },
        })),
    setProductsCacheIdempotencyTracker: (cacheKey: string, productIds: {[x:string]: true}) =>
        set((state) => ({
            productCacheIdempotencyTracker: {
                ...state.productCacheIdempotencyTracker,
                [cacheKey]: {
                    ...(state.productCacheIdempotencyTracker[cacheKey] ?? []),
                    ...productIds
                },
            },
        })),
}));
