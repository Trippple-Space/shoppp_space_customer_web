import { create } from 'zustand';
import { Product } from '../types/product.interface';

interface ProductStore {
    productsCache: {
        [x: string]: Product[]
    };
    productCacheIdempotencyTracker: {
        [x: string]: {
            [x: number]: true
        }
    }
    setProductsCache: (cacheKey: string, products: Product[]) => void;
    setProductsCacheIdempotencyTracker: (cacheKey: string, productIds: {[x:number]: true}) => void;
}

const placeholderProduct: Product = {
    longDescription: "",
    keywords: [],
    tags: [{ label: "" }],
    id: 0,
    slug: "",
    price: 0,
    name: "",
    type: "",
    stockUnit: "",
    status: 0,
    dateCreated: "",
    lastUpdated: "",
    reviewRating: 0,
    reviews: undefined,
    comments: undefined,
    variants: [
         {
              id: 0,
              media: [
                   {
                        url: "",
                        type: "image",
                   },
            ],
              status:'',
              stock: 0,
              price: 0,
              finalPrice: 0,
              minPurchaseQuantity: 0,
              incrementBy: 0,
              meta: undefined,
              properties: undefined,
              stockUnit: "",
              dateCreated: "",
              lastUpdated: "",
              preOrder: false,
         },
    ],
    store: {
        name: "",
        slug: "",
        id: 0,
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
    setProductsCacheIdempotencyTracker: (cacheKey: string, productIds: {[x:number]: true}) =>
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
